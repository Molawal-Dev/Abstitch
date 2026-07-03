"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Shirt,
  Activity,
  Briefcase,
  Package,
} from "lucide-react";

interface Slide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string; external: boolean };
  bgFrom: string;
  bgTo: string;
  accentColor: string;
  Icon: React.ElementType;
  bgImage: string;
}

const SLIDES: Slide[] = [
  {
    id: "school-wear",
    tag: "For Schools & Parents",
    title: "School Uniforms",
    subtitle:
      "Smart, durable school uniforms embroidered with your school crest. Trusted by Aberdeen schools for over 50 years.",
    cta: { label: "Shop School Wear", href: "/shop/school-wear", external: false },
    bgFrom: "#4a0d13",
    bgTo: "#2d0009",
    accentColor: "#c9434e",
    Icon: GraduationCap,
    bgImage: "/home-banners/items-list.png",
  },
  {
    id: "safety-wear",
    tag: "Workwear & PPE",
    title: "Safety Wear",
    subtitle:
      "Full range of certified safety wear and PPE for businesses across Scotland. Official Portwest partner.",
    cta: { label: "Shop Safety Wear", href: "/shop/safety-wear", external: false },
    bgFrom: "#0f2233",
    bgTo: "#071422",
    accentColor: "#3a7bd5",
    Icon: ShieldCheck,
    bgImage: "/home-banners/items-list.png",
  },
  {
    id: "jackets",
    tag: "All-Season Outerwear",
    title: "Jackets & Fleece",
    subtitle:
      "Waterproof, insulated, and softshell jackets for every climate. Hundreds of styles from top brands.",
    cta: {
      label: "Browse Jackets",
      href: "https://abstitch.fullcollection.com/catalogue/5-product-by-type/233-jackets",
      external: true,
    },
    bgFrom: "#0d2b1e",
    bgTo: "#061910",
    accentColor: "#34c17a",
    Icon: Shirt,
    bgImage: "/home-banners/items-list.png",
  },
  {
    id: "sports",
    tag: "Performance & Fitness",
    title: "Sports & Activewear",
    subtitle:
      "High-performance sportswear for teams, clubs, and individuals. Moisture-wicking and built to move.",
    cta: {
      label: "Browse Sports",
      href: "https://abstitch.fullcollection.com/catalogue/299-product-use/347-performance",
      external: true,
    },
    bgFrom: "#0d1f3c",
    bgTo: "#060f20",
    accentColor: "#4a90d9",
    Icon: Activity,
    bgImage: "/home-banners/items-list.png",
  },
  {
    id: "corporate",
    tag: "Business & Hospitality",
    title: "Corporate Clothing",
    subtitle:
      "Professional uniforms for offices, hotels, and healthcare. Smart, branded, and built to impress.",
    cta: {
      label: "Browse Corporate",
      href: "https://abstitch.fullcollection.com/catalogue/299-product-use/335-corporatewear",
      external: true,
    },
    bgFrom: "#1a1a1a",
    bgTo: "#0a0a0a",
    accentColor: "#c9a84c",
    Icon: Briefcase,
    bgImage: "/home-banners/items-list.png",
  },
  {
    id: "polos",
    tag: "Casual Essentials",
    title: "T-Shirts & Polos",
    subtitle:
      "Printable and embroiderable basics for every brand and occasion. Hundreds of colours, sizes, and styles.",
    cta: {
      label: "Browse T-Shirts & Polos",
      href: "https://abstitch.fullcollection.com/catalogue/5-product-by-type/254-polos",
      external: true,
    },
    bgFrom: "#22103a",
    bgTo: "#110820",
    accentColor: "#9b59b6",
    Icon: Package,
    bgImage: "/home-banners/items-list.png",
  },
];

