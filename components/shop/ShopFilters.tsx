"use client";

import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

interface ShopFiltersProps {
  currentSort: string;
  inStock: boolean;
  basePath: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name A–Z" },
];

export default function ShopFilters({ currentSort, inStock, basePath }: ShopFiltersProps) {
  const router = useRouter();

  const updateParam = (key: string, value: string | boolean | null) => {
    const url = new URL(window.location.href);
    if (value === null || value === false || value === "") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
    url.searchParams.delete("page");
    router.push(url.pathname + url.search);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 font-sans text-sm font-semibold text-gray-800 pb-2 border-b border-gray-100">
        <SlidersHorizontal size={15} />
        Filter &amp; Sort
      </div>

      {/* Sort */}
      <div>
        <p className="font-sans text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">
          Sort By
        </p>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("sort", opt.value === "newest" ? null : opt.value)}
              className={`w-full text-left px-3 py-2 rounded-md font-sans text-sm transition-colors
                ${currentSort === opt.value
                  ? "bg-burgundy-50 text-burgundy-800 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-sans text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">
          Availability
        </p>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => updateParam("in_stock", e.target.checked || null)}
            className="w-4 h-4 rounded border-gray-300 text-burgundy-800 focus:ring-burgundy-800"
          />
          <span className="font-sans text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Reset */}
      <button
        onClick={() => router.push(basePath)}
        className="w-full text-center font-sans text-xs text-gray-400 hover:text-burgundy-800 transition-colors underline"
      >
        Reset Filters
      </button>
    </div>
  );
}
