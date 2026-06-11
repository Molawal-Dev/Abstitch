import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopPagination from "@/components/shop/ShopPagination";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  params: { school: string };
  searchParams: { page?: string; sort?: string; in_stock?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.school;
  const label = slug
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
  inStock: boolean
) {
  try {
    const supabase = createServerSupabaseClient();

    const { data: cat } = await supabase
      .from("categories")
      .select("id, name, slug, parent_id")
      .eq("slug", schoolSlug)
      .single();

    if (!cat) return { products: [], total: 0, category: null };

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

    const productIds = (pcData || []).map((pc: { product_id: string }) => pc.product_id);

    if (!productIds.length) {
      return { products: [], total: 0, category: cat, parentCat };
    }

    const PER_PAGE = 24;
    const from = (page - 1) * PER_PAGE;

    let query = supabase
      .from("products")
      .select(
        `*, product_categories(categories(id,name,slug,parent_id)),
        product_variants(*), product_color_swatches(*), size_guides(*)`,
        { count: "exact" }
      )
      .eq("published", true)
      .in("id", productIds);

    if (inStock) query = query.eq("in_stock", true);

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
  } catch {
    return { products: [], total: 0, category: null, parentCat: null, totalPages: 0 };
  }
}

export default async function SchoolProductsPage({ params, searchParams }: Props) {
  const { school } = params;

  if (school === "primary-schools" || school === "academy-schools") {
    notFound();
  }

  const page = parseInt(searchParams.page || "1", 10);
  const sort = searchParams.sort || "newest";
  const inStock = searchParams.in_stock === "true";

  const { products, total, category, parentCat, totalPages } =
    await getSchoolProducts(school, page, sort, inStock);

  if (!category) notFound();

  const displayName = category.name;
  const totalPages_ = totalPages || 0;

  // Build breadcrumb path
  const isAcademy = parentCat?.slug === "academy-schools";
  const schoolTypeHref = isAcademy
    ? "/shop/school-wear/academy-schools"
    : "/shop/school-wear/primary-schools";
  const schoolTypeLabel = isAcademy ? "Academy Schools" : "Primary Schools";

  return (
    <SiteLayout>
      {/* Header */}
      <div className="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white py-12">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-white/60 font-sans mb-4 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/shop/school-wear" className="hover:text-white transition-colors">School Wear</Link>
            <ChevronRight size={12} />
            <Link href={schoolTypeHref} className="hover:text-white transition-colors">
              {schoolTypeLabel}
            </Link>
            <ChevronRight size={12} />
            <span className="text-white/90">{displayName}</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            {displayName}
          </h1>
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
              basePath={`/shop/school-wear/${school}`}
            />
          </aside>

          <div className="flex-1 min-w-0">
            {products.length > 0 ? (
              <>
                <ProductGrid products={products} />
                {totalPages_ > 1 && (
                  <div className="mt-10">
                    <ShopPagination
                      currentPage={page}
                      totalPages={totalPages_}
                      basePath={`/shop/school-wear/${school}`}
                      searchParams={searchParams}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="font-sans text-gray-400 text-sm mb-4">
                  No products found for {displayName}.
                </p>
                <Link
                  href={schoolTypeHref}
                  className="btn-outline inline-flex"
                >
                  Back to {schoolTypeLabel}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}