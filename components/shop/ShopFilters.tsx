"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { sortSizes } from "@/lib/utils/sortSizes";

interface ColorOption {
  name: string;
  hex: string;
}

interface ShopFiltersProps {
  currentSort: string;
  inStock: boolean;
  basePath: string;
  colors?: ColorOption[];
  sizes?: string[];
  genders?: string[];
  minPrice?: number;
  maxPrice?: number;
  currentColor?: string;
  currentSize?: string;
  currentGender?: string;
  currentMinPrice?: number;
  currentMaxPrice?: number;
}

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc",   label: "Name A–Z" },
];

const GENDER_ORDER = ["Boys", "Girls", "Unisex"];

function sortGenders(genders: string[]): string[] {
  return [...genders].sort((a, b) => {
    const ai = GENDER_ORDER.indexOf(a);
    const bi = GENDER_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export default function ShopFilters({
  currentSort,
  inStock,
  basePath,
  colors = [],
  sizes = [],
  genders = [],
  minPrice = 0,
  maxPrice = 100,
  currentColor,
  currentSize,
  currentGender,
  currentMinPrice,
  currentMaxPrice,
}: ShopFiltersProps) {
  const router = useRouter();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentMinPrice ?? minPrice,
    currentMaxPrice ?? maxPrice,
  ]);

  useEffect(() => {
    setPriceRange([currentMinPrice ?? minPrice, currentMaxPrice ?? maxPrice]);
  }, [currentMinPrice, currentMaxPrice, minPrice, maxPrice]);

  const priceDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleApplyPrice = useCallback(
    (range: [number, number]) => {
      if (priceDebounce.current) clearTimeout(priceDebounce.current);
      priceDebounce.current = setTimeout(() => {
        const url = new URL(window.location.href);
        if (range[0] > minPrice) url.searchParams.set("min_price", String(range[0]));
        else url.searchParams.delete("min_price");
        if (range[1] < maxPrice) url.searchParams.set("max_price", String(range[1]));
        else url.searchParams.delete("max_price");
        url.searchParams.delete("page");
        router.push(url.pathname + url.search);
      }, 400);
    },
    [minPrice, maxPrice, router]
  );

  const updateParam = useCallback(
    (updates: Record<string, string | null>) => {
      const url = new URL(window.location.href);
      for (const [key, val] of Object.entries(updates)) {
        if (val === null || val === "") url.searchParams.delete(key);
        else url.searchParams.set(key, val);
      }
      url.searchParams.delete("page");
      router.push(url.pathname + url.search);
    },
    [router]
  );

  const sortedSizes = sortSizes(sizes);
  const sortedGenders = sortGenders(genders);

  const hasActiveFilters =
    !!currentColor ||
    !!currentSize ||
    !!currentGender ||
    currentMinPrice !== undefined ||
    currentMaxPrice !== undefined ||
    inStock ||
    (!!currentSort && currentSort !== "newest");

  const lowZIndex  = priceRange[0] >= maxPrice - 1 ? "z-20" : "z-10";
  const highZIndex = "z-10";

  const thumbClass =
    "absolute w-full appearance-none bg-transparent " +
    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 " +
    "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full " +
    "[&::-webkit-slider-thumb]:bg-burgundy-700 [&::-webkit-slider-thumb]:cursor-pointer " +
    "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white " +
    "[&::-webkit-slider-thumb]:shadow-md pointer-events-none " +
    "[&::-webkit-slider-thumb]:pointer-events-auto";

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-500" />
          <span className="font-sans text-sm font-semibold text-gray-800">
            Filter &amp; Sort
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => router.push(basePath)}
            className="flex items-center gap-1 text-xs font-sans text-burgundy-700 hover:text-burgundy-900 transition-colors"
          >
            <RotateCcw size={11} />
            Reset
          </button>
        )}
      </div>

      <div className="p-4 space-y-6">

        {/* Sort */}
        <div>
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
            Sort By
          </p>
          <div className="space-y-0.5">
            {SORT_OPTIONS.map((opt) => {
              const active =
                currentSort === opt.value ||
                (opt.value === "newest" && (!currentSort || currentSort === "newest"));
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    updateParam({ sort: opt.value === "newest" ? null : opt.value })
                  }
                  className={`w-full text-left px-3 py-2 rounded-lg font-sans text-sm transition-colors ${
                    active
                      ? "bg-burgundy-50 text-burgundy-800 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        {maxPrice > minPrice && (
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Price
            </p>
            <div className="relative h-5 flex items-center mb-2">
              <div className="absolute left-0 right-0 h-1 rounded-full bg-gray-200" />
              <div
                className="absolute h-1 rounded-full bg-burgundy-700 pointer-events-none"
                style={{
                  left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                }}
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => {
                  const v = Math.min(Number(e.target.value), priceRange[1] - 1);
                  const next: [number, number] = [v, priceRange[1]];
                  setPriceRange(next);
                  scheduleApplyPrice(next);
                }}
                className={`${thumbClass} ${lowZIndex}`}
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => {
                  const v = Math.max(Number(e.target.value), priceRange[0] + 1);
                  const next: [number, number] = [priceRange[0], v];
                  setPriceRange(next);
                  scheduleApplyPrice(next);
                }}
                className={`${thumbClass} ${highZIndex}`}
              />
            </div>
            <div className="flex justify-between font-sans text-xs text-gray-500">
              <span>£{priceRange[0]}</span>
              <span>£{priceRange[1]}</span>
            </div>
          </div>
        )}

        {sortedGenders.length > 0 && (
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
              Gender
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sortedGenders.map((g) => {
                const active = currentGender === g;
                return (
                  <button
                    key={g}
                    onClick={() => updateParam({ gender: active ? null : g })}
                    className={`px-2.5 py-1 rounded font-sans text-xs font-medium border transition-colors ${
                      active
                        ? "bg-burgundy-700 text-white border-burgundy-700"
                        : "bg-white text-gray-700 border-gray-200 hover:border-burgundy-300"
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Colour */}
        {colors.length > 0 && (
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
              Colour
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => {
                const active = currentColor?.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => updateParam({ color: active ? null : c.name })}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      active
                        ? "border-burgundy-700 scale-110 shadow-md"
                        : "border-white shadow hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                    aria-pressed={active}
                  />
                );
              })}
            </div>
            {currentColor && (
              <p className="mt-1.5 font-sans text-xs text-gray-400">
                {currentColor}{" "}
                <button
                  onClick={() => updateParam({ color: null })}
                  className="text-burgundy-700 hover:underline"
                >
                  ×
                </button>
              </p>
            )}
          </div>
        )}

        {/* Size */}
        {sortedSizes.length > 0 && (
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
              Size
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sortedSizes.map((s) => {
                const active = currentSize === s;
                return (
                  <button
                    key={s}
                    onClick={() => updateParam({ size: active ? null : s })}
                    className={`px-2.5 py-1 rounded font-sans text-xs font-medium border transition-colors ${
                      active
                        ? "bg-burgundy-700 text-white border-burgundy-700"
                        : "bg-white text-gray-700 border-gray-200 hover:border-burgundy-300"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Availability */}
        <div>
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
            Availability
          </p>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) =>
                updateParam({ in_stock: e.target.checked ? "true" : null })
              }
              className="w-4 h-4 rounded border-gray-300 text-burgundy-800 focus:ring-burgundy-800"
            />
            <span className="font-sans text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>

      </div>
    </div>
  );
}