import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ShieldCheck, HeadphonesIcon, Truck } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import { getSubcategoriesByParentSlug } from "@/lib/supabase/categories";
import DownloadBrochureButton from "@/components/home/DownloadBrochureButton";
import type { Category } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Safety Wear & PPE | Abstitch",
  description:
    "Premium workwear, PPE and safety equipment for businesses across Aberdeen and beyond. Official Portwest partner.",
};

const FALLBACK_CATEGORIES: Pick<Category, "name" | "slug" | "image_url">[] = [
  { name: "Flame Resistant",   slug: "flame-resistant",   image_url: "/portwest/flame-resistant.png" },
  { name: "High Visibility",   slug: "high-visibility",   image_url: "/portwest/high-visibility.jpg" },
  { name: "Workwear",          slug: "workwear",          image_url: "/portwest/workwear.jpg" },
  { name: "Footwear",          slug: "footwear",          image_url: "/portwest/footwear.png" },
  { name: "Hand Protection",   slug: "hand-protection",   image_url: "/portwest/hand-protection.jpg" },
  { name: "Head Protection",   slug: "head-protection",   image_url: "/portwest/head-protection.png" },
  { name: "Eye Protection",    slug: "eye-protection",    image_url: "/portwest/eye-protection.jpg" },
  { name: "Accessories",       slug: "accessories",       image_url: "/portwest/accessories.jpg" },
];

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: "Trusted Quality",
    body: "Durable workwear and PPE from a brand you can trust.",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    body: "Our team are here to help you find the right gear.",
  },
  {
    icon: Truck,
    title: "Fast & Reliable",
    body: "Quick turnarounds and dependable delivery.",
  },
];

function CategoryCard({ category }: { category: Pick<Category, "name" | "slug" | "image_url"> }) {
  return (
    <Link
      href={`/shop/safety-wear/${category.slug}`}
      className="group block bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <ShieldCheck size={40} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="font-sans text-xs font-bold tracking-widest text-gray-800 uppercase text-center">
          {category.name}
        </p>
      </div>
    </Link>
  );
}

export default async function SafetyWearPage() {
  let categories: Pick<Category, "name" | "slug" | "image_url">[] = [];

  try {
    const live = await getSubcategoriesByParentSlug("safety-wear");
    if (live.length > 0) {
      categories = FALLBACK_CATEGORIES.map((fb) => {
        const match = live.find((l) => l.slug === fb.slug);
        return {
          ...fb,
          ...match,
          image_url: match?.image_url || fb.image_url,
        };
      });
    } else {
      categories = FALLBACK_CATEGORIES;
    }
  } catch {
    categories = FALLBACK_CATEGORIES;
  }

  return (
    <SiteLayout>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
        <div className="container-custom">
          <div className="flex items-start justify-between gap-4">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-white/60 font-sans mb-4">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <ChevronRight size={12} />
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop
                </Link>
                <ChevronRight size={12} />
                <span className="text-white/90">Safety Wear & PPE</span>
              </nav>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">
                Premium Workwear &amp; PPE
              </h1>
              <p className="font-sans text-white/70 text-sm mt-2 max-w-lg">
                Quality, safety and performance you can rely on. Explore our
                range of Portwest workwear and PPE for every job.
              </p>
            </div>

            {/* Portwest logo card */}
            <div className="hidden md:flex flex-col items-end flex-shrink-0 mt-1">
              <div className="bg-white rounded-lg px-4 py-2.5 flex flex-col items-center gap-1">
                <Image
                  src="/home-banners/portwest-logo.png"
                  alt="Portwest"
                  width={110}
                  height={34}
                  style={{ objectFit: "contain" }}
                />
                <p className="font-sans text-[9px] font-semibold tracking-widest uppercase text-gray-500">
                  Official Portwest Partner
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 mt-4">
        <div className="container-custom py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TRUST_BADGES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-slate-700 flex items-center justify-center">
                  <Icon size={18} className="text-slate-700" />
                </div>
                <div>
                  <p className="font-sans font-bold text-sm text-gray-900">{title}</p>
                  <p className="font-sans text-xs text-gray-500 mt-0.5 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DownloadBrochureButton />
    </SiteLayout>
  );
}