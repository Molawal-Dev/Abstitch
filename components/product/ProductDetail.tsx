"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  ChevronRight,
  Check,
  AlertTriangle,
  Clock,
  MessageCircle,
  Truck,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/Toaster";
import { formatPrice } from "@/lib/utils";
import ColorSwatchSelector from "./ColorSwatchSelector";
import SizeSelector from "./SizeSelector";
import SizeGuideModal from "./SizeGuideModal";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product;
}

function normaliseRichHtml(html: string): string {
  if (!html) return "";
  let out = html.replace(/&nbsp;/g, " ").replace(/ {2,}/g, " ");

  out = out.replace(
    /<p[^>]*>\s*[-•]\s*([\s\S]*?)<\/p>/gi,
    (_match: string, content: string) =>
      `<li>${content.trim()}</li>`
  );

  out = out.replace(
    /(<li>[\s\S]*?<\/li>(\s*<li>[\s\S]*?<\/li>)*)/gi,
    "<ul>$1</ul>"
  );

  return out;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const { success, error } = useToast();

  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors?.[0]?.name || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "additional" | "delivery"
  >("additional");
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  console.log(product);

  const displayImages = useMemo(() => {
    if (selectedColor && product.colors?.length) {
      const swatch = product.colors.find((c) => c.name === selectedColor);
      if (swatch?.images?.length) return swatch.images;
    }
    return product.images?.length ? product.images : [];
  }, [selectedColor, product.colors, product.images]);

  const activeVariant = useMemo(() => {
    if (!product.variants?.length) return null;
    return (
      product.variants.find(
        (v) =>
          (!selectedColor || v.color === selectedColor) &&
          (!selectedSize || v.size === selectedSize)
      ) || product.variants[0]
    );
  }, [product.variants, selectedColor, selectedSize]);

  const displayPrice = activeVariant?.price ?? product.regular_price;
  const displaySalePrice = activeVariant?.sale_price ?? product.sale_price;

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setActiveImageIdx(0);
  };

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      error("Please select a size before adding to cart.");
      return;
    }
    addItem({
      product_id: product.id,
      variant_id: activeVariant?.id || null,
      name: product.name,
      slug: product.slug,
      image: displayImages[0] || "",
      color: selectedColor,
      size: selectedSize,
      price: displaySalePrice ?? displayPrice ?? 0,
      quantity: selectedQty,
    });
    setAddedToCart(true);
    success(`${product.name} added to cart!`);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const hasPriceRange =
  product.price_range_min !== null &&
  product.price_range_max !== null &&
  product.price_range_min !== product.price_range_max;

  const selectedSizeVariant = selectedSize
    ? product.variants?.find(
        (v) =>
          v.size === selectedSize &&
          (!selectedColor || v.color === selectedColor)
      )
    : null;

  const mainImage = displayImages[activeImageIdx] || null;

  const hasSizeGuide = !!product.size_guide;

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-sans mb-8 flex-wrap">
        <Link href="/" className="hover:text-burgundy-800 transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href="/shop/school-wear"
          className="hover:text-burgundy-800 transition-colors"
        >
          Shop
        </Link>
        {product.category_names?.[0] && (
          <>
            <ChevronRight size={12} />
            <span className="text-gray-700">{product.category_names[0]}</span>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-gray-900 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={`${product.name}${selectedColor ? ` — ${selectedColor}` : ""}`}
                fill
                className="object-cover"
                priority
                unoptimized={mainImage.includes("abstitch.com")}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="font-sans text-sm text-gray-400">
                  No image available
                </p>
              </div>
            )}
            {displaySalePrice && (
              <span className="absolute top-4 left-4 badge-sale">Sale</span>
            )}
          </div>

          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all
                    ${
                      i === activeImageIdx
                        ? "border-burgundy-800"
                        : "border-transparent hover:border-gray-300"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={img.includes("abstitch.com")}
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category_names?.[0] && (
            <p className="font-sans text-xs uppercase tracking-widest text-burgundy-700 mb-2">
              {product.category_names[0]}
            </p>
          )}

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          <div className="mb-5">
            {displaySalePrice ? (
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-burgundy-800">
                  {formatPrice(displaySalePrice)}
                </span>
                <span className="font-sans text-lg  text-gray-400 line-through">
                  {formatPrice(displayPrice ?? 0)}
                </span>
              </div>
            ) : displayPrice ? (
              <span className="font-serif text-3xl font-bold text-burgundy-800">
                {product.price_range_min &&
                product.price_range_max &&
                product.price_range_min !== product.price_range_max
                  ? `${formatPrice(product.price_range_min)} – ${formatPrice(product.price_range_max)}`
                  : formatPrice(displayPrice)}
              </span>
            ) : (
              <span className="font-sans text-base text-gray-500 italic">
                Price on request
              </span>
            )}
          </div>

          {product.short_description && (
            <div
              className="rich-content font-sans text-gray-600 text-sm leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: normaliseRichHtml(product.short_description) }}
            />
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mb-5">
              <ColorSwatchSelector
                colors={product.colors}
                selected={selectedColor}
                onChange={handleColorChange}
              />
            </div>
          )}

          <div className="mb-5">
            {product.sizes && product.sizes.length > 0 && (
              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onChange={setSelectedSize}
              />
            )}
            {hasSizeGuide && (
              <div className="mt-2">
                <SizeGuideModal
                  sizeGuide={product.size_guide!}
                  description={product.description || ""}
                />
              </div>
            )}
            {selectedSize && hasPriceRange && selectedSizeVariant && (
              <p className="font-sans text-md text-burgundy-800 font-semibold mt-3">
                {selectedSizeVariant.sale_price
                  ? <>
                      <span>{formatPrice(selectedSizeVariant.sale_price)}</span>
                      <span className="line-through text-gray-400 font-normal ml-2">
                        {formatPrice(selectedSizeVariant.price)}
                      </span>
                    </>
                  : formatPrice(selectedSizeVariant.price)
                }
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mb-5">
            {product.in_stock ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="font-sans text-sm text-emerald-700 font-medium">
                  In Stock
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={14} className="text-amber-600" />
                <span className="font-sans text-sm text-amber-700 font-medium">
                  Out of Stock — Contact us to order
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                className="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition-colors text-lg"
              >
                −
              </button>
              <span className="w-10 h-11 flex items-center justify-center font-sans text-sm font-semibold border-x border-gray-300">
                {selectedQty}
              </span>
              <button
                onClick={() => setSelectedQty(selectedQty + 1)}
                className="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition-colors text-lg"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-md font-sans font-semibold text-sm tracking-wide uppercase transition-all duration-200
                ${
                  addedToCart
                    ? "bg-emerald-600 text-white"
                    : product.in_stock
                    ? "bg-burgundy-800 hover:bg-burgundy-900 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {addedToCart ? (
                <>
                  <Check size={16} />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  {product.in_stock ? "Add to Cart" : "Out of Stock"}
                </>
              )}
            </button>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-3 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock size={15} className="text-burgundy-800" />
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-gray-800">
                  Ready within two weeks
                </p>
                <p className="font-sans text-xs text-gray-500 mt-0.5">
                  This item will be prepared and ready within two weeks of your order.
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageCircle size={15} className="text-burgundy-800" />
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-gray-800">
                  Need more information?
                </p>
                <p className="font-sans text-xs text-gray-500 mt-0.5">
                  <Link
                    href="/contact"
                    className="text-burgundy-800 hover:underline font-medium"
                  >
                    Contact us
                  </Link>{" "}
                  for more info about our products, embroidery, or bulk orders.
                </p>
              </div>
            </div>
          </div>

          <p className="font-sans text-sm text-gray-500 mb-8">
            Need embroidery or bulk order?{" "}
            <Link
              href="/contact#order"
              className="text-burgundy-800 hover:underline font-medium"
            >
              Place an enquiry
            </Link>
          </p>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
              {(
                [
                  { key: "additional", label: "Additional Info" },
                  { key: "delivery", label: "Delivery" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 font-sans text-sm font-medium border-b-2 transition-all whitespace-nowrap
                    ${
                      activeTab === tab.key
                        ? "border-burgundy-800 text-burgundy-800"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-5">
              {activeTab === "additional" && (
                <div className="space-y-3 font-sans text-sm text-gray-600">
                  <p>
                    All Abstitch garments are made to the highest quality
                    standards using durable fabrics suited for everyday school
                    wear.
                  </p>
                  {product.colors && product.colors.length > 0 && (
                    <p>
                      <strong className="text-gray-800">
                        Available Colours:{" "}
                      </strong>
                      {product.colors.map((c) => c.name).join(", ")}
                    </p>
                  )}
                  {product.sizes && product.sizes.length > 0 && (
                    <p>
                      <strong className="text-gray-800">
                        Available Sizes:{" "}
                      </strong>
                      {product.sizes.join(", ")}
                    </p>
                  )}
                  <p>
                    Embroidery and printing services are available for all
                    garments. Contact us for personalisation options.
                  </p>
                </div>
              )}

              {activeTab === "delivery" && (
                <div className="space-y-5 font-sans text-sm">
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-burgundy-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Truck size={17} className="text-burgundy-800" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">
                        Standard Delivery (Aberdeen)
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        Delivery takes{" "}
                        <strong className="text-gray-800">2 weeks</strong> from
                        the time your order is processed.
                      </p>
                      <p className="text-gray-600 mt-1">
                        Standard delivery cost:{" "}
                        <strong className="text-gray-800">£10</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin size={17} className="text-emerald-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">
                        Click &amp; Collect{" "}
                        <span className="text-emerald-700 font-bold">
                          (Free)
                        </span>
                      </p>
                      <p className="text-gray-600 leading-relaxed mb-2">
                        You can collect your order from our shop:
                      </p>
                      <address className="not-italic text-gray-700 font-medium leading-relaxed">
                        Abstitch
                        <br />
                        35 Ann Street
                        <br />
                        Aberdeen AB25 3LH
                      </address>
                      <p className="text-gray-500 text-xs mt-2">
                        We&apos;ll email you once your order is ready.
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        <strong className="text-gray-700">
                          Collection hours:
                        </strong>{" "}
                        Monday–Friday, 9am–5pm.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle size={17} className="text-amber-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">
                        Peak Season (June–September)
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        School uniform orders during the busy season may take
                        longer due to high demand.
                      </p>
                      <p className="text-gray-600 mt-1 font-medium">
                        We recommend ordering early to avoid delays.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}