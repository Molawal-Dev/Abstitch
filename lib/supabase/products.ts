import { supabase } from "./client";
import type { Product, ProductFilters, PaginatedResponse } from "@/types";

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  const {
    category,
    school,
    search,
    in_stock,
    page = 1,
    per_page = 24,
    sort = "newest",
  } = filters;

  let query = supabase
    .from("products")
    .select(
      `
      *,
      product_categories!inner(
        categories(id, name, slug, parent_id)
      ),
      product_variants(*),
      product_color_swatches(*),
      size_guides(*)
    `,
      { count: "exact" }
    )
    .eq("published", true);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (in_stock) {
    query = query.eq("in_stock", true);
  }

  if (school) {
    query = query.eq(
      "product_categories.categories.slug",
      school
    );
  } else if (category) {
    query = query.eq(
      "product_categories.categories.slug",
      category
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

  const from = (page - 1) * per_page;
  query = query.range(from, from + per_page - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  const products = (data || []).map(mapProductRow);
  const total = count || 0;

  return {
    data: products,
    total,
    page,
    per_page,
    total_pages: Math.ceil(total / per_page),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_categories(
        categories(id, name, slug, parent_id)
      ),
      product_variants(*),
      product_color_swatches(*),
      size_guides(*)
    `
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return null;

  // Explicitly fetch size guide separately to avoid nested-relation RLS issues
  const { data: sizeGuideData } = await supabase
    .from("size_guides")
    .select("*")
    .eq("product_id", data.id)
    .maybeSingle();

  return mapProductRow(data, sizeGuideData ?? null);
}

export async function getRelatedProducts(
  productId: string,
  categoryIds: string[],
  limit = 8
): Promise<Product[]> {
  if (!categoryIds.length) return [];

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_categories!inner(
        categories(id, name, slug, parent_id)
      ),
      product_variants(*),
      product_color_swatches(*),
      size_guides(*)
    `
    )
    .eq("published", true)
    .neq("id", productId)
    .in("product_categories.category_id", categoryIds)
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapProductRow);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_categories(
        categories(id, name, slug, parent_id)
      ),
      product_variants(*),
      product_color_swatches(*),
      size_guides(*)
    `
    )
    .eq("published", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapProductRow);
}

export async function getProductsByCategory(
  categorySlug: string,
  limit = 100
): Promise<Product[]> {
  const { data: catData } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!catData) return [];

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_categories!inner(category_id),
      product_variants(*),
      product_color_swatches(*),
      size_guides(*)
    `
    )
    .eq("published", true)
    .eq("product_categories.category_id", catData.id)
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapProductRow);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProductRow(row: any, explicitSizeGuide?: any | null): Product {
  const cats = (row.product_categories || [])
    .map((pc: { categories: { slug: string; name: string } | null }) => pc.categories)
    .filter(Boolean);

  const swatches = (row.product_color_swatches || []).map(
    (s: { color_name: string; hex_code: string; images: string[] }) => ({
      name: s.color_name,
      hex: s.hex_code,
      images: s.images || [],
    })
  );

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
    categories: cats.map((c: { slug: string }) => c.slug),
    category_names: cats.map((c: { name: string }) => c.name),
    in_stock: row.in_stock,
    stock_qty: row.stock_qty,
    featured: row.featured,
    published: row.published,
    colors: swatches,
    sizes: [
      ...new Set(
        (row.product_variants || [])
          .map((v: { size: string | null }) => v.size)
          .filter(Boolean)
      ),
    ] as string[],
    variants: row.product_variants || [],
    size_guide: explicitSizeGuide !== undefined
      ? explicitSizeGuide
      : (row.size_guides?.[0] || null),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
