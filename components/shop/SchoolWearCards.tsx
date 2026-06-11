"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Props {
  primaryCount: number;
  academyCount: number;
}

export default function SchoolWearCards({ primaryCount, academyCount }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Link
        href="/shop/school-wear/primary-schools"
        className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[280px] flex flex-col justify-end"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy-800 to-burgundy-950" />

        <Image
          src="/images/primary-schools.jpg"
          alt="Primary Schools"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 p-7">
          <span className="inline-block font-sans text-xs tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full mb-3 text-white">
            {primaryCount > 0 ? `${primaryCount} schools` : "Browse schools"}
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mb-2">
            Primary Schools
          </h2>
          <p className="font-sans text-sm text-white/80 mb-4">
            Uniforms for Aberdeen&apos;s primary schools — embroidered with
            your school crest
          </p>
          <div className="flex items-center gap-2 font-sans font-semibold text-sm text-white group-hover:gap-3 transition-all">
            Browse Schools
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </Link>

      <Link
        href="/shop/school-wear/academy-schools"
        className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[280px] flex flex-col justify-end"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />

        <Image
          src="/images/academy-schools.jpg"
          alt="Academy Schools"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 p-7">
          <span className="inline-block font-sans text-xs tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full mb-3 text-white">
            {academyCount > 0 ? `${academyCount} academies` : "Browse academies"}
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mb-2">
            Academy Schools
          </h2>
          <p className="font-sans text-sm text-white/80 mb-4">
            Secondary &amp; academy school uniforms — blazers, ties, PE kits
            and more
          </p>
          <div className="flex items-center gap-2 font-sans font-semibold text-sm text-white group-hover:gap-3 transition-all">
            Browse Academies
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}