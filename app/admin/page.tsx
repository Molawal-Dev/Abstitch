import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ShoppingBag, Package, TrendingUp, Clock } from "lucide-react";

async function getStats() {
  try {
    const supabase = createServerSupabaseClient();
    const [{ count: orderCount }, { count: productCount }, { data: recentOrders }] =
      await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("published", true),
        supabase
          .from("orders")
          .select("id, order_number, customer_name, total, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
    return { orderCount: orderCount || 0, productCount: productCount || 0, recentOrders: recentOrders || [] };
  } catch {
    return { orderCount: 0, productCount: 0, recentOrders: [] };
  }
}

export default async function AdminDashboardPage() {
  const { orderCount, productCount, recentOrders } = await getStats();

  const stats = [
    { label: "Total Orders", value: orderCount, icon: <ShoppingBag size={20} />, color: "bg-blue-50 text-blue-700" },
    { label: "Active Products", value: productCount, icon: <Package size={20} />, color: "bg-emerald-50 text-emerald-700" },
    { label: "Processing", value: recentOrders.filter((o: {status: string}) => o.status === "processing").length, icon: <Clock size={20} />, color: "bg-amber-50 text-amber-700" },
    { label: "Completed", value: recentOrders.filter((o: {status: string}) => o.status === "completed").length, icon: <TrendingUp size={20} />, color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="font-sans text-sm text-gray-500 mt-1">Welcome back to the Abstitch admin panel.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                  {s.icon}
                </div>
                <p className="font-serif text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="font-sans text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-gray-900">Recent Orders</h2>
              <a href="/admin/orders" className="font-sans text-xs text-burgundy-800 hover:underline">View all</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Order #", "Customer", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left font-sans text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center font-sans text-sm text-gray-400">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order: {
                      id: string;
                      order_number: string;
                      customer_name: string;
                      total: number;
                      status: string;
                      created_at: string;
                    }) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 font-sans text-sm font-medium text-burgundy-800">
                          <a href={`/admin/orders/${order.id}`}>{order.order_number}</a>
                        </td>
                        <td className="px-5 py-3 font-sans text-sm text-gray-700">{order.customer_name}</td>
                        <td className="px-5 py-3 font-sans text-sm text-gray-700">£{Number(order.total).toFixed(2)}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-3 font-sans text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
