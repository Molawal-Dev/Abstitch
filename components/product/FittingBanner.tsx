import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { FittingBannerConfig } from "@/lib/fittingBanners";

export default function FittingBanner({
  banner,
}: {
  banner: FittingBannerConfig;
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-100 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <MapPin size={15} className="text-burgundy-800" />
        </div>
        <div>
          <p className="font-sans text-sm font-semibold text-gray-800">
            {banner.title}
          </p>
          <p className="font-sans text-xs text-gray-500 mt-0.5">
            {banner.description}
          </p>
          <Link
            href={banner.href}
            className="inline-flex items-center gap-1.5 mt-2.5 font-sans text-xs font-semibold text-burgundy-800 hover:text-burgundy-900 transition-colors"
          >
            {banner.buttonLabel}
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}