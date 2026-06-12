import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Palette, Shirt, Shield, Package, Send, Monitor, Printer as PrinterIcon, CheckSquare } from "lucide-react";
import FaqAccordion from "@/components/ui/FaqAccordion";

export const metadata: Metadata = {
  title: "Professional Printing Services | Abstitch Aberdeen",
  description:
    "Vibrant, high-quality prints in any colour, any size. Your design, printed your way — garments, accessories, uniforms and more.",
};

const whyChoose = [
  {
    icon: <Palette size={28} className="text-burgundy-800" />,
    title: "Full Colour Printing",
    desc: "We can print in virtually any colour with vibrant, high-quality results.",
  },
  {
    icon: <Shirt size={28} className="text-burgundy-800" />,
    title: "Any Size, Any Design",
    desc: "From smaller prints to larger statement designs, we print to suit your garment or item.",
  },
  {
    icon: <Shield size={28} className="text-burgundy-800" />,
    title: "Durable & Long Lasting",
    desc: "High-quality prints designed to last with proper care and washing.",
  },
  {
    icon: <Package size={28} className="text-burgundy-800" />,
    title: "No Minimum Orders",
    desc: "From one-off personalised items to larger quantities, we're happy to help.",
  },
];

const process = [
  {
    step: "1",
    icon: <Send size={22} className="text-burgundy-800" />,
    title: "Send Us Your Design or Idea",
    desc: "Send us your logo, artwork, image, photo, or idea.",
  },
  {
    step: "2",
    icon: <Monitor size={22} className="text-burgundy-800" />,
    title: "Design Preparation",
    desc: "We prepare your artwork for the best possible print quality.",
  },
  {
    step: "3",
    icon: <PrinterIcon size={22} className="text-burgundy-800" />,
    title: "Printing & Pressing",
    desc: "Your design is professionally printed and applied with care and precision.",
  },
  {
    step: "4",
    icon: <CheckSquare size={22} className="text-burgundy-800" />,
    title: "Quality Check",
    desc: "Every item is checked before completion to ensure a high-quality finish.",
  },
];

const faqs = [
  {
    q: "How much does printing cost?",
    a: "Printing costs vary depending on size, placement, and quantity. Smaller prints start from £4 and larger prints start from £8. For an accurate quote, get in touch with our team.",
  },
  {
    q: "Can you print one-off items?",
    a: "Yes. We can help with one-off personalised items as well as larger orders.",
  },
  {
    q: "How should I wash printed garments?",
    a: "Wash printed garments inside out at a lower temperature and avoid tumble drying where possible. This helps preserve the quality and lifespan of the print.",
  },
  {
    q: "How long will my order take?",
    a: "Our standard turnaround time is usually around two weeks, depending on the order size and requirements.",
  },
  {
    q: "Can you print full-colour designs?",
    a: "Yes. We can print full-colour designs, including logos, artwork, photos, gradients, and detailed graphics.",
  },
  {
    q: "What file types do you need?",
    a: "For best results, we recommend high-resolution PNG or PDF files.",
  },
  {
    q: "Can I send my own artwork or photos?",
    a: "Yes. You can send us your logo, artwork, image, photo, or even just an idea.",
  },
  {
    q: "Do you offer bulk discounts?",
    a: "Yes, larger quantity orders qualify for discounted pricing. Get in touch with our team for an accurate quote based on your requirements.",
  },
  {
    q: "Can I supply my own garments?",
    a: "Yes. You can supply your own garments, or we can provide garments for you.",
  },
  {
    q: "Where are you based?",
    a: "We're based in Aberdeen, Scotland. You're welcome to visit us or send your order by post.",
  },
];

