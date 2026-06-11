import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import ProductDetail from "@/components/product/ProductDetail";
import RelatedProducts from "@/components/product/RelatedProducts";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface Props {
  params: { slug: string };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(row: any, explicitSizeGuide?: any | null) {
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
    size_guide: explicitSizeGuide !== undefined
      ? explicitSizeGuide
      : (row.size_guides?.[0] || null),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function getProduct(slug: string) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_categories(
          categories(id, name, slug, parent_id)
        ),
        product_variants(*),
        product_color_swatches(*),
        size_guides(*)
      `)
      .eq("slug", slug)
      .eq("published", true)
      .single();
    if (error || !data) return null;

    const { data: sizeGuideData } = await supabase
      .from("size_guides")
      .select("*")
      .eq("product_id", data.id)
      .maybeSingle();

    return mapProduct(data, sizeGuideData ?? null);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Abstitch`,
    description:
      product.short_description ||
      `Buy ${product.name} from Abstitch — Aberdeen's trusted school wear supplier.`,
    openGraph: {
      title: product.name,
      description: product.short_description || "",
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <SiteLayout>
      <div className="container-custom py-10 md:py-14">
        <ProductDetail product={product} />
        <div className="mt-16">
          <RelatedProducts
            productId={product.id}
            categoryIds={product.categories}
            schoolSlug={product.categories.find(
              (c: string) =>
                !["school-wear", "garments", "primary-schools",
                  "academy-schools", "safety-wear", "bags", "blazers",
                  "gifts", "gloves", "head-wear", "hoodies", "shirts",
                  "sweaters", "zoodies"].includes(c)
            )}
          />
        </div>
      </div>
    </SiteLayout>
  );
}