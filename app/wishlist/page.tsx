"use client";

import { useWishlist } from "@/hooks/useWishlist";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addItem({
      product_id: item.product_id,
      variant_id: null,
      name: item.name,
      slug: item.slug,
      image: item.image,
      color: null,
      size: null,
      price: item.price || 0,
      quantity: 1,
    });
    removeItem(item.product_id);
  };

  return (
    <SiteLayout>
      <div className="container-custom py-10 md:py-14 max-w-4xl">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          My Wishlist
        </h1>
        <p className="font-sans text-sm text-gray-500 mb-8">
          {items.length} saved item{items.length !== 1 ? "s" : ""}
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="font-serif text-xl font-bold text-gray-400 mb-2">
              Your wishlist is empty
            </h2>
            <p className="font-sans text-sm text-gray-400 mb-6">
              Save items you love and come back to them later.
            </p>
            <Link href="/shop/school-wear" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="flex-shrink-0"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50">
                    <Image
                      src={item.image || "/images/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized={item.image?.includes("abstitch.com")}
                      sizes="96px"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs text-burgundy-700 uppercase tracking-wider mb-1">
                    {item.category}
                  </p>
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-sans text-sm font-semibold text-gray-800 hover:text-burgundy-800 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="font-sans text-sm font-bold text-gray-900 mt-1">
                    {item.price ? formatPrice(item.price) : "Price on request"}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex items-center gap-1.5 text-xs font-sans font-semibold text-burgundy-800 hover:text-burgundy-900 transition-colors"
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>
                    <span className="text-gray-200">|</span>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="flex items-center gap-1.5 text-xs font-sans text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 flex gap-3">
              <Link href="/shop/school-wear" className="btn-outline">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}