export default function HomeCategorySlideshow() {
  const [current, setCurrent] = useState(0);
  const [busy, setBusy] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (busy) return;
      setBusy(true);
      setCurrent(idx);
      setTimeout(() => setBusy(false), 500);
    },
    [busy]
  );

  const next = useCallback(
    () => goTo((current + 1) % SLIDES.length),
    [current, goTo]
  );
  const prev = useCallback(
    () => goTo((current - 1 + SLIDES.length) % SLIDES.length),
    [current, goTo]
  );

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];
  const Icon = slide.Icon;

  return (
    <section className="py-14 bg-gray-50">
      <div className="container-custom">

        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-burgundy-700 mb-2">
              Browse Our Range
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">
              Everything We Offer
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-burgundy-800 hover:text-burgundy-800 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-burgundy-800 hover:text-burgundy-800 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          className="relative w-full rounded-2xl overflow-hidden transition-all duration-500"
          style={{ minHeight: "360px" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${slide.bgFrom} 0%, ${slide.bgTo} 100%)`,
            }}
          />

          {slide.bgImage && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${slide.bgImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          {slide.bgImage && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0,0,0,0.68)" }}
            />
          )}

          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-60 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${slide.accentColor}, transparent)`,
            }}
          />

          {/* Decorative circles */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-80 h-80 rounded-full border opacity-10 pointer-events-none"
            style={{ borderColor: slide.accentColor }}
          />
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-56 h-56 rounded-full border opacity-10 pointer-events-none"
            style={{ borderColor: slide.accentColor }}
          />
          <div
            className="absolute right-24 bottom-8 w-32 h-32 rounded-full border opacity-10 pointer-events-none"
            style={{ borderColor: slide.accentColor }}
          />

          {/* Ghost icon — decorative */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none hidden md:block">
            <Icon size={220} color="white" strokeWidth={0.8} />
          </div>

          {/* Content */}
          <div
            className="relative z-10 flex flex-col justify-center h-full p-8 md:p-14"
            style={{ minHeight: "360px" }}
          >
            <div className="max-w-xl">
              {/* Tag */}
              <div
                key={`tag-${current}`}
                className="flex items-center gap-3 mb-5 animate-fade-up"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${slide.accentColor}22` }}
                >
                  <Icon size={14} style={{ color: slide.accentColor }} />
                </div>
                <span
                  className="font-sans text-xs tracking-widest uppercase"
                  style={{ color: slide.accentColor }}
                >
                  {slide.tag}
                </span>
              </div>

              {/* Title */}
              <h3
                key={`title-${current}`}
                className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-5 animate-fade-up delay-100"
              >
                {slide.title}
              </h3>

              {/* Subtitle */}
              <p
                key={`sub-${current}`}
                className="font-sans text-base text-white/65 leading-relaxed mb-8 animate-fade-up delay-200"
              >
                {slide.subtitle}
              </p>

              {/* CTA */}
              <div
                key={`cta-${current}`}
                className="animate-fade-up delay-300"
              >
                {slide.cta.external ? (
                  <a
                    href={slide.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/25 bg-white/10 hover:bg-white/20 text-white font-sans font-semibold text-sm px-6 py-3 rounded-full transition-all"
                  >
                    {slide.cta.label} <ArrowRight size={15} />
                  </a>
                ) : (
                  <Link
                    href={slide.cta.href}
                    className="inline-flex items-center gap-2 bg-white text-gray-900 font-sans font-semibold text-sm px-6 py-3 rounded-full hover:bg-gray-100 transition-all"
                  >
                    {slide.cta.label} <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            </div>

            {/* Counter */}
            <div className="absolute bottom-6 right-8 font-sans text-xs text-white/30 tracking-widest">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(SLIDES.length).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Dot navigation */}
        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            onClick={prev}
            className="md:hidden p-2 text-gray-400 hover:text-gray-700"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Go to ${s.title}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 h-2.5 bg-burgundy-800"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="md:hidden p-2 text-gray-400 hover:text-gray-700"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Category tab strip */}
        <div className="hidden lg:grid grid-cols-6 gap-2 mt-4">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`rounded-xl p-3 text-center font-sans text-xs font-medium border transition-all ${
                i === current
                  ? "border-burgundy-800 bg-burgundy-50 text-burgundy-800"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}