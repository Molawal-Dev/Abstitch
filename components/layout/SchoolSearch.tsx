"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, School } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface SchoolCategory {
  id: string;
  name: string;
  slug: string;
  parent_slug: string;
}

export default function SchoolSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [schools, setSchools] = useState<SchoolCategory[]>([]);
  const [filtered, setFiltered] = useState<SchoolCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadSchools() {
      setLoading(true);
      try {
        const { data: parents } = await supabase
          .from("categories")
          .select("id, slug")
          .in("slug", ["primary-schools", "academy-schools"]);

        if (!parents?.length) return;

        const parentIds = parents.map((p) => p.id);

        const { data } = await supabase
          .from("categories")
          .select("id, name, slug, parent_id")
          .in("parent_id", parentIds)
          .order("name");

        if (data) {
          const mapped = data.map((cat) => {
            const parent = parents.find((p) => p.id === cat.parent_id);
            return {
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              parent_slug: parent?.slug || "primary-schools",
            };
          });
          setSchools(mapped);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadSchools();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(
      schools.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 8)
    );
  }, [query, schools]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSelect = (school: SchoolCategory) => {
    router.push(`/shop/school-wear/${school.parent_slug}/${school.slug}`);
    setOpen(false);
    setQuery("");
  };

  const noResults = query.trim().length > 0 && filtered.length === 0 && !loading;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-700 hover:text-burgundy-800 transition-colors"
        aria-label="Search schools"
      >
        <Search size={22} />
      </button>

      {open && (
        <div className="fixed left-2 right-2 top-20 md:absolute md:left-auto md:right-0 md:top-full md:mt-2 md:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 font-sans text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
              placeholder="Search for your school..."
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                  setQuery("");
                }
                if (e.key === "Enter" && filtered.length > 0) {
                  handleSelect(filtered[0]);
                }
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto">
            {!query.trim() && (
              <div className="px-4 py-6 text-center">
                <School
                  size={24}
                  className="text-gray-300 mx-auto mb-2"
                />
                <p className="font-sans text-xs text-gray-400">
                  Type a school name to search
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="px-4 py-4 text-center">
                <p className="font-sans text-xs text-gray-400">Loading schools...</p>
              </div>
            )}

            {/* Results list */}
            {filtered.map((school) => {
              const isAcademy = school.parent_slug === "academy-schools";
              return (
                <button
                  key={school.id}
                  onClick={() => handleSelect(school)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-burgundy-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                    <School size={14} className="text-burgundy-800" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans text-sm font-medium text-gray-800 truncate">
                      {school.name}
                    </p>
                    <p className="font-sans text-[11px] text-gray-400">
                      {isAcademy ? "Academy School" : "Primary School"}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* No results */}
            {noResults && (
              <div className="px-4 py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <School size={20} className="text-gray-300" />
                </div>
                <p className="font-sans text-sm font-semibold text-gray-700 mb-1">
                  School not found
                </p>
                <p className="font-sans text-xs text-gray-400 mb-1">
                  Abstitch is not currently partnered with
                </p>
                <p className="font-sans text-xs font-medium text-burgundy-800 mb-3">
                  &quot;{query}&quot;
                </p>
                <p className="font-sans text-xs text-gray-400 mb-3">
                  Would you like to enquire about your school?
                </p>
                <a
                  href="/contact"
                  className="inline-block font-sans text-xs font-semibold text-white bg-burgundy-800 px-4 py-2 rounded-lg hover:bg-burgundy-900 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Contact Us
                </a>
              </div>
            )}
          </div>

          {/* Footer hint */}
          {filtered.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-50 bg-gray-50">
              <p className="font-sans text-[10px] text-gray-400">
                Press Enter to select first result · Esc to close
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}