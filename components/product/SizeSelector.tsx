"use client";

import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onChange: (size: string) => void;
}

const SIZE_ORDER = [
  "Kids at 1–2 years",
  "Kids at 3–4 years",
  "Kids at 5–6 years",
  "Kids at 7–8 years",
  "Kids at 9–10 years",
  "Kids at 11–12 years",
  "Extra small – adults",
  "Small – adults",
  "Medium – adults",
  "Large – adults",
  "Extra large – adults",
  "XXL",
  "XXXL",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
];

function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ai = SIZE_ORDER.findIndex(
      (s) => s.toLowerCase() === a.toLowerCase()
    );
    const bi = SIZE_ORDER.findIndex(
      (s) => s.toLowerCase() === b.toLowerCase()
    );
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}

export default function SizeSelector({
  sizes,
  selected,
  onChange,
}: SizeSelectorProps) {
  if (!sizes.length) return null;
  const sorted = sortSizes(sizes);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-sm font-semibold text-gray-800">
          Size
        </span>
        {selected && (
          <span className="font-sans text-sm text-gray-500">{selected}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sorted.map((size) => {
          const isSelected = selected === size;
          const display = abbreviateSize(size);
          return (
            <button
              key={size}
              onClick={() => onChange(size)}
              className={cn(
                "min-w-[44px] px-3 py-2 rounded-md border font-sans text-xs font-medium transition-all duration-150",
                isSelected
                  ? "bg-burgundy-800 border-burgundy-800 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-burgundy-800 hover:text-burgundy-800"
              )}
              title={size}
              aria-pressed={isSelected}
            >
              {display}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function abbreviateSize(size: string): string {
  const map: Record<string, string> = {
    "Kids at 1–2 years": "1–2y",
    "Kids at 3–4 years": "3–4y",
    "Kids at 5–6 years": "5–6y",
    "Kids at 7–8 years": "7–8y",
    "Kids at 9–10 years": "9–10y",
    "Kids at 11–12 years": "11–12y",
    "Extra small – adults": "XS",
    "Small – adults": "S",
    "Medium – adults": "M",
    "Large – adults": "L",
    "Extra large – adults": "XL",
  };
  return map[size] || size;
}
