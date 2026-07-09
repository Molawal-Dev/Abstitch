import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import ProductSearch from "@/components/shop/ProductSearch";
import { getCategoryFilterOptions } from "@/lib/supabase/products";
import ShopPagination from "@/components/shop/ShopPagination";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import CantFindBanner from "@/components/shop/CantFindBanner";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

interface Props {
  params: { school: string };
  searchParams: {
    page?: string;
    sort?: string;
    in_stock?: string;
    color?: string;
    size?: string;
    gender?: string;
    min_price?: string;
    max_price?: string;
    search?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const label = params.school
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${label} Uniforms | Abstitch`,
    description: `Browse school uniforms for ${label}. Abstitch, Aberdeen.`,
  };
}

async function getSchoolProducts(
  schoolSlug: string,
  page: number,
  sort: string,
  inStock: boolean,
  color?: string,
  size?: string,
  gender?: string,
  minPrice?: number,
  maxPrice?: number,
  search?: string,
) {
  try {
    const supabase = createServerSupabaseClient();
    const PER_PAGE = 12;

    const { data: cat } = await supabase
      .from("categories")
      .select("id, name, slug, parent_id")
      .eq("slug", schoolSlug)
      .single();

    if (!cat) return null;

    let parentCat = null;
    if (cat.parent_id) {
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("id", cat.parent_id)
        .single();
      parentCat = data;
    }

    const { data: pcData } = await supabase
      .from("product_categories")
      .select("product_id")
      .eq("category_id", cat.id);

    let allowedIds = (pcData || []).map(
      (pc: { product_id: string }) => pc.product_id
    );

    if (!allowedIds.length) {
      return { products: [], total: 0, category: cat, parentCat, totalPages: 0 };
    }

    if (color) {
      const { data: colorMatches } = await supabase
        .from("product_color_swatches")
        .select("product_id")
        .ilike("color_name", color)
        .in("product_id", allowedIds);
      const colorIds = (colorMatches || []).map((r: { product_id: string }) => r.product_id);
      if (!colorIds.length) {
        return { products: [], total: 0, category: cat, parentCat, totalPages: 0 };
      }
      allowedIds = colorIds;
    }

    if (size) {
      const { data: sizeMatches } = await supabase
        .from("product_variants")
        .select("product_id")
        .ilike("size", size)
        .in("product_id", allowedIds);
      const sizeIds = [...new Set(
        (sizeMatches || []).map((r: { product_id: string }) => r.product_id)
      )];
      if (!sizeIds.length) {
        return { products: [], total: 0, category: cat, parentCat, totalPages: 0 };
      }
      allowedIds = sizeIds;
    }

    const from = (page - 1) * PER_PAGE;

    let query = supabase
      .from("products")
      .select(
        `*,
        product_categories(categories(id,name,slug,parent_id)),
        product_variants(*),
        product_color_swatches(*),
        size_guides(*)`,
        { count: "exact" }
      )
      .eq("published", true)
      .in("id", allowedIds);

    if (inStock) query = query.eq("in_stock", true);

    if (gender) query = query.eq("gender", gender);

    if (search) query = query.ilike("name", `%${search}%`);

    if (minPrice !== undefined) {
      query = query.or(
        `price_range_min.gte.${minPrice},and(price_range_min.is.null,regular_price.gte.${minPrice})`
      );
    }
    if (maxPrice !== undefined) {
      query = query.or(
        `price_range_max.lte.${maxPrice},and(price_range_max.is.null,regular_price.lte.${maxPrice})`
      );
    }

    switch (sort) {
      case "price_asc":
        query = query.order("price_range_min", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price_range_max", { ascending: false });
        break;
      case "name_asc":
        query = query.order("name", { ascending: true });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    query = query.range(from, from + PER_PAGE - 1);

    const { data, count } = await query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = (data || []).map((row: any) => {
      const cats = (row.product_categories || [])
        .map((pc: any) => pc.categories)
        .filter(Boolean);
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        type: row.type,
        sku: row.sku,
        short_description: row.short_description,
        description: row.description,
        regular_price: row.regular_price,
        sale_price: row.sale_price,
        price_range_min: row.price_range_min,
        price_range_max: row.price_range_max,
        images: row.images || [],
        categories: cats.map((c: any) => c.slug),
        category_names: cats.map((c: any) => c.name),
        in_stock: row.in_stock,
        stock_qty: row.stock_qty,
        featured: row.featured,
        published: row.published,
        colors: (row.product_color_swatches || []).map((s: any) => ({
          name: s.color_name,
          hex: s.hex_code,
          images: s.images || [],
        })),
        sizes: [
          ...new Set(
            (row.product_variants || [])
              .map((v: any) => v.size)
              .filter(Boolean)
          ),
        ] as string[],
        variants: row.product_variants || [],
        size_guide: row.size_guides?.[0] || null,
        enable_gender_options: row.enable_gender_options ?? false,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });

    return {
      products,
      total: count || 0,
      category: cat,
      parentCat,
      totalPages: Math.ceil((count || 0) / PER_PAGE),
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function PrimarySchoolProductsPage({ params, searchParams }: Props) {
  const page    = parseInt(searchParams.page || "1", 10);
  const sort    = searchParams.sort || "newest";
  const inStock = searchParams.in_stock === "true";
  const color   = searchParams.color;
  const size    = searchParams.size;
  const gender  = searchParams.gender;  
  const search  = searchParams.search;
  const minP    = searchParams.min_price ? parseInt(searchParams.min_price) : undefined;
  const maxP    = searchParams.max_price ? parseInt(searchParams.max_price) : undefined;

  const result = await getSchoolProducts(
    params.school, page, sort, inStock, color, size, gender, minP, maxP, search
  );

  if (!result || !result.category) notFound();

  const { products, total, category, totalPages } = result;

  const basePath = `/shop/school-wear/primary-schools/${params.school}`;

  let filterOptions = {
    colors: [] as { name: string; hex: string }[],
    sizes: [] as string[],
    genders: [] as string[],
    minPrice: 0,
    maxPrice: 100,
  };
  try {
    filterOptions = await getCategoryFilterOptions(params.school);
  } catch {
  }

  return (
    <SiteLayout>
      <div className="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white py-12">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-white/60 font-sans mb-4 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/shop/school-wear" className="hover:text-white transition-colors">School Wear</Link>
            <ChevronRight size={12} />
            <Link href="/shop/school-wear/primary-schools" className="hover:text-white transition-colors">
              Primary Schools
            </Link>
            <ChevronRight size={12} />
            <span className="text-white/90">{category.name}</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">{category.name}</h1>
          {total > 0 && (
            <p className="font-sans text-white/70 text-sm mt-2">
              {total} product{total !== 1 ? "s" : ""} available
            </p>
          )}
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-56 flex-shrink-0">
            <ShopFilters
              currentSort={sort}
              inStock={inStock}
              basePath={basePath}
              colors={filterOptions.colors}
              sizes={filterOptions.sizes}
              genders={filterOptions.genders}
              minPrice={filterOptions.minPrice}
              maxPrice={filterOptions.maxPrice}
              currentColor={color}
              currentSize={size}
              currentGender={gender}
              currentMinPrice={minP}
              currentMaxPrice={maxP}
            />
          </aside>

          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="mb-5">
              <ProductSearch
                basePath={basePath}
                currentSearch={search}
                placeholder="Search products in this school…"
              />
            </div>

            {total > 0 && (
              <p className="font-sans text-sm text-gray-500 mb-4">
                <span className="font-semibold text-gray-800">{total}</span>{" "}
                product{total !== 1 ? "s" : ""} found
                {search && (
                  <span className="text-gray-400"> for &ldquo;{search}&rdquo;</span>
                )}
              </p>
            )}

            {products.length > 0 ? (
              <>
                <ProductGrid products={products} schoolSlug={category.slug} />
                {totalPages > 1 && (
                  <div className="mt-10">
                    <ShopPagination
                      currentPage={page}
                      totalPages={totalPages}
                      basePath={basePath}
                      searchParams={searchParams}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="font-sans text-gray-400 text-sm mb-4">
                  No products found for {category.name}.
                </p>
                <Link href="/shop/school-wear/primary-schools" className="btn-outline inline-flex">
                  Back to Primary Schools
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom">
        <CantFindBanner variant="school" />
      </div>
    </SiteLayout>
  );
}
