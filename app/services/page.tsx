import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import { ChevronRight, Scissors, Printer, Wrench } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Services | Abstitch Aberdeen",
  description:
    "Professional embroidery, printing, and alterations for private customers, schools, businesses and contractors in Aberdeen and beyond.",
};

const services = [
  {
    label: "Embroidery",
    href: "/services/embroidery",
    icon: <Scissors size={32} className="text-burgundy-800" />,
    image: "/images/services/embroidery.png",
    description:
      "Professional machine embroidery on school uniforms, workwear, and corporate clothing. Sharp, durable, and perfectly detailed.",
  },
  {
    label: "Printing",
    href: "/services/printing",
    icon: <Printer size={32} className="text-burgundy-800" />,
    image: "/images/services/printing.png",
    description:
      "High-quality garment printing for teams, businesses, and schools. Vibrant colours that last wash after wash.",
  },
  {
    label: "Alterations & Repair",
    href: "/services/alterations",
    icon: <Wrench size={32} className="text-burgundy-800" />,
    image: "/images/services/alterations.png",
    description:
      "Expert alterations and repairs on all types of clothing. From hemming to full resizing — done right, every time.",
  },
];

export default function ServicesPage() {
  return (
    <SiteLayout>
      <div className="relative overflow-hidden bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
          <div className="flex flex-col justify-center px-8 py-16 lg:px-16 xl:px-24">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-burgundy-800 mb-4">
              Professional • Reliable • Local
            </p>
            <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Embroidery, Print
              <br />
              &amp; Alterations
            </h1>
            <p className="font-sans text-base text-gray-500 leading-relaxed max-w-md">
              For private customers, schools, businesses and contractors in
              Aberdeen and beyond.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact#order" className="btn-primary">
                Get a Quote
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative min-h-[280px] lg:min-h-0 bg-gray-100">
            <Image
              src="/images/services/embroidery.png"
              alt="Embroidery machine at Abstitch"
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-burgundy-800 to-transparent opacity-30" />
      </div>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Our Services
            </h2>
            <div className="w-12 h-0.5 bg-burgundy-800 mx-auto mb-4" />
            <p className="font-sans text-sm text-gray-500 max-w-xl mx-auto">
              Professional embroidery, printing, and alterations for private
              customers, schools, businesses and contractors in Aberdeen and
              beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.label}
                href={service.href}
                className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="p-5 flex items-center gap-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                    {service.icon}
                  </div>
                  <div>
                    <p className="font-sans font-bold text-gray-900 text-base uppercase tracking-wide group-hover:text-burgundy-800 transition-colors">
                      {service.label}
                    </p>
                    <p className="font-sans text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-burgundy-800 py-14">
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="font-sans text-white/70 text-sm max-w-md mx-auto mb-8">
            Send us your logo or artwork and we&apos;ll prepare a free quote.
            Most orders are completed within 5–7 working days.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact#order"
              className="bg-white text-burgundy-800 font-sans font-semibold text-sm px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Request a Quote
            </Link>
            <Link
              href="/contact"
              className="border border-white/40 text-white font-sans font-semibold text-sm px-6 py-3 rounded-md hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <div className="container-custom py-4">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-sans">
          <Link href="/" className="hover:text-burgundy-800 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">Our Services</span>
        </nav>
      </div>
    </SiteLayout>
  );
}