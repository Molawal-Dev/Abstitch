import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopPagination from "@/components/shop/ShopPagination";
import { getCategoryBySlug } from "@/lib/supabase/categories";
import { getProducts, getCategoryFilterOptions } from "@/lib/supabase/products";
import CantFindBanner from "@/components/shop/CantFindBanner";

export const revalidate = 0;

interface Props {
  params: { category: string };
  searchParams: {
    page?: string;
    sort?: string;
    in_stock?: string;
    color?: string;
    size?: string;
    min_price?: string;
    max_price?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const cat = await getCategoryBySlug(params.category);
    if (!cat) return { title: "Safety Wear | Abstitch" };
    return {
      title: `${cat.name} | Safety Wear | Abstitch`,
      description:
        cat.description ||
        `Browse our range of ${cat.name} — quality workwear and PPE for every job.`,
    };
  } catch {
    return { title: "Safety Wear | Abstitch" };
  }
}

export default async function SafetyWearCategoryPage({ params, searchParams }: Props) {
  const page    = parseInt(searchParams.page || "1", 10);
  const sort    = (searchParams.sort as "price_asc" | "price_desc" | "name_asc" | "newest") || "newest";
  const inStock = searchParams.in_stock === "true";
  const color   = searchParams.color;
  const size    = searchParams.size;
  const minPrice = searchParams.min_price ? parseInt(searchParams.min_price) : undefined;
  const maxPrice = searchParams.max_price ? parseInt(searchParams.max_price) : undefined;

  let category = null;
  try {
    category = await getCategoryBySlug(params.category);
  } catch { /* DB not connected */ }

  if (category === null && process.env.NEXT_PUBLIC_SUPABASE_URL) notFound();

  const displayName =
    category?.name ||
    params.category.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  // Fetch filter options and products in parallel
  let filterOptions = { colors: [], sizes: [], minPrice: 0, maxPrice: 500 } as {
    colors: { name: string; hex: string }[];
    sizes: string[];
    minPrice: number;
    maxPrice: number;
  };

  let result = { data: [] as Awaited<ReturnType<typeof getProducts>>["data"], total: 0, page: 1, per_page: 12, total_pages: 0 };

  try {
    [filterOptions, result] = await Promise.all([
      getCategoryFilterOptions(params.category),
      getProducts({
        category: params.category,
        page,
        sort,
        in_stock: inStock || undefined,
        color,
        size,
        min_price: minPrice,
        max_price: maxPrice,
        per_page: 24,
      }),
    ]);
  } catch { /* DB not connected — show empty state */ }

  return (
    <SiteLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
        <div className="container-custom">
          <div className="flex items-start justify-between gap-4">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-white/60 font-sans mb-4">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={12} />
                <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
                <ChevronRight size={12} />
                <Link href="/shop/safety-wear" className="hover:text-white transition-colors">
                  Safety Wear & PPE
                </Link>
                <ChevronRight size={12} />
                <span className="text-white/90">{displayName}</span>
              </nav>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">{displayName}</h1>
              {category?.description && (
                <p className="font-sans text-white/70 text-sm mt-2 max-w-lg">
                  {category.description}
                </p>
              )}
            </div>

            {/* Portwest logo — category pages only */}
            <div className="hidden md:flex flex-col items-end flex-shrink-0 mt-1">
              <div className="bg-white rounded-lg px-4 py-2.5 flex flex-col items-center gap-1">
                <Image
                  src="/home-banners/portwest-logo.png"
                  alt="Portwest"
                  width={110}
                  height={34}
                  style={{ objectFit: "contain" }}
                />
                <p className="font-sans text-[9px] font-semibold tracking-widest uppercase text-gray-500">
                  Official Portwest Partner
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products + Sidebar */}
      <div className="container-custom py-10">
        {result.total > 0 && (
          <p className="font-sans text-sm text-gray-500 mb-6">
            <span className="font-semibold text-gray-800">{result.total}</span> products found
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-56 flex-shrink-0">
            <ShopFilters
              currentSort={sort}
              inStock={inStock}
              basePath={`/shop/safety-wear/${params.category}`}
              colors={filterOptions.colors}
              sizes={filterOptions.sizes}
              minPrice={filterOptions.minPrice}
              maxPrice={filterOptions.maxPrice}
              currentColor={color}
              currentSize={size}
              currentMinPrice={minPrice}
              currentMaxPrice={maxPrice}
            />
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {result.data.length > 0 ? (
              <>
                <ProductGrid products={result.data} />
                {result.total_pages > 1 && (
                  <div className="mt-10">
                    <ShopPagination
                      currentPage={result.page}
                      totalPages={result.total_pages}
                      basePath={`/shop/safety-wear/${params.category}`}
                      searchParams={searchParams}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="font-sans text-gray-400 text-sm">
                  No products in this category yet — check back soon.
                </p>
                <Link
                  href="/shop/safety-wear"
                  className="inline-block mt-4 text-xs font-sans font-semibold text-slate-700 underline underline-offset-2 hover:text-slate-900"
                >
                  ← Back to Safety Wear & PPE
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom">
        <CantFindBanner variant="safety" />
      </div>
    </SiteLayout>
  );
}
