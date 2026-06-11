"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { useToast } from "@/components/ui/Toaster";
import { Plus, Trash2, X, ChevronDown, ChevronUp, Save } from "lucide-react";
import type { Category } from "@/types";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";
import Image from "next/image";

// Colour palette 
const COLOR_PALETTE: { name: string; hex: string }[] = [
  { name: "Black", hex: "#000000" },
  { name: "Blue", hex: "#0000ff" },
  { name: "Bottle Green", hex: "#006a4e" },
  { name: "Bright Blue", hex: "#0096ff" },
  { name: "Burgundy", hex: "#722F37" },
  { name: "Dark Grey", hex: "#404040" },
  { name: "Emerald", hex: "#50c878" },
  { name: "Green", hex: "#006400" },
  { name: "Grey", hex: "#808080" },
  { name: "Jade Green", hex: "#00a86b" },
  { name: "Light Grey", hex: "#d3d3d3" },
  { name: "Navy Blue", hex: "#001f5b" },
  { name: "Orange", hex: "#ff6600" },
  { name: "Purple", hex: "#6a0dad" },
  { name: "Red", hex: "#cc0000" },
  { name: "Royal Blue", hex: "#4169e1" },
  { name: "White", hex: "#ffffff" },
  { name: "Yellow", hex: "#ffd700" },
];

//Size list
const SIZE_LIST: string[] = [
  '6"','8"','10"','12"','14"','14.5"','15"','15.5"',
  '16"','16.5"','17"','17.5"','18"','18.5"','19"','20"',
  '21"','22"','23"','24"','25"','26"','27"','28"','29"',
  '30"','31"','32"','33"','34"','35"','36"','37"','38"',
  '39"','40"','41"','42"','44"','46"','48"','50"',
  "XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL",
  "Kids at 1–2 years","Kids at 3–4 years","Kids at 5–6 years",
  "Kids at 7–8 years","Kids at 9–10 years","Kids at 11–12 years",
  "Extra small – adults","Small – adults","Medium – adults",
  "Large – adults","Extra large – adults",
  "3/4","4","5","5/6","6","7","7/8","8","9","9/10",
  "10","11","11/12","12","13","13/14","14","15/16",
];

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

interface ColorEntry { name: string; hex: string; images: string[] }
interface SizeEntry { size: string; price: string }
interface SizeGuideRow { id: string; values: string[] }

interface FormState {
  type: "simple" | "variable";
  in_stock: boolean;
  featured: boolean;
  published: boolean;
  images: string[];
  category_ids: string[];
  colors: ColorEntry[];
  sizes: SizeEntry[];
  short_description: string;
  description: string;
  size_guide_title: string;
  size_guide_headers: string[];
  size_guide_rows: SizeGuideRow[];
  size_guide_notes: string;
  enable_size_guide: boolean;
}

interface ProductFormProps { productId?: string }

