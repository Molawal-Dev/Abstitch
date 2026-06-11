import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

// ── Config ──────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌  Missing SUPABASE env vars. Copy .env.local values first.");
  process.exit(1);
}

console.log("🔗 Connecting to:", SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
  db: { schema: "public" },
  global: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});

// ── Helpers ─────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseImages(raw: string): string[] {
  if (!raw || raw === "nan") return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSwatches(raw: string): { name: string; hex: string }[] {
  if (!raw || raw === "nan") return [];
  try {
    // WooCommerce Variation Swatches format: Name:#hex,Name:#hex
    return raw
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((entry) => {
        // Possible formats:
        //  "Blue:#0000ff"
        //  "Blue" (no hex)
        const parts = entry.split(":");
        if (parts.length >= 2) {
          return { name: parts[0].trim(), hex: parts.slice(1).join(":").trim() };
        }
        return null;
      })
      .filter(Boolean) as { name: string; hex: string }[];
  } catch {
    return [];
  }
}

// Fallback colour map
const COLOUR_HEX: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  "navy blue": "#001f5b",
  navy: "#001f5b",
  "royal blue": "#4169e1",
  "sky blue": "#87ceeb",
  red: "#cc0000",
  burgundy: "#722F37",
  maroon: "#800000",
  green: "#006400",
  "bottle green": "#006a4e",
  emerald: "#50c878",
  yellow: "#ffd700",
  gold: "#ffc107",
  orange: "#ff6600",
  purple: "#6a0dad",
  grey: "#808080",
  gray: "#808080",
  "light grey": "#d3d3d3",
  charcoal: "#36454f",
  brown: "#795548",
  pink: "#ff69b4",
  teal: "#008080",
  turquoise: "#40e0d0",
  beige: "#f5f5dc",
  cream: "#fffdd0",
  "bottle bottle green": "#006a4e",
};

function colourHex(name: string): string {
  return COLOUR_HEX[name.toLowerCase()] || "#999999";
}

// ── Category definitions ─────────────────────────────────────
const SCHOOL_NAMES = [
  "Abbotswell School", "Aberdeen Grammer School", "Airyhall School",
  "Ashley Road School", "Braehead School", "Bramble Brae School",
  "Bridge of Don Academy", "Brimmond School", "Broomhill School",
  "Bucksburn Academy", "Charleston School", "Cornhill School",
  "Countesswells School", "Culter School", "Cults Academy", "Cults School",
  "Danestone School", "Dyce Academy", "Dyce School", "Fernielea School",
  "Ferryhill School", "Forehill School", "Gilcomstoun School",
  "Greenbrae School", "Greyhope School", "Hanover Street School",
  "Harlaw Academy", "Hazlehead Academy", "Hazlehead School",
  "Heathryburn School", "Holy Family RC School", "Kaimhill School",
  "Kingsford School", "Kingswells School", "Kirkhill School",
  "Kittybrewster School", "Lochside Academy", "Loirston School",
  "Manor Park School", "Middleton Park School", "Mile End School",
  "Milltimber School", "Muirfield School", "Northfield Academy",
  "Oldmachar Academy", "Orchard Brae School", "Quarryhill School",
  "Riverbank School", "Scotstown School", "Seaton School",
  "Skene square School", "St Joseph's RC School", "St Machar Academy",
  "St Peter's RC School", "Stoneywood School", "Sunnybank School",
  "Tullos School", "Westpark School", "Woodside School",
];

const ACADEMY_NAMES = [
  "Bridge of Don Academy", "Bucksburn Academy", "Cults Academy",
  "Dyce Academy", "Harlaw Academy", "Hazlehead Academy", "Lochside Academy",
  "Northfield Academy", "Oldmachar Academy", "St Machar Academy",
];

const ROOT_CATEGORIES = [
  { name: "School Wear", slug: "school-wear" },
  { name: "Garments", slug: "garments" },
  { name: "Bags", slug: "bags" },
  { name: "Blazers", slug: "blazers" },
  { name: "Gifts", slug: "gifts" },
  { name: "Gloves", slug: "gloves" },
  { name: "Head Wear", slug: "head-wear" },
  { name: "Hoodies", slug: "hoodies" },
  { name: "Safety Wear", slug: "safety-wear" },
  { name: "Shirts", slug: "shirts" },
  { name: "Sweaters", slug: "sweaters" },
  { name: "Zoodies", slug: "zoodies" },
];

