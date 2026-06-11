"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { supabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { ChevronLeft, Package, User, MapPin, CreditCard } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-600",
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .single();
      setOrder(data);
      setLoading(false);
    }
    if (id) fetch();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    setSaving(true);
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    setOrder((prev: typeof order) => ({ ...prev, status: newStatus }));
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminAuthGuard>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-burgundy-800 border-t-transparent rounded-full animate-spin" />
          </main>
        </div>
      </AdminAuthGuard>
    );
  }

  if (!order) {
    return (
      <AdminAuthGuard>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <p className="font-sans text-gray-500">Order not found.</p>
          </main>
        </div>
      </AdminAuthGuard>
    );
  }

  const addr = order.shipping_address;

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 max-w-5xl overflow-x-auto">
          <Link href="/admin/orders" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-burgundy-800 font-sans mb-4 transition-colors">
            <ChevronLeft size={15} />
            Back to Orders
          </Link>

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">
                Order {order.order_number}
              </h1>
              <p className="font-sans text-sm text-gray-500 mt-0.5">
                Placed {new Date(order.created_at).toLocaleString("en-GB")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={saving}
                className={`text-sm font-semibold px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-burgundy-300 cursor-pointer capitalize ${STATUS_COLORS[order.status] || "bg-gray-100"}`}
              >
                {["pending", "processing", "completed", "cancelled", "refunded"].map((s) => (
                  <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order items */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
                  <Package size={16} className="text-burgundy-800" />
                  <h2 className="font-serif font-bold text-gray-900">Order Items</h2>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Product", "Qty", "Unit Price", "Subtotal"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left font-sans text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(order.order_items || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-6 text-center font-sans text-sm text-gray-400">
                          No items recorded (order placed via webhook — see Stripe dashboard for full details)
                        </td>
                      </tr>
                    ) : (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      order.order_items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-5 py-3">
                            <p className="font-sans text-sm font-medium text-gray-800">{item.product_name}</p>
                            <div className="flex gap-3 mt-0.5">
                              {item.color && <span className="font-sans text-xs text-gray-400">Colour: {item.color}</span>}
                              {item.size && <span className="font-sans text-xs text-gray-400">Size: {item.size}</span>}
                            </div>
                          </td>
                          <td className="px-5 py-3 font-sans text-sm text-gray-700">{item.quantity}</td>
                          <td className="px-5 py-3 font-sans text-sm text-gray-700">{formatPrice(Number(item.price))}</td>
                          <td className="px-5 py-3 font-sans text-sm font-semibold text-gray-800">{formatPrice(Number(item.subtotal))}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-5 py-3 text-right font-sans text-sm text-gray-600">Subtotal</td>
                      <td className="px-5 py-3 font-sans text-sm">{formatPrice(Number(order.subtotal))}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-5 py-2 text-right font-sans text-sm text-gray-600">Shipping</td>
                      <td className="px-5 py-2 font-sans text-sm">{order.shipping === 0 ? "Free" : formatPrice(Number(order.shipping))}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-5 py-3 text-right font-sans font-bold text-gray-900">Total</td>
                      <td className="px-5 py-3 font-sans font-bold text-burgundy-800 text-base">{formatPrice(Number(order.total))}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="font-sans text-xs font-semibold text-amber-800 mb-1 uppercase tracking-wide">Order Notes / Items</p>
                  <p className="font-sans text-sm text-amber-900">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-5">
              {/* Customer */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <User size={15} className="text-burgundy-800" />
                  <h3 className="font-serif font-bold text-gray-900">Customer</h3>
                </div>
                <p className="font-sans text-sm font-semibold text-gray-800">{order.customer_name}</p>
                <a href={`mailto:${order.customer_email}`} className="font-sans text-sm text-burgundy-800 hover:underline block mt-0.5">
                  {order.customer_email}
                </a>
                {addr?.phone && (
                  <a href={`tel:${addr.phone}`} className="font-sans text-sm text-gray-600 block mt-0.5">
                    {addr.phone}
                  </a>
                )}
              </div>

              {/* Shipping address */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={15} className="text-burgundy-800" />
                  <h3 className="font-serif font-bold text-gray-900">Shipping Address</h3>
                </div>
                <address className="font-sans text-sm text-gray-700 not-italic leading-relaxed">
                  {addr.first_name} {addr.last_name}<br />
                  {addr.address_line_1}<br />
                  {addr.address_line_2 && <>{addr.address_line_2}<br /></>}
                  {addr.city}{addr.county ? `, ${addr.county}` : ""}<br />
                  {addr.postcode}<br />
                  {addr.country}
                </address>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={15} className="text-burgundy-800" />
                  <h3 className="font-serif font-bold text-gray-900">Payment</h3>
                </div>
                {order.stripe_payment_intent_id ? (
                  <div>
                    <p className="font-sans text-xs text-gray-500">Stripe Payment Intent</p>
                    <a
                      href={`https://dashboard.stripe.com/payments/${order.stripe_payment_intent_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-burgundy-800 hover:underline break-all"
                    >
                      {order.stripe_payment_intent_id}
                    </a>
                  </div>
                ) : (
                  <p className="font-sans text-sm text-gray-400">No payment record</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}
