"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronRight, School, X } from "lucide-react";

const SCHOOL_IMAGES: Record<string, string> = {
  "abbotswell-school": "/images/schools/Abbotswell.png",
  "aberdeen-grammer-school": "/images/schools/aberdeen-grammer.jpg",
  "airyhall-school": "/images/schools/airyhall.jpg",
  "ashley-road-school": "/images/schools/ashley-road.png",
  "braehead-school": "/images/schools/braehead.png",
  "bramble-brae-school": "/images/schools/bramble-brae.jpg",
  "brimmond-school": "/images/schools/brimmond.jpg",
  "broomhill-school": "/images/schools/broomhill.png",
  "bucksburn-academy": "/images/schools/bucksburn.jpg",
  "bridge-of-don-academy": "/images/schools/bridge-of-don.jpg",
  "charleston-school": "/images/schools/charleston.png",
  "cornhill-school": "/images/schools/cornhill.webp",
  "countesswells-school": "/images/schools/countesswells.png",
  "culter-school": "/images/schools/culter.jpg",
  "cults-academy": "/images/schools/cults-academy.png",
  "cults-school": "/images/schools/cults.png",
  "danestone-school": "/images/schools/daneston.png",
  "dyce-academy": "/images/schools/dyce-academy.png",
  "dyce-school": "/images/schools/dyce.png",
  "fernielea-school": "/images/schools/fernielea.jpg",
  "ferryhill-school": "/images/schools/ferryhill.jpg",
  "forehill-school": "/images/schools/foreshill.png",
  "gilcomstoun-school": "/images/schools/gilcomstoun.png",
  "greenbrae-school": "/images/schools/greenbrae.png",
  "greyhope-school": "/images/schools/greyhope.jpg",
  "hanover-street-school": "/images/schools/hanover.jpg",
  "harlaw-academy": "/images/schools/harlaw.jpg",
  "hazlehead-academy": "/images/schools/hazlehead-academy.jpg",
  "hazlehead-school": "/images/schools/hazlehead.jpg",
  "heathryburn-school": "/images/schools/Heathryburn.png",
  "holy-family-rc-school": "/images/schools/holy-family.jpg",
  "kaimhill-school": "/images/schools/kaimhill.jpg",
  "kingsford-school": "/images/schools/kingsford.jpg",
  "kingswells-school": "/images/schools/kingswells.jpg",
  "kirkhill-school": "/images/schools/kirkhillps.png",
  "kittybrewster-school": "/images/schools/kittybrewster.png",
  "lochside-academy": "/images/schools/lochside-academy.jpg",
  "loirston-school": "/images/schools/loirston.jpg",
  "manor-park-school": "/images/schools/manor-park.png",
  "middleton-park-school": "/images/schools/middleton-park.jpg",
  "mile-end-school": "/images/schools/Mile-end.png",
  "milltimber-school": "/images/schools/milltimber.webp",
  "muirfield-school": "/images/schools/Muirfield.webp",
  "northfield-academy": "/images/schools/northfield.jpg",
  "oldmachar-academy": "/images/schools/oldmachar.jpg",
  "orchard-brae-school": "/images/schools/Orchard-brae.webp",
  "quarryhill-school": "/images/schools/Quarryhill.png",
  "riverbank-school": "/images/schools/riverbank.png",
  "scotstown-school": "/images/schools/scotstown.png",
  "seaton-school": "/images/schools/seaton.jpg",
  "skene-square-school": "/images/schools/skene-square.webp",
  "st-josephs-rc-school": "/images/schools/St-Josephs.png",
  "st-machar-academy": "/images/schools/st-machar-academy.jpg",
  "st-peters-rc-school": "/images/schools/st-peters.jpg",
  "stoneywood-school": "/images/schools/stoneywood.jpg",
  "sunnybank-school": "/images/schools/sunnybank.jpg",
  "tullos-school": "/images/schools/tullos.jpg",
  "westpark-school": "/images/schools/westpark.jpg",
  "woodside-school": "/images/schools/woodside.webp",
};

interface School {
  id: string;
  name: string;
  slug: string;
}

interface SchoolListPageProps {
  title: string;
  subtitle: string;
  schools: School[];
  baseHref: string;
  backHref: string;
  backLabel: string;
}

export default function SchoolListPage({
  title,
  subtitle,
  schools,
  baseHref,
  backHref,
  backLabel,
}: SchoolListPageProps) {
  const [search, setSearch] = useState("");

  const filtered = schools.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const noMatch = search.length > 0 && filtered.length === 0;

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white py-12">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-white/60 font-sans mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link href={backHref} className="hover:text-white transition-colors">
              {backLabel}
            </Link>
            <ChevronRight size={12} />
            <span className="text-white/90">{title}</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            {title}
          </h1>
          <p className="font-sans text-white/70 text-sm">{subtitle}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-30">
        <div className="container-custom py-4">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-800 focus:border-transparent"
              placeholder={`Search ${title.toLowerCase()}...`}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {search && (
            <p className="font-sans text-xs text-gray-500 mt-2">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{search}&quot;
            </p>
          )}
        </div>
      </div>

      {/* School grid */}
      <div className="container-custom py-10">
        {noMatch ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <School size={28} className="text-gray-300" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
              School Not Found
            </h3>
            <p className="font-sans text-sm text-gray-500 mb-1">
              Sorry, Abstitch is not currently partnered with
            </p>
            <p className="font-sans text-sm font-semibold text-burgundy-800 mb-4">
              &quot;{search}&quot;
            </p>
            <p className="font-sans text-xs text-gray-400 mb-6">
              If you believe this is an error or would like to enquire about
              your school joining, please get in touch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setSearch("")}
                className="btn-outline text-sm py-2"
              >
                Clear Search
              </button>
              <Link href="/contact" className="btn-primary text-sm py-2">
                Contact Us
              </Link>
            </div>
          </div>
        ) : (
          <>
            {!search && (
              <p className="font-sans text-sm text-gray-500 mb-6">
                {schools.length} school{schools.length !== 1 ? "s" : ""} available
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((school) => (
                <Link
                  key={school.id}
                  href={`${baseHref}/${school.slug}`}
                  className="group flex flex-col items-center bg-white border border-gray-100 rounded-xl p-4 hover:border-burgundy-300 hover:shadow-md transition-all duration-200 text-center"
                >
                  <span className="relative block w-16 h-16 mb-3 flex-shrink-0">
                    <Image
                      src={SCHOOL_IMAGES[school.slug] ?? `/images/schools/${school.slug}.png`}
                      alt={school.name}
                      fill
                      className="object-contain"
                      sizes="74px"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        const parent = (e.target as HTMLImageElement)
                          .parentElement;
                        if (parent) {
                          parent.classList.add(
                            "bg-burgundy-50",
                            "rounded-full",
                            "flex",
                            "items-center",
                            "justify-center"
                          );
                          const icon = document.createElement("div");
                          icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
                          parent.appendChild(icon.firstChild!);
                        }
                      }}
                    />
                  </span>

                  {/* School name */}
                  <p className="font-sans text-xs font-semibold text-gray-800 group-hover:text-burgundy-800 transition-colors leading-snug line-clamp-2">
                    {school.name}
                  </p>

                  {/* Arrow indicator */}
                  <span className="mt-2 block opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={14} className="text-burgundy-800" />
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}