async function main() {
  console.log("🚀 Abstitch product import starting...\n");

  const csvPath = path.join(process.cwd(), "scripts", "products.csv");
  if (!fs.existsSync(csvPath)) {
    console.error(`❌  CSV not found at ${csvPath}`);
    console.error("    Copy your WooCommerce export to: scripts/products.csv");
    process.exit(1);
  }

  const csvText = fs.readFileSync(csvPath, "utf-8");
  const { data: rows } = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  console.log(`📦  CSV loaded: ${rows.length} rows`);

  console.log("\n📁  Seeding categories...");
  const categoryIdMap = new Map<string, string>();

  // Root categories first
  for (const cat of ROOT_CATEGORIES) {
    const { data, error } = await supabase
      .from("categories")
      .upsert({ name: cat.name, slug: cat.slug, parent_id: null }, { onConflict: "slug" })
      .select("id")
      .single();
    if (error) console.warn(`  ⚠️  Root cat "${cat.name}": ${error.message}`);
    else categoryIdMap.set(cat.slug, data.id);
  }

  // School Wear parent
  const schoolWearId = categoryIdMap.get("school-wear");
  const garmentId = categoryIdMap.get("garments");

  // Primary / Academy sub-categories
  const { data: primaryCat } = await supabase
    .from("categories")
    .upsert({ name: "Primary Schools", slug: "primary-schools", parent_id: schoolWearId }, { onConflict: "slug" })
    .select("id").single();
  if (primaryCat) categoryIdMap.set("primary-schools", primaryCat.id);

  const { data: academyCat } = await supabase
    .from("categories")
    .upsert({ name: "Academy Schools", slug: "academy-schools", parent_id: schoolWearId }, { onConflict: "slug" })
    .select("id").single();
  if (academyCat) categoryIdMap.set("academy-schools", academyCat.id);

  // Safety Wear sub-category
  const safetyId = categoryIdMap.get("safety-wear");
  const { data: coverallsCat } = await supabase
    .from("categories")
    .upsert({ name: "Coveralls", slug: "coveralls", parent_id: safetyId }, { onConflict: "slug" })
    .select("id").single();
  if (coverallsCat) categoryIdMap.set("coveralls", coverallsCat.id);

  // Individual school categories
  for (const school of SCHOOL_NAMES) {
    const slug = slugify(school);
    const isAcademy = ACADEMY_NAMES.includes(school);
    const parentId = isAcademy ? academyCat?.id : primaryCat?.id;

    const { data, error } = await supabase
      .from("categories")
      .upsert({ name: school, slug, parent_id: parentId }, { onConflict: "slug" })
      .select("id")
      .single();

    if (!error && data) categoryIdMap.set(slug, data.id);
  }

  console.log(`  ✅  ${categoryIdMap.size} categories seeded`);

  const parentRows = rows.filter((r) => r.Type === "variable" || r.Type === "simple");
  const variationRows = rows.filter((r) => r.Type === "variation");

  const variationsByParent = new Map<string, typeof variationRows>();
  for (const v of variationRows) {
    const parentRef = v.Parent || "";
    const match = parentRef.match(/^id:(\d+)$/);
    if (match) {
      const pid = match[1];
      if (!variationsByParent.has(pid)) variationsByParent.set(pid, []);
      variationsByParent.get(pid)!.push(v);
    }
  }

  console.log(`\n📦  Importing ${parentRows.length} products...`);

  let imported = 0;
  let failed = 0;

  for (const row of parentRows) {
    try {
      const wcId = String(row.ID || "");
      const name = (row.Name || "").trim();
      if (!name) continue;

      const rawCatsForSlug = (row.Categories || "").split(",").map((c: string) => c.trim()).filter(Boolean);
      const firstCat = rawCatsForSlug[0] || "";
      const catSuffix = firstCat.includes(">")
        ? slugify(firstCat.split(">").pop()?.trim() || "")
        : slugify(firstCat);
      const slug = catSuffix ? `${slugify(name)}-${catSuffix}` : slugify(name);
      const images = parseImages(row.Images);
      const isVariable = row.Type === "variable";

      // Parse price
      const regularPrice = parseFloat(row["Regular price"]) || null;
      const salePrice = parseFloat(row["Sale price"]) || null;

      // Parse colours
      const attr1Name = (row["Attribute 1 name"] || "").toLowerCase();
      const attr1Values = row["Attribute 1 value(s)"] || "";
      const isColorAttr = attr1Name.includes("colour") || attr1Name.includes("color");
      const colourNames = isColorAttr
        ? attr1Values.split("|").map((s: string) => s.trim()).filter(Boolean)
        : [];

      // Sizes
      const attr2Name = (row["Attribute 2 name"] || "").toLowerCase();
      const attr2Values = row["Attribute 2 value(s)"] || "";
      const isSizeAttr = attr2Name.includes("size");
      const sizeValues = isSizeAttr
        ? attr2Values.split("|").map((s: string) => s.trim()).filter(Boolean)
        : [];

      const variations = variationsByParent.get(wcId) || [];

      const varPrices = variations.map((v) => parseFloat(v["Regular price"])).filter((p) => !isNaN(p) && p > 0);
      const priceMin = varPrices.length > 0 ? Math.min(...varPrices) : regularPrice;
      const priceMax = varPrices.length > 0 ? Math.max(...varPrices) : regularPrice;

      const rawCats = (row.Categories || "").split(",").map((c: string) => c.trim()).filter(Boolean);
      const categoryIds: string[] = [];
      for (const rawCat of rawCats) {
        let lookupSlug: string;
        if (rawCat.startsWith("School Wear > ")) {
          lookupSlug = slugify(rawCat.replace("School Wear > ", ""));
        } else if (rawCat.startsWith("Safety Wear > ")) {
          lookupSlug = slugify(rawCat.replace("Safety Wear > ", ""));
        } else {
          lookupSlug = slugify(rawCat);
        }
        const catId = categoryIdMap.get(lookupSlug);
        if (catId && !categoryIds.includes(catId)) categoryIds.push(catId);
      }

      // Insert product
      const productData = {
        name,
        slug,
        type: isVariable ? "variable" : "simple",
        sku: row.SKU || null,
        short_description: row["Short description"] || null,
        description: row.Description || null,
        regular_price: regularPrice,
        sale_price: salePrice || null,
        price_range_min: priceMin,
        price_range_max: priceMax,
        images,
        in_stock: (row["In stock?"] || "").toLowerCase() !== "no",
        stock_qty: parseInt(row.Stock) || null,
        featured: false,
        published: (row.Published || "1") !== "0",
        wc_id: parseInt(wcId) || null,
      };

      const { data: product, error: productError } = await supabase
        .from("products")
        .upsert(productData, { onConflict: "slug" })
        .select("id")
        .single();

      if (productError) {
        // slug conflict — try with wc id suffix
        const altSlug = `${slug}-${wcId}`;
        const { data: altProduct, error: altError } = await supabase
          .from("products")
          .upsert({ ...productData, slug: altSlug }, { onConflict: "slug" })
          .select("id")
          .single();

        if (altError || !altProduct) {
          failed++;
          console.warn(`  ⚠️  Failed even with alt slug: ${name} — ${altError?.message}`);
          continue;
        }

        const altProductId = altProduct.id;

        if (categoryIds.length) {
          await supabase.from("product_categories").delete().eq("product_id", altProductId);
          await supabase.from("product_categories").insert(
            categoryIds.map((cid) => ({ product_id: altProductId, category_id: cid }))
          );
        }

        imported++;
        continue;
      }

      if (!product) { failed++; continue; }
      const productId = product.id;

      // ── Categories ──
      if (categoryIds.length) {
        await supabase.from("product_categories").delete().eq("product_id", productId);
        await supabase.from("product_categories").insert(
          categoryIds.map((cid) => ({ product_id: productId, category_id: cid }))
        );
      }

      // ── Colour swatches ──
      await supabase.from("product_color_swatches").delete().eq("product_id", productId);

      if (colourNames.length) {
        const colourImageMap = new Map<string, string[]>();
        for (const v of variations) {
          const vAttr1 = (v["Attribute 1 value(s)"] || "").trim();
          const vImg = parseImages(v.Images);
          if (vAttr1 && vImg.length) {
            if (!colourImageMap.has(vAttr1)) colourImageMap.set(vAttr1, []);
            const existing = colourImageMap.get(vAttr1)!;
            for (const img of vImg) {
              if (!existing.includes(img)) existing.push(img);
            }
          }
        }

        const swatchInserts = colourNames.map((name: string, i: number) => ({
          product_id: productId,
          color_name: name,
          hex_code: colourHex(name),
          images: colourImageMap.get(name) || [],
          position: i,
        }));

        await supabase.from("product_color_swatches").insert(swatchInserts);
      }

      // ── Variants ──
      await supabase.from("product_variants").delete().eq("product_id", productId);

      if (variations.length > 0) {
        const variantInserts = variations.map((v, i) => {
          const vColour = (v["Attribute 1 value(s)"] || "").trim() || null;
          const vSize = (v["Attribute 2 value(s)"] || "").trim() || null;
          const vPrice = parseFloat(v["Regular price"]) || regularPrice || 0;
          const vSalePrice = parseFloat(v["Sale price"]) || null;
          const vImages = parseImages(v.Images);
          return {
            product_id: productId,
            color: vColour,
            color_hex: vColour ? colourHex(vColour) : null,
            size: vSize,
            price: vPrice,
            sale_price: vSalePrice,
            sku: v.SKU || null,
            in_stock: (v["In stock?"] || "").toLowerCase() !== "no",
            images: vImages,
            position: i,
          };
        });

        for (let i = 0; i < variantInserts.length; i += 100) {
          await supabase.from("product_variants").insert(variantInserts.slice(i, i + 100));
        }
      } else if (sizeValues.length > 0) {
        const variantInserts = sizeValues.map((size: string, i: number) => ({
          product_id: productId,
          color: null,
          size,
          price: regularPrice || 0,
          sale_price: salePrice || null,
          in_stock: true,
          images: [],
          position: i,
        }));
        await supabase.from("product_variants").insert(variantInserts);
      }

      imported++;
      if (imported % 25 === 0) {
        process.stdout.write(`  ✅  ${imported}/${parentRows.length} imported...\n`);
      }
    } catch (err) {
      failed++;
      console.warn(`  ⚠️  Failed row: ${row.Name} — ${err}`);
    }
  }

  console.log(`\n🎉  Import complete!`);
  console.log(`   ✅  ${imported} products imported`);
  if (failed > 0) console.log(`   ⚠️  ${failed} products failed`);
  console.log("\n📌  Next steps:");
  console.log("   1. Visit /admin to manage products");
  console.log("   2. Set featured products in the admin dashboard");
  console.log("   3. Configure Stripe keys and test a checkout");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
