"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, PackageSearch } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { formatPrice, formatPriceRange } from "@/lib/utils";

interface ProductResult {
  id: string;
  name: string;
  slug: string;
  images: string[] | null;
  regular_price: number | null;
  sale_price: number | null;
  price_range_min: number | null;
  price_range_max: number | null;
  type: string;
}

export default function ProductSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced live search against published products only.
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const { data } = await supabase
          .from("products")
          .select(
            "id, name, slug, images, regular_price, sale_price, price_range_min, price_range_max, type"
          )
          .eq("published", true)
          .ilike("name", `%${trimmed}%`)
          .order("name")
          .limit(8);

        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

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

  const handleSelect = (product: ProductResult) => {
    router.push(`/product/${product.slug}`);
    setOpen(false);
    setQuery("");
  };

  const getPriceLabel = (product: ProductResult) => {
    if (
      product.type === "variable" &&
      product.price_range_min != null &&
      product.price_range_max != null
    ) {
      return formatPriceRange(product.price_range_min, product.price_range_max);
    }
    const price = product.sale_price ?? product.regular_price;
    return price != null ? formatPrice(price) : "";
  };

  const noResults = query.trim().length > 0 && results.length === 0 && !loading;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-700 hover:text-burgundy-800 transition-colors"
        aria-label="Search products"
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
              placeholder="Search products..."
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                  setQuery("");
                }
                if (e.key === "Enter" && results.length > 0) {
                  handleSelect(results[0]);
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
          <div className="max-h-80 overflow-y-auto">
            {!query.trim() && (
              <div className="px-4 py-6 text-center">
                <PackageSearch size={24} className="text-gray-300 mx-auto mb-2" />
                <p className="font-sans text-xs text-gray-400">
                  Type a product name to search
                </p>
              </div>
            )}

            {loading && (
              <div className="px-4 py-4 text-center">
                <p className="font-sans text-xs text-gray-400">Searching...</p>
              </div>
            )}

            {!loading &&
              results.map((product) => {
                const image = product.images?.[0];
                const priceLabel = getPriceLabel(product);
                return (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-burgundy-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {image ? (
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <PackageSearch size={16} className="text-gray-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-sm font-medium text-gray-800 truncate">
                        {product.name}
                      </p>
                      {priceLabel && (
                        <p className="font-sans text-[11px] text-burgundy-800 font-semibold">
                          {priceLabel}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}

            {noResults && (
              <div className="px-4 py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <PackageSearch size={20} className="text-gray-300" />
                </div>
                <p className="font-sans text-sm font-semibold text-gray-700 mb-1">
                  No products found
                </p>
                <p className="font-sans text-xs text-gray-400 mb-3">
                  No results for &quot;{query}&quot;
                </p>
                <a
                  href="/shop"
                  className="inline-block font-sans text-xs font-semibold text-white bg-burgundy-800 px-4 py-2 rounded-lg hover:bg-burgundy-900 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Browse All Products
                </a>
              </div>
            )}
          </div>

          {/* Footer hint */}
          {results.length > 0 && (
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