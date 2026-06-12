"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const slides = [
  {
    id: 1,
    tag: "Spring / Summer 2025",
    title: "Dress Your School\nWith Pride",
    subtitle:
      "Premium quality school uniforms embroidered with your school crest. Trusted by Aberdeen schools for over 50 years.",
    cta: { label: "Shop School Wear", href: "/shop/school-wear" },
    cta2: { label: "Get a Quote", href: "/contact#order" },
    bg: "from-burgundy-950 via-burgundy-900 to-burgundy-800",
    image: "/home-banners/school-image.png",
    imagePosition: "object-center",
    pattern: "school",
  },
  {
    id: 2,
    tag: "Embroidery & Printing",
    title: "Your Logo,\nPerfectly Stitched",
    subtitle:
      "State-of-the-art embroidery and printing on any garment. From school crests to corporate logos — precision every time.",
    cta: { label: "Our Services", href: "/services/embroidery" },
    cta2: { label: "Contact Us", href: "/contact" },
    bg: "from-gray-950 via-gray-900 to-gray-800",
    image: "/home-banners/embroidery-image.png",
    imagePosition: "object-right",
    pattern: "embroidery",
  },
  {
    id: 3,
    tag: "Safety Wear & PPE",
    title: "Stay Safe,\nStay Compliant",
    subtitle:
      "Full range of safety wear, PPE, and workwear for industries across Scotland. Quality certified, competitively priced.",
    cta: { label: "View Garments", href: "/shop/garments" },
    cta2: { label: "Place an Order", href: "/contact#order" },
    bg: "from-slate-950 via-slate-900 to-slate-800",
    image: "/home-banners/ppe-image.png",
    imagePosition: "object-right",
    pattern: "safety",
  },
];

function SlidePattern({ type }: { type: string }) {
  if (type === "school") {
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 8 }).map((_, i) =>
          Array.from({ length: 6 }).map((_, j) => (
            <g key={`${i}-${j}`} transform={`translate(${i * 120},${j * 110})`}>
              <rect x="20" y="20" width="80" height="70" rx="4" fill="none" stroke="white" strokeWidth="1.5" />
              <rect x="35" y="10" width="50" height="20" rx="2" fill="none" stroke="white" strokeWidth="1.5" />
              <line x1="35" y1="50" x2="85" y2="50" stroke="white" strokeWidth="1" />
              <line x1="35" y1="60" x2="75" y2="60" stroke="white" strokeWidth="1" />
              <line x1="35" y1="70" x2="80" y2="70" stroke="white" strokeWidth="1" />
            </g>
          ))
        )}
      </svg>
    );
  }
  if (type === "embroidery") {
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 10 }).map((_, i) =>
          Array.from({ length: 8 }).map((_, j) => (
            <circle
              key={`${i}-${j}`}
              cx={i * 90 + (j % 2) * 45}
              cy={j * 80}
              r="3"
              fill="white"
            />
          ))
        )}
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            d={`M ${i * 180} 0 Q ${i * 180 + 90} 300 ${i * 180 + 180} 600`}
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
    );
  }
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <line
          key={i}
          x1={i * 42}
          y1="0"
          x2={i * 42 - 200}
          y2="600"
          stroke="white"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(idx);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating]
  );

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[560px] md:h-[680px] overflow-hidden">
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-all duration-700",
          slide.bg
        )}
      />

      <SlidePattern type={slide.pattern} />

      {slide.image && (
        <div className="hidden md:block absolute right-0 top-0 h-full w-1/2 z-10">
          <div className="relative h-full w-full">
            <Image
              src={slide.image}
              alt={slide.tag}
              fill
              className={`object-contain ${slide.imagePosition}`}
              priority
              sizes="50vw"
              quality={90}
            />
          </div>
        </div>
      )}

      <div className="hidden md:block absolute top-0 right-0 w-1/2 h-full opacity-10 z-0">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full border border-white" />
        <div className="absolute top-20 right-20 w-48 h-48 rounded-full border border-white" />
        <div className="absolute bottom-20 right-5 w-80 h-80 rounded-full border border-white" />
      </div>

      <div className="relative z-20 container-custom h-full flex items-center">
        <div className="max-w-2xl md:max-w-2xl w-full">
          <div
            key={`tag-${current}`}
            className="inline-flex items-center gap-2 mb-5 animate-fade-up"
          >
            <span className="h-px w-8 bg-white/60" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-white/70">
              {slide.tag}
            </span>
          </div>

          <h1
            key={`title-${current}`}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-up delay-100 whitespace-pre-line"
          >
            {slide.title}
          </h1>

          <p
            key={`sub-${current}`}
            className="font-sans text-base md:text-lg text-white/75 leading-relaxed mb-8 max-w-lg animate-fade-up delay-200"
          >
            {slide.subtitle}
          </p>

          <div
            key={`cta-${current}`}
            className="flex flex-wrap gap-4 animate-fade-up delay-300"
          >
            <Link
              href={slide.cta.href}
              className="px-7 py-3.5 bg-white text-burgundy-800 font-sans font-semibold text-sm tracking-wider uppercase rounded hover:bg-cream-100 transition-colors"
            >
              {slide.cta.label}
            </Link>
            <Link
              href={slide.cta2.href}
              className="px-7 py-3.5 border-2 border-white/50 text-white font-sans font-semibold text-sm tracking-wider uppercase rounded hover:border-white hover:bg-white/10 transition-colors"
            >
              {slide.cta2.label}
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors z-30"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors z-30"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "rounded-full transition-all duration-300",
              i === current
                ? "w-7 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-6 right-8 font-sans text-xs text-white/50 tracking-widest z-30">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
