import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import { ChevronRight, Scissors, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Embroidery Services | Abstitch Aberdeen",
  description: "Professional machine embroidery on school uniforms, workwear, and corporate clothing in Aberdeen. Sharp, durable, and perfectly detailed.",
};

export default function EmbroideryPage() {
  return (
    <SiteLayout>
      <div className="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white py-14">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-white/60 font-sans mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white/90">Embroidery</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
              <Scissors size={28} className="text-white" />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold">Embroidery</h1>
              <p className="font-sans text-white/70 mt-1">Professional stitching for every garment</p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Precision Embroidery on Any Garment
              </h2>
              <div className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed">
                <p>
                  Abstitch offers professional machine embroidery for school uniforms, corporate clothing,
                  sportswear, and workwear. Whether it&apos;s a school crest, a company logo, or a
                  personalised name — we stitch it with precision and care.
                </p>
                <p>
                  Our state-of-the-art embroidery machines produce sharp, vibrant results that are built
                  to last through years of washing and wearing. We embroider onto any fabric, including
                  cotton, polyester, fleece, and knitwear.
                </p>
                <p>
                  We handle everything from single items to bulk school orders — with consistent quality
                  across every stitch.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "School crests and badges",
                "Company and corporate logos",
                "Sports team names and numbers",
                "Staff name badges",
                "Personalised children&apos;s clothing",
                "Monograms and initials",
                "Club and society emblems",
                "Bulk uniform orders",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-burgundy-800 flex-shrink-0" />
                  <span className="font-sans text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: item }} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-burgundy-50 rounded-2xl p-8 text-center">
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">
              Ready to Get Started?
            </h3>
            <p className="font-sans text-gray-500 mb-6 max-w-lg mx-auto">
              Send us your logo or artwork and we&apos;ll prepare a free quote. Most embroidery orders are completed within 5–7 working days.
            </p>
            <Link href="/contact#order" className="btn-primary">Request a Quote</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
