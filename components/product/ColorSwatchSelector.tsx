"use client";

import { cn } from "@/lib/utils";
import type { ColorSwatch } from "@/types";
import { Check } from "lucide-react";

interface ColorSwatchSelectorProps {
  colors: ColorSwatch[];
  selected: string | null;
  onChange: (color: string) => void;
}

export default function ColorSwatchSelector({
  colors,
  selected,
  onChange,
}: ColorSwatchSelectorProps) {
  if (!colors.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-sm font-semibold text-gray-800">
          Colour
        </span>
        {selected && (
          <span className="font-sans text-sm text-gray-500 capitalize">
            {selected}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => {
          const isSelected = selected === c.name;
          
          const isLight = isLightColor(c.hex);
          return (
            <button
              key={c.name}
              title={c.name}
              onClick={() => onChange(c.name)}
              className={cn(
                "relative w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm mr-1",
                isSelected
                  ? isLight
                    ? "ring-2 ring-gray-800 ring-offset-2"
                    : "ring-2 ring-burgundy-800 ring-offset-2"
                  : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
              )}
              style={{
                backgroundColor: c.hex,
                border: isLight ? "1.5px solid #d1d5db" : "1.5px solid transparent",
              }}
              aria-label={c.name}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <Check
                  size={14}
                  className={cn(
                    "font-bold",
                    isLight ? "text-gray-800" : "text-white"
                  )}
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}
