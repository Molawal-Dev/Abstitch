import { createServerSupabaseClient } from "./server";
import type { Order, PaginatedResponse } from "@/types";

export async function getOrders(
  page = 1,
  per_page = 20,
  status?: string
): Promise<PaginatedResponse<Order>> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from("orders")
    .select("*, order_items(*)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const from = (page - 1) * per_page;
  query = query.range(from, from + per_page - 1);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: data as Order[],
    total: count || 0,
    page,
    per_page,
    total_pages: Math.ceil((count || 0) / per_page),
  };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Order;
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", orderNumber)
    .single();

  if (error || !data) return null;
  return data as Order;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}
