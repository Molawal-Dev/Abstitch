"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Copy, Filter, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { supabase } from "@/lib/supabase/client";
import { formatPrice, debounce } from "@/lib/utils";
import { useToast } from "@/components/ui/Toaster";
import { useConfirm } from "@/components/ui/ConfirmModal";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  type: string;
  regular_price: number | null;
  price_range_min: number | null;
  price_range_max: number | null;
  images: string[];
  in_stock: boolean;
  published: boolean;
  featured: boolean;
  created_at: string;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkDuplicating, setBulkDuplicating] = useState(false);

  const confirm = useConfirm();
  const { success, error } = useToast();
  const PER_PAGE = 25;

  // Load categories once
  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name, slug")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data as CategoryOption[]);
      });
  }, []);

  const fetchProducts = useCallback(
    async (q: string, p: number, categoryId: string) => {
      setLoading(true);
      try {
        if (categoryId) {
          const { data: pcData } = await supabase
            .from("product_categories")
            .select("product_id")
            .eq("category_id", categoryId);

          const productIds = (pcData || []).map(
            (pc: { product_id: string }) => pc.product_id
          );

          if (!productIds.length) {
            setProducts([]);
            setTotal(0);
            setLoading(false);
            return;
          }

          let query = supabase
            .from("products")
            .select(
              "id, name, slug, type, regular_price, price_range_min, price_range_max, images, in_stock, published, featured, created_at",
              { count: "exact" }
            )
            .in("id", productIds)
            .order("created_at", { ascending: false })
            .range((p - 1) * PER_PAGE, p * PER_PAGE - 1);

          if (q) query = query.ilike("name", `%${q}%`);

          const { data, count, error: fetchErr } = await query;
          if (!fetchErr) {
            setProducts(data as ProductRow[]);
            setTotal(count || 0);
          }
        } else {
          // No category filter
          let query = supabase
            .from("products")
            .select(
              "id, name, slug, type, regular_price, price_range_min, price_range_max, images, in_stock, published, featured, created_at",
              { count: "exact" }
            )
            .order("created_at", { ascending: false })
            .range((p - 1) * PER_PAGE, p * PER_PAGE - 1);

          if (q) query = query.ilike("name", `%${q}%`);

          const { data, count, error: fetchErr } = await query;
          if (!fetchErr) {
            setProducts(data as ProductRow[]);
            setTotal(count || 0);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((q: string) => {
      setPage(1);
      fetchProducts(q, 1, selectedCategory);
    }, 400),
    [fetchProducts, selectedCategory]
  );

  useEffect(() => {
    fetchProducts(search, page, selectedCategory);
    setSelectedIds([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearch("");
    setPage(1);
    fetchProducts("", 1, "");
  };

  const hasActiveFilters = selectedCategory || search;

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: "Delete Product",
      message: `Are you sure you want to delete "${name}"? This action cannot be undone and will remove all variants, images, and size guides associated with this product.`,
      confirmLabel: "Yes, Delete",
      cancelLabel: "Cancel",
      variant: "danger",
      icon: "delete",
    });
    if (!confirmed) return;
    const { error: err } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    if (err) {
      error("Failed to delete product.");
    } else {
      success(`"${name}" deleted successfully.`);
      fetchProducts(search, page, selectedCategory);
    }
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error: err } = await supabase
      .from("products")
      .update({ published: !current })
      .eq("id", id);
    if (err) {
      error("Failed to update status.");
    } else {
      success(current ? "Product set to draft." : "Product published.");
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: !current } : p))
      );
    }
  };

  const duplicateProductCore = async (product: ProductRow) => {
    const { data: full } = await supabase
      .from("products")
      .select("*")
      .eq("id", product.id)
      .single();

    if (!full) throw new Error("Could not fetch product");

    const newSlug = `${full.slug}-copy-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const newName = `${full.name} (Copy)`;
    const newSku = full.sku ? `${full.sku}-COPY` : null;

    const { data: newProduct, error: insertError } = await supabase
      .from("products")
      .insert({
        name: newName,
        slug: newSlug,
        type: full.type,
        sku: newSku,
        short_description: full.short_description,
        description: full.description,
        regular_price: full.regular_price,
        sale_price: full.sale_price,
        price_range_min: full.price_range_min,
        price_range_max: full.price_range_max,
        images: full.images,
        in_stock: full.in_stock,
        stock_qty: full.stock_qty,
        featured: false,
        published: false,
        wc_id: null,
      })
      .select("id")
      .single();

    if (insertError || !newProduct) throw insertError;

    const newId = newProduct.id;

    const { data: cats } = await supabase
      .from("product_categories")
      .select("category_id")
      .eq("product_id", product.id);

    if (cats?.length) {
      await supabase.from("product_categories").insert(
        cats.map((c) => ({ product_id: newId, category_id: c.category_id }))
      );
    }

    const { data: swatches } = await supabase
      .from("product_color_swatches")
      .select("*")
      .eq("product_id", product.id);

    if (swatches?.length) {
      await supabase.from("product_color_swatches").insert(
        swatches.map((s) => ({
          product_id: newId,
          color_name: s.color_name,
          hex_code: s.hex_code,
          images: s.images,
          position: s.position,
        }))
      );
    }

    const { data: variants } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", product.id);

    if (variants?.length) {
      const variantBatches = variants.map((v) => ({
        product_id: newId,
        color: v.color,
        color_hex: v.color_hex,
        size: v.size,
        price: v.price,
        sale_price: v.sale_price,
        sku: v.sku ? `${v.sku}-COPY` : null,
        in_stock: v.in_stock,
        stock_qty: v.stock_qty,
        images: v.images,
        position: v.position,
      }));
      for (let i = 0; i < variantBatches.length; i += 100) {
        await supabase
          .from("product_variants")
          .insert(variantBatches.slice(i, i + 100));
      }
    }

    const { data: sizeGuide } = await supabase
      .from("size_guides")
      .select("*")
      .eq("product_id", product.id)
      .maybeSingle();

    if (sizeGuide) {
      await supabase.from("size_guides").insert({
        product_id: newId,
        title: sizeGuide.title,
        headers: sizeGuide.headers,
        rows: sizeGuide.rows,
        notes: sizeGuide.notes,
      });
    }

    return newName;
  };

  const handleDuplicate = async (product: ProductRow) => {
    const confirmed = await confirm({
      title: "Duplicate Product",
      message: `This will create a copy of "${product.name}" as a draft. You can then edit it and publish when ready.`,
      confirmLabel: "Yes, Duplicate",
      cancelLabel: "Cancel",
      variant: "info",
      icon: "duplicate",
    });
    if (!confirmed) return;
    setDuplicating(product.id);

    try {
      const newName = await duplicateProductCore(product);
      await fetchProducts(search, 1, selectedCategory);
      setPage(1);
      success(`"${newName}" duplicated as a draft — it's now at the top of the list.`);
    } catch (err) {
      console.error(err);
      error("Failed to duplicate product. Please try again.");
    } finally {
      setDuplicating(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Selected Products",
      message: `Are you sure you want to delete ${selectedIds.length} product${selectedIds.length !== 1 ? "s" : ""}? This action cannot be undone and will remove all variants, images, and size guides associated with these products.`,
      confirmLabel: "Yes, Delete All",
      cancelLabel: "Cancel",
      variant: "danger",
      icon: "delete",
    });
    if (!confirmed) return;

    setBulkDeleting(true);
    try {
      const { error: err } = await supabase
        .from("products")
        .delete()
        .in("id", selectedIds);

      if (err) {
        error("Failed to delete selected products.");
      } else {
        success(`${selectedIds.length} product${selectedIds.length !== 1 ? "s" : ""} deleted successfully.`);
        setSelectedIds([]);
        fetchProducts(search, page, selectedCategory);
      }
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleBulkDuplicate = async () => {
    const confirmed = await confirm({
      title: "Duplicate Selected Products",
      message: `This will create ${selectedIds.length} draft cop${selectedIds.length !== 1 ? "ies" : "y"} of the selected product${selectedIds.length !== 1 ? "s" : ""}. You can edit and publish each one when ready.`,
      confirmLabel: "Yes, Duplicate All",
      cancelLabel: "Cancel",
      variant: "info",
      icon: "duplicate",
    });
    if (!confirmed) return;

    setBulkDuplicating(true);
    let successCount = 0;
    let failCount = 0;

    try {
      const selectedProducts = products.filter((p) => selectedIds.includes(p.id));

      for (const product of selectedProducts) {
        try {
          await duplicateProductCore(product);
          successCount++;
        } catch (err) {
          console.error(err);
          failCount++;
        }
      }

      setSelectedIds([]);
      await fetchProducts(search, 1, selectedCategory);
      setPage(1);

      if (failCount === 0) {
        success(`${successCount} product${successCount !== 1 ? "s" : ""} duplicated as drafts — now at the top of the list.`);
      } else {
        error(`${successCount} duplicated, ${failCount} failed. Please try again for the failed ones.`);
      }
    } finally {
      setBulkDuplicating(false);
    }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  const selectedCategoryName = categories.find(
    (c) => c.id === selectedCategory
  )?.name;

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-x-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">
                Products
              </h1>
              <p className="font-sans text-sm text-gray-500 mt-0.5">
                {total} product{total !== 1 ? "s" : ""}
                {selectedCategoryName ? ` in "${selectedCategoryName}"` : " total"}
              </p>
            </div>
            <Link href="/admin/products/new" className="btn-primary">
              <Plus size={16} />
              Add Product
            </Link>
          </div>

          {/* Search + Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={handleSearchChange}
                className="input-field pl-9 py-2 w-full"
                placeholder="Search products…"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    fetchProducts("", page, selectedCategory);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-sans text-sm font-medium transition-colors
                ${showFilters || selectedCategory
                  ? "border-burgundy-800 bg-burgundy-50 text-burgundy-800"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
            >
              <Filter size={15} />
              Filter by Category
              {selectedCategory && (
                <span className="bg-burgundy-800 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 font-sans text-xs text-gray-500 hover:text-burgundy-800 transition-colors"
              >
                <X size={13} />
                Clear all
              </button>
            )}
          </div>

          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
              <p className="font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Filter by Category
              </p>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`px-3 py-1.5 rounded-full border text-xs font-sans transition-all
                    ${!selectedCategory
                      ? "bg-burgundy-800 border-burgundy-800 text-white"
                      : "border-gray-300 text-gray-600 hover:border-burgundy-300"
                    }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-sans transition-all
                      ${selectedCategory === cat.id
                        ? "bg-burgundy-800 border-burgundy-800 text-white"
                        : "border-gray-300 text-gray-600 hover:border-burgundy-300"
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedCategoryName && (
            <div className="flex items-center gap-2 mb-4">
              <span className="font-sans text-xs text-gray-500">
                Showing:
              </span>
              <span className="flex items-center gap-1.5 bg-burgundy-50 border border-burgundy-200 text-burgundy-800 text-xs font-medium px-3 py-1 rounded-full">
                {selectedCategoryName}
                <button
                  onClick={() => handleCategoryChange("")}
                  className="hover:text-burgundy-900 ml-0.5"
                >
                  <X size={11} />
                </button>
              </span>
            </div>
          )}

          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between bg-burgundy-50 border border-burgundy-200 rounded-xl px-4 py-3 mb-4">
              <span className="font-sans text-sm font-medium text-burgundy-800">
                {selectedIds.length} product{selectedIds.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedIds([])}
                  className="font-sans text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear selection
                </button>
                <button
                  onClick={handleBulkDuplicate}
                  disabled={bulkDuplicating || bulkDeleting}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {bulkDuplicating ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Copy size={14} />
                  )}
                  Duplicate Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting || bulkDuplicating}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {bulkDeleting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full min-w-[750px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={products.length > 0 && selectedIds.length === products.length}
                      onChange={toggleSelectAll}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-burgundy-800 focus:ring-burgundy-800"
                    />
                  </th>
                  {[
                    "Product",
                    "Type",
                    "Price",
                    "Stock",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-sans text-xs text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center"
                    >
                      <p className="font-sans text-sm text-gray-400 mb-2">
                        {hasActiveFilters
                          ? "No products match your filters."
                          : "No products found."}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="font-sans text-xs text-burgundy-800 hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(p.id) ? "bg-burgundy-50/50" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-burgundy-800 focus:ring-burgundy-800"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {p.images?.[0] && (
                              <Image
                                src={p.images[0]}
                                alt={p.name}
                                fill
                                className="object-cover"
                                unoptimized={p.images[0].includes(
                                  "abstitch.com"
                                )}
                                sizes="40px"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/products/${p.id}`}
                              className="font-sans text-sm font-semibold text-gray-800 hover:text-burgundy-800 line-clamp-1"
                            >
                              {p.name}
                            </Link>
                            <p className="font-sans text-[10px] text-gray-400 mt-0.5">
                              /{p.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-sans text-xs capitalize text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {p.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans text-sm text-gray-700">
                        {p.price_range_min && p.price_range_max
                          ? p.price_range_min === p.price_range_max
                            ? formatPrice(p.price_range_min)
                            : `${formatPrice(p.price_range_min)} – ${formatPrice(p.price_range_max)}`
                          : p.regular_price
                          ? formatPrice(p.regular_price)
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-sans text-xs px-2 py-0.5 rounded-full ${
                            p.in_stock
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.in_stock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePublished(p.id, p.published)}
                          className={`flex items-center gap-1 font-sans text-xs px-2 py-0.5 rounded-full transition-colors ${
                            p.published
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {p.published ? (
                            <Eye size={11} />
                          ) : (
                            <EyeOff size={11} />
                          )}
                          {p.published ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="p-1.5 text-gray-400 hover:text-burgundy-800 hover:bg-burgundy-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDuplicate(p)}
                            disabled={duplicating === p.id}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-40"
                            title="Duplicate"
                          >
                            {duplicating === p.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="font-sans text-xs text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-xs font-sans border border-gray-200 rounded hover:border-burgundy-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-xs font-sans border border-gray-200 rounded hover:border-burgundy-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}