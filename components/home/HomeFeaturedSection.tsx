import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProductCard from "@/components/shop/ProductCard";
import { ArrowRight } from "lucide-react";

async function getRandomSchoolProducts() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: rootCat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "school-wear")
      .single();

    if (!rootCat) return [];

    const { data: level2 } = await supabase
      .from("categories")
      .select("id")
      .eq("parent_id", rootCat.id);

    const level2Ids = (level2 || []).map((c: { id: string }) => c.id);

    let level3Ids: string[] = [];
    if (level2Ids.length > 0) {
      const { data: level3 } = await supabase
        .from("categories")
        .select("id")
        .in("parent_id", level2Ids);
      level3Ids = (level3 || []).map((c: { id: string }) => c.id);
    }

    const allCatIds = [rootCat.id, ...level2Ids, ...level3Ids];

    const { data: pcData } = await supabase
      .from("product_categories")
      .select("product_id")
      .in("category_id", allCatIds);

    const productIds = [
      ...new Set((pcData || []).map((pc: { product_id: string }) => pc.product_id)),
    ];

    if (!productIds.length) return [];

    const { data } = await supabase
      .from("products")
      .select(`
        *,
        product_categories(categories(id, name, slug, parent_id)),
        product_variants(*),
        product_color_swatches(*),
        size_guides(*)
      `)
      .eq("published", true)
      .in("id", productIds)
      .limit(32);

    if (!data || !data.length) return [];

    return [...data].sort(() => Math.random() - 0.5).slice(0, 8);
  } catch {
    return [];
  }
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

export default async function HomeFeaturedSection() {
  const rawProducts = await getRandomSchoolProducts();
  const products = rawProducts.map(mapProduct);

  return (
    <section className="py-16 md:py-20">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-burgundy-700 mb-2">
              School Items
            </p>
            <h2 className="section-title">Shop School Items and Wears</h2>
          </div>
          <Link
            href="/shop/school-wear"
            className="hidden md:flex items-center gap-1.5 font-sans text-sm font-medium text-burgundy-800 hover:gap-2.5 transition-all"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="font-sans text-gray-400 text-sm mb-2">
              No school uniform products yet
            </p>
            <p className="font-sans text-gray-400 text-xs">
              Add products to your school categories to see them here
            </p>
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link href="/shop/school-wear" className="btn-outline">
            View All School Uniforms
          </Link>
        </div>
      </div>
    </section>
  );
}