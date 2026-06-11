"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Check, ChevronRight } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { supabase } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { useToast } from "@/components/ui/Toaster";
import { useConfirm } from "@/components/ui/ConfirmModal";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

interface FormState {
  name: string;
  slug: string;
  parent_id: string;
}

const EMPTY_FORM: FormState = { name: "", slug: "", parent_id: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { success, error } = useToast();
  const confirm = useConfirm();

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug, parent_id")
      .order("name");
    setCategories((data as CategoryRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const getName = (id: string | null) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  const topLevel = categories.filter((c) => c.parent_id === null);

  const secondLevel = categories.filter((c) =>
    topLevel.some((t) => t.id === c.parent_id)
  );
  
  const parentOptions = [...topLevel, ...secondLevel];

  const handleNameChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: editingId ? prev.slug : slugify(val),
    }));
  };

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (cat: CategoryRow) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, parent_id: cat.parent_id ?? "" });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      error("Category name is required.");
      return;
    }
    if (!form.slug.trim()) {
      error("Slug is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        parent_id: form.parent_id || null,
      };

      if (editingId) {
        const { error: err } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", editingId);
        if (err) throw err;
        success("Category updated.");
      } else {
        const { error: err } = await supabase
          .from("categories")
          .insert(payload);
        if (err) throw err;
        success("Category created.");
      }

      cancelForm();
      fetchCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("duplicate") || msg.includes("unique")) {
        error("A category with this slug already exists.");
      } else {
        error("Failed to save category. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: CategoryRow) => {
    const children = categories.filter((c) => c.parent_id === cat.id);

    const confirmed = await confirm({
      title: "Delete Category",
      message: children.length
        ? `"${cat.name}" has ${children.length} sub-categor${children.length === 1 ? "y" : "ies"}. Deleting it will leave those sub-categories without a parent. Are you sure?`
        : `Are you sure you want to delete "${cat.name}"? This cannot be undone.`,
      confirmLabel: "Yes, Delete",
      cancelLabel: "Cancel",
      variant: "danger",
      icon: "delete",
    });
    if (!confirmed) return;

    const { error: err } = await supabase
      .from("categories")
      .delete()
      .eq("id", cat.id);

    if (err) {
      error("Failed to delete category.");
    } else {
      success(`"${cat.name}" deleted.`);
      fetchCategories();
    }
  };

  const roots = categories.filter((c) => c.parent_id === null);
  const childrenOf = (id: string) =>
    categories.filter((c) => c.parent_id === id);

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-x-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">
                Categories
              </h1>
              <p className="font-sans text-sm text-gray-500 mt-0.5">
                {categories.length} categor{categories.length !== 1 ? "ies" : "y"} total
              </p>
            </div>
            {!showForm && (
              <button onClick={openNew} className="btn-primary">
                <Plus size={16} />
                Add Category
              </button>
            )}
          </div>

          {/* ── Form ── */}
          {showForm && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
              <h2 className="font-serif text-base font-bold text-gray-900 mb-4">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Hazlehead Academy"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="label">Slug *</label>
                  <input
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="input-field font-mono text-sm"
                    placeholder="e.g. hazlehead-academy"
                  />
                  <p className="font-sans text-[10px] text-gray-400 mt-1">
                    Auto-generated from name. Must be unique.
                  </p>
                </div>
              </div>
              <div className="mb-5">
                <label className="label">Parent Category</label>
                <div className="flex flex-wrap gap-2 mt-1">
                    <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, parent_id: "" }))}
                        className={`px-3 py-1.5 rounded-full border text-xs font-sans transition-all
                        ${form.parent_id === ""
                            ? "bg-burgundy-800 border-burgundy-800 text-white font-semibold"
                            : "border-gray-300 text-gray-600 hover:border-burgundy-300"
                        }`}
                    >
                        None (top level)
                    </button>
                    {parentOptions.map((cat) => {
                        const isChild = topLevel.some((t) => t.id === cat.parent_id);
                        return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, parent_id: cat.id }))}
                            className={`px-3 py-1.5 rounded-full border text-xs font-sans transition-all
                            ${form.parent_id === cat.id
                                ? "bg-burgundy-800 border-burgundy-800 text-white font-semibold"
                                : "border-gray-300 text-gray-600 hover:border-burgundy-300"
                            } ${isChild ? "pl-5" : ""}`}
                        >
                            {isChild ? `↳ ${cat.name}` : cat.name}
                        </button>
                        );
                    })}
                </div>
                <p className="font-sans text-[10px] text-gray-400 mt-1">
                  e.g. set to "Academy Schools" to make this a school under that group.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
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
                      <Check size={15} />
                      {editingId ? "Save Changes" : "Create Category"}
                    </>
                  )}
                </button>
                <button onClick={cancelForm} className="btn-outline">
                  <X size={15} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── Category tree table ── */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full min-w-[550px]">
              <thead className="bg-gray-50">
                <tr>
                  {["Category", "Slug", "Parent", "Actions"].map((h) => (
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
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <p className="font-sans text-sm text-gray-400">
                        No categories yet.
                      </p>
                    </td>
                  </tr>
                ) : (
                  roots.map((root) => (
                    <>
                      {/* Root row */}
                      <tr
                        key={root.id}
                        className="bg-gray-50/60 hover:bg-gray-100/60 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-sans text-sm font-bold text-gray-800">
                            {root.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                          {root.slug}
                        </td>
                        <td className="px-4 py-3 font-sans text-xs text-gray-400">
                          —
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(root)}
                              className="p-1.5 text-gray-400 hover:text-burgundy-800 hover:bg-burgundy-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(root)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Children rows */}
                      {childrenOf(root.id).map((child) => (
                        <>
                          <tr
                            key={child.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <span className="flex items-center gap-1.5 font-sans text-sm text-gray-700 pl-4">
                                <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
                                {child.name}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">
                              {child.slug}
                            </td>
                            <td className="px-4 py-3 font-sans text-xs text-gray-500">
                              {getName(child.parent_id)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => openEdit(child)}
                                  className="p-1.5 text-gray-400 hover:text-burgundy-800 hover:bg-burgundy-50 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(child)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {childrenOf(child.id).map((grand) => (
                            <tr
                              key={grand.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <span className="flex items-center gap-1.5 font-sans text-sm text-gray-500 pl-10">
                                  <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
                                  {grand.name}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono text-xs text-gray-500">
                                {grand.slug}
                              </td>
                              <td className="px-4 py-3 font-sans text-xs text-gray-500">
                                {getName(grand.parent_id)}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => openEdit(grand)}
                                    className="p-1.5 text-gray-400 hover:text-burgundy-800 hover:bg-burgundy-50 rounded transition-colors"
                                    title="Edit"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(grand)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}