import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const categories: {
  title: string;
  subtitle: string;
  href: string;
  bg: string;
  image: string;
  icon: React.ReactNode;
  stats: string;
}[] = [
  {
    title: "Primary Schools",
    subtitle: "Uniforms for Aberdeen's primary schools — embroidered with your school crest",
    href: "/shop/school-wear/primary-schools",
    bg: "from-burgundy-800 to-burgundy-950",
    image: "/images/primary-schools.jpg",
    icon: (
      <svg viewBox="0 0 80 80" className="w-20 h-20 opacity-20" fill="white">
        <rect x="10" y="30" width="60" height="40" rx="3"/>
        <polygon points="5,32 40,8 75,32"/>
        <rect x="30" y="50" width="20" height="20" rx="2"/>
        <rect x="18" y="38" width="12" height="10" rx="1"/>
        <rect x="50" y="38" width="12" height="10" rx="1"/>
      </svg>
    ),
    stats: "40+ schools",
  },
  {
    title: "Academy Schools",
    subtitle: "Secondary & academy school uniforms — blazers, ties, PE kits and more",
    href: "/shop/school-wear/academy-schools",
    bg: "from-slate-800 to-slate-950",
    image: "/images/academy-schools.jpg",
    icon: (
      <svg viewBox="0 0 80 80" className="w-20 h-20 opacity-20" fill="white">
        <rect x="8" y="28" width="64" height="44" rx="3"/>
        <polygon points="3,30 40,5 77,30"/>
        <rect x="28" y="48" width="24" height="24" rx="2"/>
        <rect x="15" y="36" width="14" height="12" rx="1"/>
        <rect x="51" y="36" width="14" height="12" rx="1"/>
        <rect x="36" y="20" width="8" height="8" rx="4"/>
      </svg>
    ),
    stats: "10+ academies",
  },
];

export default function HomeSchoolWearSection() {
  return (
    <section className="py-16 md:py-20 bg-cream-50">
      <div className="container-custom">
        <div className="text-center mb-10">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-burgundy-700 mb-2">
            Browse By Category
          </p>
          <h2 className="section-title">School Wear</h2>
          <p className="section-subtitle mx-auto mt-3">
            Quality uniforms for every Aberdeen school — embroidered, printed, and delivered with pride.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative rounded-2xl overflow-hidden flex flex-col justify-end min-h-[280px] transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              <div className="relative z-10 p-7">
                <span className="inline-block font-sans text-xs tracking-widest uppercase bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-4 text-white">
                  {cat.stats}
                </span>
                <h3 className="font-serif text-3xl font-bold text-white mb-2">
                  {cat.title}
                </h3>
                <p className="font-sans text-sm text-white/80 leading-relaxed mb-5">
                  {cat.subtitle}
                </p>
                <div className="flex items-center gap-2 font-sans font-bold text-sm text-white group-hover:gap-3 transition-all">
                  Browse {cat.title === "Primary Schools" ? "Schools" : "Academies"}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/shop/school-wear" className="btn-outline text-burgundy-800 border-burgundy-800">
            View All School Wear
          </Link>
        </div>
      </div>
    </section>
  );
}
