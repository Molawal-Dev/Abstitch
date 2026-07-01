"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

//Social Icon SVGs
const LinkedInIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

//Slide Data
interface Slide {
  id: string;
  seasonTag: string;
  tag: string;
  headingLine1: string;
  headingLine2: string;
  watermarkLines: string[];
  watermarkFontSize: string;
  watermarkColor: string;
  description: string;
  cta: { label: string; href: string };
  leftBg: string;
  rightBg: string;
  image: string;
  partnerBadge?: "portwest";
}

const SLIDES: Slide[] = [
  {
    id: "school",
    seasonTag: "SPRING / SUMMER 2026",
    tag: "TOP DEALS",
    headingLine1: "SCHOOL",
    headingLine2: "WEAR",
    watermarkLines: ["Schoolwear"],
    watermarkFontSize: "154px",
    watermarkColor: "rgba(0,0,0,0.15)",
    description:
      "Comfortable, smart school uniforms designed for everyday wear trusted by schools and parents.",
    cta: { label: "SHOP NOW", href: "/shop/school-wear" },
    leftBg: "#7B1118",
    rightBg: "#0D0714",
    image: "/home-banners/school-image.png",
  },
  {
    id: "ppe",
    seasonTag: "SPRING / SUMMER 2026",
    tag: "SAFETY WEAR",
    headingLine1: "PERSONAL",
    headingLine2: "PROTECTION",
    watermarkLines: ["PPE & WORKWEAR"],
    watermarkFontSize: "clamp(67px, 12vw, 117px)",
    watermarkColor: "rgba(255,255,255,0.2)",
    description:
      "Premium workwear, PPE and safety equipment for businesses across Aberdeen and beyond.",
    cta: { label: "SHOP NOW", href: "/shop/safety-wear" },
    leftBg: "#1A3D58",
    rightBg: "#0A1726",
    image: "/home-banners/ppe-image.png",
    partnerBadge: "portwest",
  },
  {
    id: "services",
    seasonTag: "SPRING / SUMMER 2026",
    tag: "TAILORED, TRUSTED, EFFICIENT",
    headingLine1: "OUR",
    headingLine2: "SERVICES",
    watermarkLines: ["Our Services"],
    watermarkFontSize: "154px",
    watermarkColor: "rgba(255,255,255,0.18)",
    description:
      "Crafting style through embroidery, custom printing, and perfect fits.",
    cta: { label: "SEE SERVICES", href: "/services" },
    leftBg: "#680D10",
    rightBg: "#1A0305",
    image: "/home-banners/embroidery-image.png",
  },
];

//Font constants
const POPPINS = "var(--font-poppins, Poppins, sans-serif)";
const MONTSERRAT = "var(--font-montserrat, Montserrat, sans-serif)";

//Animation helper
function anim(
  name: string,
  duration: string,
  delay: string,
  easing = "ease-out"
): React.CSSProperties {
  return {
    animationName: name,
    animationDuration: duration,
    animationTimingFunction: easing,
    animationFillMode: "both",
    animationDelay: delay,
  };
}

