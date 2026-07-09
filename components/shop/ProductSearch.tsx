"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface ProductSearchProps {
  basePath: string;
  currentSearch?: string;
  placeholder?: string;
}

export default function ProductSearch({
  basePath,
  currentSearch = "",
  placeholder = "Search products on this page…",
}: ProductSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState(currentSearch);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  const push = useCallback(
    (term: string) => {
      const url = new URL(window.location.href);
      if (term.trim()) url.searchParams.set("search", term.trim());
      else url.searchParams.delete("search");
      url.searchParams.delete("page");
      router.push(url.pathname + url.search);
    },
    [router]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => push(v), 450);
  };

  const handleClear = () => {
    setValue("");
    push("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleClear();
  };

  return (
    <div className="relative w-full max-w-sm">
      {/* Search icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search size={15} className="text-gray-400" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white font-sans text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-burgundy-800/20 focus:border-burgundy-800 transition-all"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}