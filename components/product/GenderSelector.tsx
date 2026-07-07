"use client";

import { cn } from "@/lib/utils";

interface GenderSelectorProps {
  selected: string | null;
  onChange: (gender: string) => void;
}

const GENDER_OPTIONS = ["Male", "Female"];

export default function GenderSelector({ selected, onChange }: GenderSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-sm font-semibold text-gray-800">
          Gender
        </span>
        {selected && (
          <span className="font-sans text-sm text-gray-500">{selected}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {GENDER_OPTIONS.map((gender) => {
          const isSelected = selected === gender;
          return (
            <button
              key={gender}
              type="button"
              onClick={() => onChange(gender)}
              className={cn(
                "min-w-[90px] px-4 py-2 rounded-md border font-sans text-xs font-medium transition-all duration-150",
                isSelected
                  ? "bg-burgundy-800 border-burgundy-800 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-burgundy-800 hover:text-burgundy-800"
              )}
              aria-pressed={isSelected}
            >
              {gender}
            </button>
          );
        })}
      </div>
    </div>
  );
}