//Portwest partner badge
function PortwestBadge({ animKey }: { animKey: number }) {
  return (
    <div
      key={`badge-${animKey}`}
      style={{
        marginBottom: "14px",
        ...anim("revFadeInUp", "0.5s", "480ms"),
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          border: "1.5px solid rgba(255,255,255,0.35)",
          borderRadius: "4px",
          padding: "8px 12px 8px 10px",
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <Image
          src="/home-banners/portwest-logo.png"
          alt="Portwest"
          width={88}
          height={28}
          style={{ objectFit: "contain", display: "block" }}
        />
        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "26px",
            backgroundColor: "rgba(255,255,255,0.35)",
          }}
        />
        {/* Label */}
        <div>
          <p
            style={{
              fontFamily: MONTSERRAT,
              fontSize: "8px",
              fontWeight: 600,
              color: "white",
              letterSpacing: "1.8px",
              margin: 0,
              lineHeight: "13px",
              textTransform: "uppercase",
            }}
          >
            OFFICIAL
          </p>
          <p
            style={{
              fontFamily: MONTSERRAT,
              fontSize: "8px",
              fontWeight: 600,
              color: "white",
              letterSpacing: "1.8px",
              margin: 0,
              lineHeight: "13px",
              textTransform: "uppercase",
            }}
          >
            PORTWEST PARTNER
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const busyRef = useRef(false);

  const goTo = useCallback((idx: number) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setCurrent(idx);
    setAnimKey((k) => k + 1);
    setTimeout(() => { busyRef.current = false; }, 800);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % SLIDES.length;
        setAnimKey((k) => k + 1);
        return next;
      });
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    // FIX 1: height moved to .hero-slider-section CSS class (604px → 520px tablet → 420px mobile)
    <section
      className="hero-slider-section relative w-full overflow-hidden select-none"
      aria-label="Hero banner"
    >
      {/*Two-panel split background*/}
      <div className="absolute inset-0 flex">
        <div
          className="h-full transition-colors duration-700"
          style={{ width: "71.6%", backgroundColor: slide.leftBg }}
        />
        <div
          className="h-full transition-colors duration-700"
          style={{ width: "28.4%", backgroundColor: slide.rightBg }}
        />
      </div>

      {/*Hero image — FIX 2: hidden on mobile (hidden sm:block) so it doesn't overlay text*/}
      <div
        key={`img-${animKey}`}
        className="hidden sm:block absolute top-0 h-full z-10"
        style={{
          left: "38%",
          right: 0,
          ...anim("revSlideFromRight", "0.85s", "0ms", "cubic-bezier(0.25,0.46,0.45,0.94)"),
        }}
      >
        <Image
          src={slide.image}
          alt={`${slide.headingLine1} ${slide.headingLine2}`}
          fill
          className="object-contain object-right"
          priority
          sizes="62vw"
          quality={90}
        />
      </div>

      {/*Large watermark — FIX 3: hero-watermark class overrides font-size to 80px on mobile*/}
      <div
        key={`wm-${animKey}`}
        className="hero-watermark absolute z-20 pointer-events-none"
        style={{
          bottom: "-4px",
          left: "-41px",
          right: 0,
          overflow: "hidden",
          paddingLeft: "18.5%",
          ...anim("revFadeIn", "0.9s", "380ms"),
        }}
      >
        {slide.watermarkLines.map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: POPPINS,
              fontSize: slide.watermarkFontSize,
              fontWeight: 600,
              lineHeight: slide.watermarkLines.length > 1 ? "1em" : slide.watermarkFontSize,
              color: slide.watermarkColor,
              whiteSpace: "nowrap",
              margin: 0,
            }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Rotated season text */}
      <div
        key={`season-${animKey}`}
        className="absolute z-30 pointer-events-none hidden md:block"
        style={{
          left: "-10px",
          top: "237px",
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
          ...anim("revFadeIn", "0.6s", "200ms"),
        }}
      >
        <span
          style={{
            fontFamily: MONTSERRAT,
            fontSize: "7px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "1.85px",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {slide.seasonTag}
        </span>
      </div>

      {/* Left sidebar */}
      <div
        key={`sidebar-${animKey}`}
        className="absolute z-30 hidden md:block"
        style={{
          left: "50px",
          top: 0,
          bottom: 0,
          ...anim("revFadeIn", "0.6s", "500ms"),
        }}
      >
        {/* Thin vertical white line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "324px",
            width: "1px",
            height: "49px",
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        />
        {/* Social icons */}
        <a
          href="https://www.linkedin.com/company/abstitch/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="absolute text-white hover:text-white/50 transition-colors"
          style={{ left: "1px", top: "486px" }}
        >
          <LinkedInIcon />
        </a>
        <a
          href="https://www.facebook.com/share/1aRLP9HcLr/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="absolute text-white hover:text-white/50 transition-colors"
          style={{ left: "0px", top: "511px" }}
        >
          <FacebookIcon />
        </a>
        <a
          href="https://www.instagram.com/abstitch.aberdeen?igsh=bTA1NzZyY283MGVh"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="absolute text-white hover:text-white/50 transition-colors"
          style={{ left: "0px", top: "537px" }}
        >
          <InstagramIcon />
        </a>
      </div>

      {/*Main slide content — FIX 4: hero-content-area overrides left/width/top on mobile*/}
      <div
        className="hero-content-area absolute z-30 flex flex-col"
        style={{
          left: "clamp(80px, 18.5%, 220px)",
          top: "12%",
          width: "min(480px, 42vw)",
        }}
      >
        {/* Tag */}
        <div
          key={`tag-${animKey}`}
          style={{
            marginBottom: "20px",
            marginLeft: "4px",
            ...anim("revFadeInUp", "0.5s", "280ms"),
          }}
        >
          <p
            style={{
              fontFamily: MONTSERRAT,
              fontSize: "clamp(10px, 1vw, 14px)",
              fontWeight: 400,
              color: "white",
              letterSpacing: "4.94px",
              margin: 0,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {slide.tag}
          </p>
        </div>

        {/* Heading — FIX 5: min lowered from 53px → 32px so it scales on small screens */}
        <div
          key={`h1-${animKey}`}
          style={{
            marginBottom: "16px",
            ...anim("revFadeInUp", "0.65s", "400ms"),
          }}
        >
          <h1
            style={{
              fontFamily: POPPINS,
              fontSize: "clamp(32px, 6.2vw, 90px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 0.99,
              margin: 0,
              letterSpacing: "0px",
            }}
          >
            {slide.headingLine1}
            <br />
            {slide.headingLine2}
          </h1>
        </div>

        {/* Portwest badge*/}
        {slide.partnerBadge === "portwest" && (
          <PortwestBadge animKey={animKey} />
        )}

        {/* Description */}
        <div
          key={`desc-${animKey}`}
          style={{
            marginBottom: "22px",
            ...anim("revFadeInUp", "0.5s", "560ms"),
          }}
        >
          <p
            style={{
              fontFamily: POPPINS,
              fontSize: "clamp(13px, 0.90vw, 15px)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.62px",
              lineHeight: "19px",
              maxWidth: "345px",
              margin: 0,
            }}
          >
            {slide.description}
          </p>
        </div>

        {/* CTA */}
        <div
          key={`cta-${animKey}`}
          style={{ ...anim("revFadeInUp", "0.5s", "740ms") }}
        >
          <Link
            href={slide.cta.href}
            className="bg-white/15 border border-white/25 backdrop-blur-xl rounded-full hover:bg-white/20 transition-all px-4 py-2"
            style={{
              fontFamily: MONTSERRAT,
              fontSize: "14px",
              fontWeight: 400,
              color: "white",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              letterSpacing: "0px",
            }}
          >
            {slide.cta.label}{" "}
            <span style={{ fontSize: "20px", lineHeight: 1 }}>→</span>
          </Link>
        </div>
      </div>

      {/* Bullet navs */}
      <div
        className="absolute z-40 hidden md:flex flex-col"
        style={{
          right: "32px",
          top: "50%",
          transform: "translateY(-50%)",
          gap: "15px",
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "1px",
              backgroundColor:
                i === current
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "block",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>

      {/*Slide counter*/}
      <div
        className="absolute z-40"
        style={{
          bottom: "24px",
          right: "32px",
          fontFamily: MONTSERRAT,
          fontSize: "11px",
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "3px",
        }}
      >
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>

      {/*Mobile dots*/}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex gap-2 md:hidden">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? "28px" : "10px",
              height: "10px",
              borderRadius: "5px",
              backgroundColor:
                i === current
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.35)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </section>
  );
}
