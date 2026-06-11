import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopPagination from "@/components/shop/ShopPagination";
import { getProducts } from "@/lib/supabase/products";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Garments & Workwear | Abstitch",
  description:
    "Browse our full range of garments, workwear, and safety wear. Embroidery and printing available on all items.",
};

interface Props {
  searchParams: { page?: string; sort?: string; in_stock?: string };
}

export default async function GarmentsPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || "1", 10);
  const sort = (searchParams.sort as "price_asc" | "price_desc" | "name_asc" | "newest") || "newest";
  const in_stock = searchParams.in_stock === "true";

  let result: Awaited<ReturnType<typeof getProducts>> = { data: [], total: 0, page: 1, per_page: 24, total_pages: 0 };
  
  try {
    result = await getProducts({
      category: "garments",
      page,
      sort,
      in_stock: in_stock || undefined,
      per_page: 24,
    });
  } catch {
    // DB not connected
  }

  const subcategories = [
    { label: "All Garments", href: "/shop/garments" },
    { label: "Safety Wear", href: "/shop/garments?category=safety-wear" },
    { label: "Blazers", href: "/shop/garments?category=blazers" },
    { label: "Hoodies", href: "/shop/garments?category=hoodies" },
    { label: "Shirts", href: "/shop/garments?category=shirts" },
    { label: "Sweaters", href: "/shop/garments?category=sweaters" },
  ];

  return (
    <SiteLayout>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-white/60 font-sans mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white/90">Garments</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">Garments &amp; Workwear</h1>
          <p className="font-sans text-white/70 text-sm mt-2 max-w-lg">
            Quality workwear, safety wear, and garments — embroidery and printing available on all items.
          </p>
        </div>
      </div>

      <div className="border-b border-gray-100 bg-white">
        <div className="container-custom py-3 flex gap-2 overflow-x-auto">
          {subcategories.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 font-sans text-xs font-medium text-gray-700 hover:border-burgundy-300 hover:text-burgundy-800 hover:bg-burgundy-50 transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-56 flex-shrink-0">
            <ShopFilters
              currentSort={sort}
              inStock={in_stock}
              basePath="/shop/garments"
            />
          </aside>
          <div className="flex-1 min-w-0">
            {result.data.length > 0 ? (
              <>
                <ProductGrid products={result.data} />
                {result.total_pages > 1 && (
                  <div className="mt-10">
                    <ShopPagination
                      currentPage={result.page}
                      totalPages={result.total_pages}
                      basePath="/shop/garments"
                      searchParams={searchParams}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="font-sans text-gray-400 text-sm">
                  Products loading — connect the database to see items.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
