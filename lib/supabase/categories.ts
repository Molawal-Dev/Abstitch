import { supabase } from "./client";
import type { Category } from "@/types";

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as Category[];
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return data as Category;
}

export async function getCategoryTree(): Promise<Category[]> {
  const all = await getAllCategories();
  return all.filter((c) => !c.parent_id);
}

export async function getSchoolCategories(): Promise<Category[]> {
  const { data: parent } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", "school-wear")
    .single();

  if (!parent) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parent.id)
    .order("name");

  if (error) return [];
  return data as Category[];
}
