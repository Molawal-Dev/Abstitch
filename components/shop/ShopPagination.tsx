"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}

export default function ShopPagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: ShopPaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      <Link
        href={buildHref(currentPage - 1)}
        className={cn(
          "p-2 rounded-md border font-sans text-sm transition-colors",
          currentPage === 1
            ? "border-gray-200 text-gray-300 pointer-events-none"
            : "border-gray-300 text-gray-700 hover:border-burgundy-800 hover:text-burgundy-800"
        )}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="w-9 text-center font-sans text-sm text-gray-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p as number)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-md border font-sans text-sm transition-colors",
              p === currentPage
                ? "bg-burgundy-800 border-burgundy-800 text-white"
                : "border-gray-300 text-gray-700 hover:border-burgundy-800 hover:text-burgundy-800"
            )}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={buildHref(currentPage + 1)}
        className={cn(
          "p-2 rounded-md border font-sans text-sm transition-colors",
          currentPage === totalPages
            ? "border-gray-200 text-gray-300 pointer-events-none"
            : "border-gray-300 text-gray-700 hover:border-burgundy-800 hover:text-burgundy-800"
        )}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
