import Image from "next/image";
import { formatPrice, calculateShipping, SHIPPING_THRESHOLD } from "@/lib/utils";
import type { Cart } from "@/types";

export default function OrderSummary({ cart }: { cart: Cart }) {
  const shipping = calculateShipping(cart.total);
  const total = cart.total + shipping;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
      <h2 className="font-serif text-lg font-bold text-gray-900 mb-5">
        Order Summary
      </h2>

      <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
        {cart.items.map((item) => (
          <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-3">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
              <Image
                src={item.image || "/images/placeholder.jpg"}
                alt={item.name}
                fill
                className="object-cover"
                unoptimized={item.image?.includes("abstitch.com")}
                sizes="56px"
              />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-burgundy-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                {item.name}
              </p>
              <div className="flex gap-2 mt-0.5">
                {item.color && <span className="text-[10px] text-gray-400 capitalize">{item.color}</span>}
                {item.size && <span className="text-[10px] text-gray-400">{item.size}</span>}
              </div>
              <p className="font-sans text-xs font-bold text-gray-900 mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between font-sans text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(cart.total)}</span>
        </div>
        <div className="flex justify-between font-sans text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        {cart.total < SHIPPING_THRESHOLD && (
          <p className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded font-sans">
            Add {formatPrice(SHIPPING_THRESHOLD - cart.total)} more for free shipping
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 mt-4 pt-4">
        <div className="flex justify-between font-sans font-bold">
          <span>Total</span>
          <span className="text-burgundy-800 text-lg">{formatPrice(total)}</span>
        </div>
        <p className="font-sans text-[10px] text-gray-400 mt-1">Incl. VAT where applicable</p>
      </div>
    </div>
  );
}
