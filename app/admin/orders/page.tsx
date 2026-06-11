"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toaster";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { supabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Search } from "lucide-react";

type OrderStatus = "all" | "pending" | "processing" | "completed" | "cancelled" | "refunded";

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  created_at: string;
  shipping_address: { postcode?: string; city?: string };
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-600",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const { success, error } = useToast();
  const PER_PAGE = 20;

  useEffect(() => {
    fetchOrders();
  }, [status, page]);

  async function fetchOrders() {
    setLoading(true);
    try {
      let query = supabase
        .from("orders")
        .select("id, order_number, customer_name, customer_email, total, status, created_at, shipping_address", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);

      if (status !== "all") query = query.eq("status", status);
      if (search) query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,order_number.ilike.%${search}%`);

      const { data, count, error } = await query;
      if (!error) {
        setOrders(data as OrderRow[]);
        setTotal(count || 0);
      }
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const { error: err } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);
    if (err) {
      error("Failed to update order status.");
    } else {
      success(`Order status updated to ${newStatus}.`);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-x-auto">
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-bold text-gray-900">Orders</h1>
            <p className="font-sans text-sm text-gray-500 mt-0.5">{total} orders total</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-5">
            {/* Status tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setStatus(opt.value); setPage(1); }}
                  className={`px-3 py-1.5 rounded-md font-sans text-xs font-medium whitespace-nowrap transition-colors
                    ${status === opt.value ? "bg-white shadow text-burgundy-800" : "text-gray-600 hover:text-gray-800"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
                className="input-field pl-8 py-1.5 text-sm"
                placeholder="Search orders…"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  {["Order", "Customer", "Location", "Total", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-sans text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center font-sans text-sm text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="font-sans text-sm font-semibold text-burgundy-800 hover:underline">
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-sans text-sm text-gray-800">{order.customer_name}</p>
                        <p className="font-sans text-xs text-gray-400">{order.customer_email}</p>
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-gray-500">
                        {order.shipping_address?.city}, {order.shipping_address?.postcode}
                      </td>
                      <td className="px-4 py-3 font-sans text-sm font-semibold text-gray-800">
                        {formatPrice(Number(order.total))}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-1 focus:ring-burgundy-300 cursor-pointer ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}
                        >
                          {["pending", "processing", "completed", "cancelled", "refunded"].map((s) => (
                            <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="font-sans text-xs text-burgundy-800 hover:underline font-medium">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="font-sans text-xs text-gray-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-xs border border-gray-200 rounded hover:border-burgundy-300 disabled:opacity-40">Prev</button>
                  <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 text-xs border border-gray-200 rounded hover:border-burgundy-300 disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}
