"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/components/ui/Toaster";
import { formatPrice, formatPriceRange } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem, removeItem, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const { success } = useToast();

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeItem(product.id);
      success("Removed from wishlist.");
    } else {
      addItem({
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0] || "",
        price: product.price_range_min || product.regular_price || null,
        category: product.category_names?.[0] || "",
      });
      success("Added to wishlist!");
    }
  };

  const price =
    product.price_range_min && product.price_range_max
      ? formatPriceRange(product.price_range_min, product.price_range_max)
      : product.regular_price
      ? formatPrice(product.regular_price)
      : "Price on request";

  const hasSale = !!product.sale_price;
  const mainImage = product.images?.[0] || "/images/placeholder.jpg";

  return (
    <div className="group relative bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized={mainImage.includes("abstitch.com")}
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasSale && (
            <span className="badge-sale text-[10px] px-2 py-0.5">Sale</span>
          )}
          {!product.in_stock && (
            <span className="badge bg-gray-700 text-white text-[10px] px-2 py-0.5">
              Out of Stock
            </span>
          )}
        </div>

        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm transition-all duration-200 z-10
            ${wishlisted
              ? "bg-burgundy-800 text-white"
              : "bg-white text-gray-400 hover:text-burgundy-800"
            }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={14} className={wishlisted ? "fill-white" : ""} />
        </button>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <span
            className="flex items-center gap-2 bg-white text-burgundy-800 text-xs font-semibold px-4 py-2 rounded-full shadow-md"
          >
            <Eye size={14} />
            Quick View
          </span>
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        {product.category_names?.[0] && (
          <p className="font-sans text-[10px] uppercase tracking-widest text-burgundy-700 mb-1 truncate">
            {product.category_names[0]}
          </p>
        )}

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-sans text-sm font-semibold text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-burgundy-800 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-gray-400 ml-0.5">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            {hasSale ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-burgundy-800">
                  {formatPrice(product.sale_price!)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.regular_price)}
                </span>
              </div>
            ) : (
              <span className="text-base font-bold text-gray-800">{price}</span>
            )}
          </div>

          {product.in_stock && (
            <Link
              href={`/product/${product.slug}`}
              className="p-2 bg-burgundy-800 text-white rounded hover:bg-burgundy-900 transition-colors"
              aria-label={`View ${product.name}`}
            >
              <ShoppingCart size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