function Section({
  id, title, children, openSections, toggleSection,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  openSections: Record<string, boolean>;
  toggleSection: (key: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <h2 className="font-serif text-base font-bold text-gray-900">{title}</h2>
        {openSections[id]
          ? <ChevronUp size={16} className="text-gray-400" />
          : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {openSections[id] && (
        <div className="px-6 pb-6 pt-2 space-y-4 border-t border-gray-50">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AdminProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const isNew = !productId;
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [applyPriceToAll, setApplyPriceToAll] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true, media: true, pricing: true,
    variants: true, categories: true, sizeGuide: false,
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const skuRef = useRef<HTMLInputElement>(null);
  const basePriceRef = useRef<HTMLInputElement>(null);
  const salePriceRef = useRef<HTMLInputElement>(null);
  const stockQtyRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    type: "variable",
    in_stock: true,
    featured: false,
    published: true,
    images: [],
    category_ids: [],
    colors: [],
    sizes: [],
    short_description: "",
    description: "",
    size_guide_title: "Size Guide",
    size_guide_headers: ["Size", "Chest (cm)", "Waist (cm)", "Height (cm)"],
    size_guide_rows: [],
    size_guide_notes: "",
    enable_size_guide: false,
  });

  const setF = useCallback((key: keyof FormState, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      if (data) setCategories(data as Category[]);
    });
    if (!isNew && productId) loadProduct(productId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, isNew]);

  async function loadProduct(id: string) {
    const { data } = await supabase
      .from("products")
      .select("*, product_categories(category_id), product_color_swatches(*), size_guides(*)")
      .eq("id", id)
      .single();
    if (!data) return;

    const { data: sizeGuideData } = await supabase
      .from("size_guides")
      .select("*")
      .eq("product_id", id)
      .maybeSingle();

    const { data: variantsData } = await supabase
      .from("product_variants")
      .select("size, price")
      .eq("product_id", id)
      .not("size", "is", null);

    const seenSizes = new Map<string, string>();
    for (const v of variantsData || []) {
      if (!seenSizes.has(v.size)) seenSizes.set(v.size, v.price?.toString() || "");
    }

    const swatches: ColorEntry[] = (data.product_color_swatches || []).map(
      (s: { color_name: string; hex_code: string; images: string[] }) => ({
        name: s.color_name, hex: s.hex_code, images: s.images || [],
      })
    );

    const sizeGuide = sizeGuideData ?? data.size_guides?.[0] ?? null;

    const setRefs = () => {
      if (nameRef.current) nameRef.current.value = data.name || "";
      if (slugRef.current) slugRef.current.value = data.slug || "";
      if (skuRef.current) skuRef.current.value = data.sku || "";
      if (basePriceRef.current) basePriceRef.current.value = data.regular_price?.toString() || "";
      if (salePriceRef.current) salePriceRef.current.value = data.sale_price?.toString() || "";
      if (stockQtyRef.current) stockQtyRef.current.value = data.stock_qty?.toString() || "";
    };

    setRefs();
    setTimeout(setRefs, 100);
    setTimeout(setRefs, 300);

    setForm({
      type: data.type || "variable",
      in_stock: data.in_stock ?? true,
      featured: data.featured || false,
      published: data.published ?? true,
      images: data.images || [],
      category_ids: (data.product_categories || []).map(
        (pc: { category_id: string }) => pc.category_id
      ),
      colors: swatches,
      sizes: Array.from(seenSizes.entries()).map(([size, price]) => ({ size, price })),
      short_description: data.short_description || "",
      description: data.description || "",
      size_guide_title: sizeGuide?.title || "Size Guide",
      size_guide_headers: sizeGuide?.headers || ["Size","Chest (cm)","Waist (cm)","Height (cm)"],
      size_guide_rows: sizeGuide
        ? (sizeGuide.rows as string[][]).map((r, i) => ({ id: String(i), values: r }))
        : [],
      size_guide_notes: sizeGuide?.notes || "",
      enable_size_guide: !!sizeGuide,
    });

    if (sizeGuide) {
      setOpenSections((prev) => ({ ...prev, sizeGuide: true }));
    }
  }

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleColor = useCallback((name: string, hex: string) => {
    setForm((prev) => {
      const exists = prev.colors.find((c) => c.name === name);
      return {
        ...prev,
        colors: exists
          ? prev.colors.filter((c) => c.name !== name)
          : [...prev.colors, { name, hex, images: [] }],
      };
    });
  }, []);

  const addColorImage = useCallback((colorName: string, url: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c) =>
        c.name === colorName
          ? { ...c, images: [...c.images, url] }
          : c
      ),
    }));
  }, []);

  const removeColorImage = useCallback((colorName: string, imgIdx: number) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c) =>
        c.name === colorName
          ? { ...c, images: c.images.filter((_, i) => i !== imgIdx) }
          : c
      ),
    }));
  }, []);

  const toggleSize = useCallback((size: string) => {
    setForm((prev) => {
      const exists = prev.sizes.find((s) => s.size === size);
      return {
        ...prev,
        sizes: exists
          ? prev.sizes.filter((s) => s.size !== size)
          : [...prev.sizes, { size, price: basePriceRef.current?.value || "" }],
      };
    });
  }, []);

  const updateSizePrice = useCallback((size: string, price: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) => (s.size === size ? { ...s, price } : s)),
    }));
  }, []);

  const applyPriceToAllSizes = () => {
    if (!applyPriceToAll) return;
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) => ({ ...s, price: applyPriceToAll })),
    }));
  };

  const addSizeGuideRow = () => {
    setF("size_guide_rows", [
      ...form.size_guide_rows,
      { id: Date.now().toString(), values: form.size_guide_headers.map(() => "") },
    ]);
  };

  const updateSizeGuideRow = (rowIdx: number, colIdx: number, value: string) => {
    const rows = [...form.size_guide_rows];
    rows[rowIdx] = {
      ...rows[rowIdx],
      values: rows[rowIdx].values.map((v, i) => (i === colIdx ? value : v)),
    };
    setF("size_guide_rows", rows);
  };

  async function handleSave() {
    const name = nameRef.current?.value.trim() || "";
    if (!name) { alert("Product name is required"); return; }

    setSaving(true);
    try {
      const slug = slugRef.current?.value || slugify(name);
      const basePrice = parseFloat(basePriceRef.current?.value || "") || null;
      const salePrice = parseFloat(salePriceRef.current?.value || "") || null;
      const stockQty = parseInt(stockQtyRef.current?.value || "") || null;

      const sizePrices = form.sizes
        .map((s) => parseFloat(s.price))
        .filter((p) => !isNaN(p) && p > 0);
      const priceMin = sizePrices.length > 0 ? Math.min(...sizePrices) : basePrice;
      const priceMax = sizePrices.length > 0 ? Math.max(...sizePrices) : basePrice;

      const productData = {
        name,
        slug,
        type: form.type,
        sku: skuRef.current?.value || null,
        short_description: form.short_description || null,
        description: form.description || null,
        regular_price: basePrice ?? priceMin,
        sale_price: salePrice,
        price_range_min: priceMin ?? basePrice,
        price_range_max: priceMax ?? basePrice,
        images: form.images,
        in_stock: form.in_stock,
        stock_qty: stockQty,
        featured: form.featured,
        published: form.published,
      };

      let productId_: string;
      if (isNew) {
        const { data, error } = await supabase
          .from("products").insert(productData).select("id").single();
        if (error) throw error;
        productId_ = data.id;
      } else {
        const { error } = await supabase
          .from("products").update(productData).eq("id", productId!);
        if (error) throw error;
        productId_ = productId!;
      }

      await supabase.from("product_categories").delete().eq("product_id", productId_);
      if (form.category_ids.length) {
        await supabase.from("product_categories").insert(
          form.category_ids.map((cid) => ({ product_id: productId_, category_id: cid }))
        );
      }

      await supabase.from("product_color_swatches").delete().eq("product_id", productId_);
      if (form.colors.length) {
        await supabase.from("product_color_swatches").insert(
          form.colors.map((c, i) => ({
            product_id: productId_, color_name: c.name,
            hex_code: c.hex, images: c.images, position: i,
          }))
        );
      }

      await supabase.from("product_variants").delete().eq("product_id", productId_);
      if (form.sizes.length > 0) {
        const colorsToUse = form.colors.length > 0
          ? form.colors
          : [{ name: null as string | null, hex: null as string | null }];

        const variantInserts: object[] = [];
        for (const colorEntry of colorsToUse) {
          for (const sizeEntry of form.sizes) {
            variantInserts.push({
              product_id: productId_,
              color: colorEntry.name,
              color_hex: colorEntry.hex,
              size: sizeEntry.size,
              price: parseFloat(sizeEntry.price) || basePrice || 0,
              sale_price: salePrice,
              in_stock: form.in_stock,
              images: [],
            });
          }
        }
        for (let i = 0; i < variantInserts.length; i += 100) {
          await supabase.from("product_variants").insert(variantInserts.slice(i, i + 100));
        }
      }

      await supabase.from("size_guides").delete().eq("product_id", productId_);
      if (form.enable_size_guide) {
        const { error: sgError } = await supabase.from("size_guides").insert({
          product_id: productId_,
          title: form.size_guide_title,
          headers: form.size_guide_headers,
          rows: form.size_guide_rows.map((r) => r.values),
          notes: form.size_guide_notes || null,
        });
        if (sgError) throw new Error("Size guide save failed: " + sgError.message);
      }

      success(isNew ? "Product created successfully." : "Product saved successfully.");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toastError("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">

      <Section id="basic" title="Basic Information" openSections={openSections} toggleSection={toggleSection}>
        <div>
          <label className="label">Product Name *</label>
          <input
            ref={nameRef}
            defaultValue=""
            onChange={() => {
              if (isNew && slugRef.current && nameRef.current) {
                slugRef.current.value = slugify(nameRef.current.value);
              }
            }}
            className="input-field"
            placeholder="e.g. Aberdeen Primary School Polo Shirt"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">URL Slug</label>
            <input ref={slugRef} defaultValue="" className="input-field font-mono text-sm" />
          </div>
          <div>
            <label className="label">SKU</label>
            <input ref={skuRef} defaultValue="" className="input-field" placeholder="e.g. ABS-001" />
          </div>
        </div>
        <div>
          <label className="label">Short Description</label>
          <RichTextEditor
            value={form.short_description}
            onChange={(val) => setF("short_description", val)}
            placeholder="Brief summary shown on product listing"
          />
        </div>
        <div>
          <label className="label">Full Description</label>
          <RichTextEditor
            value={form.description}
            onChange={(val) => setF("description", val)}
            placeholder="Full product description..."
          />
        </div>
        <div className="flex flex-wrap gap-6 pt-2">
          {([
            { key: "published", label: "Published" },
            { key: "featured", label: "Featured" },
            { key: "in_stock", label: "In Stock" },
          ] as const).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => setF(key, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-burgundy-800 focus:ring-burgundy-800"
              />
              <span className="font-sans text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section id="media" title="Product Images" openSections={openSections} toggleSection={toggleSection}>
        <p className="font-sans text-xs text-gray-500">
          Upload images or paste URLs. These are the default images shown before any colour is selected.
        </p>
        <ImageUploader onAdd={(url) => setF("images", [...form.images, url])} />
        {form.images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-3">
          {form.images.map((img, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <Image
                src={img}
                alt={`Product image ${i + 1}`}
                fill
                className="object-cover"
                unoptimized={img.includes("abstitch.com") || img.includes("supabase")}
                sizes="120px"
              />
              <button
                type="button"
                onClick={() => setF("images", form.images.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <X size={10} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-burgundy-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      </Section>

      <Section id="pricing" title="Pricing" openSections={openSections} toggleSection={toggleSection}>
        <p className="font-sans text-xs text-gray-500">
          Set a base price here. You can also set individual prices per size below.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Base Price (£)</label>
            <input
              ref={basePriceRef}
              type="number"
              step="0.01"
              defaultValue=""
              className="input-field"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="label">Sale Price (£)</label>
            <input
              ref={salePriceRef}
              type="number"
              step="0.01"
              defaultValue=""
              className="input-field"
              placeholder="Optional"
            />
          </div>
        </div>
      </Section>

      <Section id="variants" title="Colours & Sizes" openSections={openSections} toggleSection={toggleSection}>

        <div>
          <label className="label">Add Colours</label>
          <p className="font-sans text-xs text-gray-400 mb-3">
            Click a colour to select it. Then optionally assign images per colour.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {COLOR_PALETTE.map((c) => {
              const isSelected = form.colors.some((fc) => fc.name === c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleColor(c.name, c.hex)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-sans transition-all
                    ${isSelected
                      ? "border-burgundy-800 bg-burgundy-50 text-burgundy-800 font-semibold"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border flex-shrink-0"
                    style={{
                      backgroundColor: c.hex,
                      borderColor: isLightColor(c.hex) ? "#d1d5db" : "transparent",
                    }}
                  />
                  {c.name}
                  {isSelected && " ✓"}
                </button>
              );
            })}
          </div>

          {form.colors.length > 0 && (
            <div className="space-y-3">
              <p className="font-sans text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Assign images per colour
              </p>
              {form.colors.map((c) => (
                <div key={c.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="font-sans text-sm font-semibold text-gray-800">
                        {c.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleColor(c.name, c.hex)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <ImageUploader
                    compact
                    onAdd={(url) => addColorImage(c.name, url)}
                  />
                  {c.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {c.images.map((img, ii) => (
                      <div key={ii} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <Image
                          src={img}
                          alt={`${c.name} image ${ii + 1}`}
                          fill
                          className="object-cover"
                          unoptimized={img.includes("abstitch.com") || img.includes("supabase")}
                          sizes="80px"
                        />
                        <button
                          type="button"
                          onClick={() => removeColorImage(c.name, ii)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Select Sizes &amp; Set Prices</label>
            {form.sizes.length > 0 && (
              <span className="font-sans text-xs text-gray-500">
                {form.sizes.length} size{form.sizes.length !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>
          <p className="font-sans text-xs text-gray-400 mb-3">
            Click sizes to select. Then set a price for each one below.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {SIZE_LIST.map((size) => {
              const isSelected = form.sizes.some((s) => s.size === size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 rounded-md border text-xs font-sans transition-all
                    ${isSelected
                      ? "bg-burgundy-800 border-burgundy-800 text-white font-semibold"
                      : "border-gray-300 text-gray-600 hover:border-burgundy-300"
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {form.sizes.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200 flex-wrap">
                <label className="font-sans text-xs font-semibold text-gray-600 whitespace-nowrap">
                  Apply one price to all:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={applyPriceToAll}
                  onChange={(e) => setApplyPriceToAll(e.target.value)}
                  className="input-field py-1.5 text-xs w-28"
                  placeholder="£0.00"
                />
                <button
                  type="button"
                  onClick={applyPriceToAllSizes}
                  className="btn-primary py-1.5 px-3 text-xs whitespace-nowrap"
                >
                  Apply to All
                </button>
              </div>

              <div className="space-y-2">
                {form.sizes.map((entry) => (
                  <div key={entry.size} className="flex items-center gap-3">
                    <div className="w-40 flex-shrink-0">
                      <span className="font-sans text-sm font-medium text-gray-700">
                        {entry.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans text-sm text-gray-500">£</span>
                      <input
                        type="number"
                        step="0.01"
                        value={entry.price}
                        onChange={(e) => updateSizePrice(entry.size, e.target.value)}
                        className="input-field py-1.5 text-sm w-28"
                        placeholder="0.00"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSize(entry.size)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section id="categories" title="Categories" openSections={openSections} toggleSection={toggleSection}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.category_ids.includes(cat.id)}
                onChange={(e) =>
                  setF(
                    "category_ids",
                    e.target.checked
                      ? [...form.category_ids, cat.id]
                      : form.category_ids.filter((id) => id !== cat.id)
                  )
                }
                className="w-3.5 h-3.5 rounded border-gray-300 text-burgundy-800 focus:ring-burgundy-800"
              />
              <span className="font-sans text-xs text-gray-700 leading-snug">{cat.name}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section id="sizeGuide" title="Size Guide" openSections={openSections} toggleSection={toggleSection}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.enable_size_guide}
            onChange={(e) => setF("enable_size_guide", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-burgundy-800 focus:ring-burgundy-800"
          />
          <span className="font-sans text-sm text-gray-700 font-medium">
            Enable size guide for this product
          </span>
        </label>

        {form.enable_size_guide && (
          <div className="space-y-5 pt-2">
            <div>
              <label className="label">Guide Title</label>
              <input
                value={form.size_guide_title}
                onChange={(e) => setF("size_guide_title", e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Size Guide Content (Rich Text)</label>
              <p className="font-sans text-xs text-gray-400 mb-2">
                Paste a table or type your size guide here. Supports bold, tables, lists.
              </p>
              <RichTextEditor
                value={form.size_guide_notes}
                onChange={(val) => setF("size_guide_notes", val)}
                placeholder="Paste or type your size guide table here..."
              />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <label className="label">Manual Table Builder (optional)</label>
              <p className="font-sans text-xs text-gray-400 mb-3">
                Alternatively, build a simple table row by row.
              </p>
              <div className="mb-2">
                <p className="font-sans text-xs font-semibold text-gray-600 mb-2">Headers</p>
                <div className="flex flex-wrap gap-2">
                  {form.size_guide_headers.map((h, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <input
                        value={h}
                        onChange={(e) => {
                          const hdrs = [...form.size_guide_headers];
                          hdrs[i] = e.target.value;
                          setF("size_guide_headers", hdrs);
                        }}
                        className="input-field w-28 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setF("size_guide_headers", form.size_guide_headers.filter((_, j) => j !== i));
                          setF("size_guide_rows", form.size_guide_rows.map((r) => ({
                            ...r,
                            values: r.values.filter((_, j) => j !== i),
                          })));
                        }}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setF("size_guide_headers", [...form.size_guide_headers, ""])}
                    className="px-3 py-1.5 text-xs border border-dashed border-gray-300 rounded text-gray-500 hover:border-burgundy-300"
                  >
                    + Column
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {form.size_guide_rows.map((row, ri) => (
                  <div key={row.id} className="flex items-center gap-2">
                    {row.values.map((val, ci) => (
                      <input
                        key={ci}
                        value={val}
                        onChange={(e) => updateSizeGuideRow(ri, ci, e.target.value)}
                        className="input-field flex-1 py-1.5 text-xs min-w-0"
                        placeholder={form.size_guide_headers[ci] || `Col ${ci + 1}`}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setF("size_guide_rows", form.size_guide_rows.filter((_, i) => i !== ri))
                      }
                      className="text-red-400 hover:text-red-600 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSizeGuideRow}
                className="mt-2 text-xs text-burgundy-800 hover:underline font-sans font-medium flex items-center gap-1"
              >
                <Plus size={13} />
                Add Row
              </button>
            </div>
          </div>
        )}
      </Section>

      <div className="flex items-center gap-3 sticky bottom-0 bg-white border-t border-gray-100 py-4 z-10">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={16} />
              {isNew ? "Create Product" : "Save Changes"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}