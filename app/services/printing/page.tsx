import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import { ChevronRight, Printer, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Printing Services | Abstitch Aberdeen",
  description: "High-quality garment printing in Aberdeen. Screen printing, digital printing, and heat transfer on any fabric.",
};

export default function PrintingPage() {
  return (
    <SiteLayout>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-xs text-white/60 font-sans mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white/90">Printing</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
              <Printer size={28} className="text-white" />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold">Printing</h1>
              <p className="font-sans text-white/70 mt-1">Vibrant, long-lasting prints on any fabric</p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Full-Colour Garment Printing
              </h2>
              <div className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed">
                <p>
                  Abstitch offers professional garment printing using the latest technology. Whether you need
                  screen printing for large runs or digital printing for smaller quantities — we produce
                  results that are bold, sharp, and built to last.
                </p>
                <p>
                  Our heat transfer printing is perfect for photos, detailed artwork, and full-colour designs.
                  All prints are tested for wash durability and colour fastness before leaving our workshop.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {["Screen printing for bulk orders", "Digital printing for small runs", "Heat transfer for full-colour designs", "Sports numbers and names", "School and club T-shirts", "Event and promotional clothing"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-burgundy-800 flex-shrink-0" />
                  <span className="font-sans text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-burgundy-50 rounded-2xl p-8 text-center">
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Get a Quote</h3>
            <p className="font-sans text-gray-500 mb-6 max-w-lg mx-auto">Send us your design and garment requirements and we&apos;ll come back to you with a competitive price.</p>
            <Link href="/contact#order" className="btn-primary">Request a Quote</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
