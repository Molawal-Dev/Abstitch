import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import { ChevronRight, Wrench, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Alterations & Repair | Abstitch Aberdeen",
  description: "Expert garment alterations and repairs in Aberdeen. Hemming, resizing, zip replacement, and more.",
};

export default function AlterationsPage() {
  return (
    <SiteLayout>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-14">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-white/60 font-sans mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white/90">Alterations &amp; Repair</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
              <Wrench size={28} className="text-white" />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold">Alterations &amp; Repair</h1>
              <p className="font-sans text-white/70 mt-1">Tailoring and repair done with care</p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Expert Tailoring &amp; Repairs</h2>
              <div className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed">
                <p>Our in-house alterations service handles everything from a simple hem to full garment resizing. Bring in your school uniform, workwear, or everyday clothing and we&apos;ll make it fit perfectly.</p>
                <p>We repair zips, patch worn fabric, replace buttons, and fix seams — extending the life of garments so you get maximum value from your investment.</p>
              </div>
            </div>
            <div className="space-y-3">
              {["Hemming trousers, skirts and dresses", "Waist and seat adjustments", "Sleeve shortening or lengthening", "Zip replacement", "Button replacement", "Patch repairs", "Seam repairs", "Taking in or letting out garments"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-burgundy-800 flex-shrink-0" />
                  <span className="font-sans text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-burgundy-50 rounded-2xl p-8 text-center">
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Bring It In</h3>
            <p className="font-sans text-gray-500 mb-6 max-w-lg mx-auto">Pop into our Aberdeen store or contact us to discuss your alteration requirements. We&apos;ll give you a price before any work begins.</p>
            <Link href="/contact" className="btn-primary">Contact Us</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