export default function PrintingPage() {
  return (
    <SiteLayout>
      <section className="relative min-h-[420px] flex overflow-hidden bg-gray-900">
        <Image
          src="/images/services/printing-hero.png"
          alt="Premium printed hoodie"
          fill
          className="object-cover opacity-50"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 py-14 max-sm:pl-6 pl-12">
          <nav className="flex items-center gap-1.5 text-xs text-white/50 font-sans mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/services" className="hover:text-white transition-colors">Our Services</Link>
            <ChevronRight size={12} />
            <span className="text-white/80">Printing</span>
          </nav>
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
              Premium Printing{" "}
              <br />
              Made to{" "}
              <span className="text-burgundy-400">Stand Out</span>
            </h1>
            <p className="font-sans text-white/80 text-base leading-relaxed mb-3">
              Vibrant, high-quality prints in any colour, any size.
            </p>
            <p className="font-sans text-white/70 text-sm leading-relaxed mb-8">
              Your design, printed your way.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact#order"
                className="bg-burgundy-800 hover:bg-burgundy-900 text-white font-sans font-semibold text-sm px-6 py-3 rounded-md transition-colors"
              >
                Send Us Your Design
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-burgundy-800 mb-3">
                Custom Prints, Your Way.
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                Quality Prints.{" "}
                <br />
                Any Size.{" "}
                <br />
                <span className="text-burgundy-800">Any Colour.</span>
              </h2>
              <div className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed">
                <p>
                  At Abstitch, we provide high-quality custom printing with vibrant colours, sharp
                  detail, and long-lasting results.
                </p>
                <p>
                  From logos and artwork to photos and custom designs, we can print almost
                  anything. Whether you need a one-off personalised item or a larger order,
                  we&apos;ll help bring your ideas to life.
                </p>
                <p>
                  We can print in virtually any colour and across a wide range of sizes, depending
                  on what fits your garment or item.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
              <Image
                src="/images/services/quality-print.png"
                alt="Custom printed black t-shirt"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-burgundy-800 mb-3">
              Why Choose Printing?
            </p>
            <div className="w-12 h-0.5 bg-burgundy-800 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm"
              >
                <div className="w-16 h-16 rounded-full border-2 border-burgundy-200 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-burgundy-400 mb-3">
              Our Print Process
            </p>
            <div className="w-12 h-0.5 bg-burgundy-400 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-burgundy-700/40 z-0" />
            {process.map((step) => (
              <div key={step.step} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-burgundy-700 flex items-center justify-center mb-4 relative">
                  <span className="absolute -top-2 -left-2 w-6 h-6 bg-burgundy-800 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.step}
                  </span>
                  {step.icon}
                </div>
                <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-white mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-white/60 leading-relaxed max-w-[180px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-burgundy-800 mb-3">
              Frequently Asked Questions
            </p>
            <div className="w-12 h-0.5 bg-burgundy-800 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <FaqAccordion faqs={faqs.slice(0, 5)} />
            <FaqAccordion faqs={faqs.slice(5)} />
          </div>
        </div>
      </section>

      <section className="py-14 bg-burgundy-900">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 flex-shrink-0 rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
              <Image
                src="/images/services/color-wheel.png"
                alt="Colour wheel"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
                Any Colour.{" "}
                <br />
                Any Design.
              </h2>
              <p className="font-sans text-sm text-white/75 leading-relaxed max-w-xl">
                We can print in virtually any colour and almost any size — as long as it fits your
                garment or item, we can print it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-900 rounded-2xl p-8 md:p-12">
            <div>
              <h2 className="font-serif text-3xl font-extrabold text-white leading-tight">
                Have a{" "}
                <span className="text-burgundy-400">Design</span> in Mind?
              </h2>
              <p className="font-sans text-sm text-white/70 leading-relaxed mt-3 max-w-xl">
                Send us your logo, artwork, photo, or idea and our team will help bring it to
                life with high-quality printing that stands out.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-burgundy-800 hover:bg-burgundy-900 text-white font-sans font-semibold text-sm px-8 py-4 rounded-md transition-colors text-center whitespace-nowrap"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}