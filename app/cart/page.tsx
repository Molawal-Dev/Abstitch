"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Trash2, ShoppingBag, ArrowRight, Truck, Store } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useConfirm } from "@/components/ui/ConfirmModal";
import { formatPrice, DELIVERY_COST } from "@/lib/utils";
import SiteLayout from "@/components/layout/SiteLayout";

type FulfilmentMethod = "delivery" | "collection";

export default function CartPage() {
  const { cart, removeItem, updateQty } = useCart();
  const confirm = useConfirm();
  const [fulfilment, setFulfilment] = useState<FulfilmentMethod>("collection");

  const deliveryFee = fulfilment === "delivery" ? DELIVERY_COST : 0;
  const orderTotal = cart.total + deliveryFee;

  return (
    <SiteLayout>
      <div className="container-custom py-10 md:py-14">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="font-serif text-xl font-bold text-gray-400 mb-2">Your cart is empty</h2>
            <p className="font-sans text-sm text-gray-400 mb-6">
              Browse our school wear and garments to get started.
            </p>
            <Link href="/shop/school-wear" className="btn-primary">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const key = `${item.product_id}-${item.variant_id}`;
                return (
                  <div key={key} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
                    <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50">
                        <Image
                          src={item.image || "/images/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized={item.image?.includes("abstitch.com")}
                          sizes="80px"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="font-sans text-sm font-semibold text-gray-800 hover:text-burgundy-800 transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.color && (
                          <span className="font-sans text-xs text-gray-500 capitalize">
                            Colour: {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="font-sans text-xs text-gray-500">
                            Size: {item.size}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Qty */}
                        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                          <button
                            onClick={() => updateQty(item.product_id, item.variant_id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center font-sans text-sm border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.product_id, item.variant_id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-sans text-sm font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={async () => {
                              const confirmed = await confirm({
                                title: "Remove Item",
                                message: `Remove "${item.name}" from your cart?`,
                                confirmLabel: "Remove",
                                cancelLabel: "Keep",
                                variant: "danger",
                                icon: "delete",
                              });
                              if (confirmed) removeItem(item.product_id, item.variant_id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
                <h2 className="font-serif text-lg font-bold text-gray-900 mb-5">
                  Order Summary
                </h2>

                {/* Fulfilment toggle */}
                <div className="mb-5">
                  <p className="font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    How would you like to receive your order?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFulfilment("collection")}
                      className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 text-center transition-all ${
                        fulfilment === "collection"
                          ? "border-burgundy-800 bg-burgundy-50 text-burgundy-800"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <Store size={18} />
                      <span className="font-sans text-xs font-semibold">In-Store Collection</span>
                      <span className="font-sans text-[10px] text-gray-400">Free</span>
                    </button>
                    <button
                      onClick={() => setFulfilment("delivery")}
                      className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 text-center transition-all ${
                        fulfilment === "delivery"
                          ? "border-burgundy-800 bg-burgundy-50 text-burgundy-800"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <Truck size={18} />
                      <span className="font-sans text-xs font-semibold">Delivery</span>
                      <span className="font-sans text-[10px] text-gray-400">{formatPrice(DELIVERY_COST)}</span>
                    </button>
                  </div>
                  {fulfilment === "collection" && (
                    <p className="font-sans text-xs text-gray-400 mt-2 text-center">
                      Collect from our Aberdeen store — we'll notify you when ready.
                    </p>
                  )}
                  {fulfilment === "delivery" && (
                    <p className="font-sans text-xs text-gray-400 mt-2 text-center">
                      Delivered to your address within 3–5 working days.
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-5 border-t border-gray-100 pt-4">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-gray-600">Subtotal ({cart.item_count} items)</span>
                    <span className="font-medium">{formatPrice(cart.total)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className={`font-medium ${deliveryFee === 0 ? "text-emerald-600" : ""}`}>
                      {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between font-sans font-bold">
                    <span>Total</span>
                    <span className="text-burgundy-800 text-lg">
                      {formatPrice(orderTotal)}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/checkout?fulfilment=${fulfilment}`}
                  className="btn-primary w-full justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/shop/school-wear"
                  className="block text-center font-sans text-sm text-gray-500 hover:text-burgundy-800 transition-colors mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
