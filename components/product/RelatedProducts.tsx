import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/shop/ProductGrid";

interface RelatedProductsProps {
  productId: string;
  categoryIds: string[];
  schoolSlug?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(row: any) {
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
}

export default async function RelatedProducts({
  productId,
  categoryIds,
  schoolSlug,
}: RelatedProductsProps) {
  try {
    const supabase = createServerSupabaseClient();

    const lookupSlug = schoolSlug || categoryIds[0];
    if (!lookupSlug) return null;

    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", lookupSlug)
      .single();

    if (!cat) return null;

    const { data: pcData } = await supabase
      .from("product_categories")
      .select("product_id")
      .eq("category_id", cat.id);

    const productIds = (pcData || [])
      .map((pc: { product_id: string }) => pc.product_id)
      .filter((id: string) => id !== productId);

    if (!productIds.length) return null;

    const { data } = await supabase
      .from("products")
      .select(`
        *,
        product_categories(categories(id,name,slug,parent_id)),
        product_variants(*),
        product_color_swatches(*),
        size_guides(*)
      `)
      .eq("published", true)
      .in("id", productIds)
      .limit(8);

    if (!data || !data.length) return null;

    const products = data.map(mapProduct);

    return (
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-serif text-2xl font-bold text-gray-900">
            More From This School
          </h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <ProductGrid products={products} />
      </section>
    );
  } catch {
    return null;
  }
}