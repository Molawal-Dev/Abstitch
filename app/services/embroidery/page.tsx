import type { Metadata } from "next";
import { useState } from "react";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Shield, Star, Home, Package, Send, Monitor, CheckSquare, Scissors } from "lucide-react";
import FaqAccordion from "@/components/ui/FaqAccordion";

export const metadata: Metadata = {
  title: "Professional Embroidery Services | Abstitch Aberdeen",
  description:
    "Premium in-house embroidery with durable stitching, professional finishes, and attention to detail. Garments, accessories, uniforms and more.",
};

const whyChoose = [
  {
    icon: <Shield size={28} className="text-burgundy-800" />,
    title: "Durable & Long Lasting",
    desc: "Embroidery is built to last, standing up to wear, washing and daily use.",
  },
  {
    icon: <Star size={28} className="text-burgundy-800" />,
    title: "High-Quality Finish",
    desc: "Clean stitching and precise detail for a professional and premium look.",
  },
  {
    icon: <Home size={28} className="text-burgundy-800" />,
    title: "In-House Production",
    desc: "All embroidery is completed in-house for quality control and fast turnaround.",
  },
  {
    icon: <Package size={28} className="text-burgundy-800" />,
    title: "No Minimum Orders",
    desc: "From single items to large orders, we're happy to help with any quantity.",
  },
];

const process = [
  {
    step: "1",
    icon: <Send size={22} className="text-burgundy-800" />,
    title: "Send Your Design",
    desc: "Send us your logo, artwork, or idea and let us know what you need.",
  },
  {
    step: "2",
    icon: <Monitor size={22} className="text-burgundy-800" />,
    title: "Digitising & Setup",
    desc: "New designs or logos require a one-time £35 digitising setup fee.",
  },
  {
    step: "3",
    icon: <CheckSquare size={22} className="text-burgundy-800" />,
    title: "Sample Approval",
    desc: "We provide a sample stitch-out or approval image for you to check and confirm.",
  },
  {
    step: "4",
    icon: <Scissors size={22} className="text-burgundy-800" />,
    title: "Embroidery Production",
    desc: "Once approved, we embroider your design onto your chosen garments or items in-house.",
  },
];

const faqs = [
  {
    q: "Can I supply my own garments?",
    a: "Yes. You can either supply your own garments or we can provide them for you.",
  },
  {
    q: "How long will my order take?",
    a: "Our standard turnaround time is usually around two weeks, although this can vary depending on the size and requirements of the order.",
  },
  {
    q: "Can you match colours?",
    a: "Yes. We can match colours very closely across a wide range of embroidery threads.",
  },
  {
    q: "What files do you need?",
    a: "For best results, we recommend supplying high-resolution PNG or PDF files.",
  },
  {
    q: "Do you provide samples?",
    a: "Yes. Before proceeding with production, we embroider your design onto a fabric sample and send a photo of it to you for approval.",
  },
  {
    q: "How much does embroidery cost?",
    a: "Embroidery pricing depends on the size and complexity of the design, garment type, and quantity required. Small embroidery logos start from £5.75 and larger embroidery logos start from £9.50. For an accurate quotation, get in touch with our team.",
  },
];

export default function EmbroideryPage() {
  return (
    <SiteLayout>
      <section className="relative min-h-[380px] flex overflow-hidden bg-gray-900">
        <Image
          src="/images/services/embroidery-banner.png"
          alt="Embroidery machine at Abstitch"
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
            <span className="text-white/80">Embroidery</span>
          </nav>
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
              Professional{" "}
              <span className="text-burgundy-400">Embroidery</span>{" "}
              Services
            </h1>
            <p className="font-sans text-white/80 text-base leading-relaxed mb-3">
              Premium embroidery with durable stitching, professional finishes, and attention to detail.
            </p>
            <p className="font-sans text-white/70 text-sm leading-relaxed mb-8">
              High-quality embroidery for garments, accessories, uniforms, and more.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact#order"
                className="bg-burgundy-800 hover:bg-burgundy-900 text-white font-sans font-semibold text-sm px-6 py-3 rounded-md transition-colors"
              >
                Request a Quote
              </Link>
              <Link
                href="/contact"
                className="border border-white/40 text-white hover:bg-white/10 font-sans font-semibold text-sm px-6 py-3 rounded-md transition-colors"
              >
                Send Us Your Logo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-burgundy-800 mb-3">
                About Our Embroidery
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                Quality Embroidery.{" "}
                <br />
                Made to{" "}
                <span className="text-burgundy-800">Last.</span>
              </h2>
              <div className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed">
                <p>
                  At Abstitch, we provide high-quality in-house embroidery with a strong focus on detail,
                  durability, and finish. Whether you already have a logo ready to go or just an idea in
                  mind, our team can help bring your design to life.
                </p>
                <p>
                  We can embroider almost any design, logo, or text in a wide range of colours, provided
                  a good-quality image or file is supplied. From one-off items to larger ongoing orders,
                  we produce embroidery that is made to last and designed to stand out.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
              <Image
                src="/images/services/quality-embroidery.png"
                alt="Close up of embroidery stitching"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-burgundy-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-burgundy-800">
              <Image
                src="/images/services/hoop-embroidery.png"
                alt="Embroidered Abstitch logo on dark fabric"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-burgundy-300 mb-3">
                What We Can Embroider
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white leading-tight mb-6">
                If We Can Hoop It,{" "}
                <br />
                We Can{" "}
                <span className="text-burgundy-400">Embroider It.</span>
              </h2>
              <div className="space-y-4 font-sans text-sm text-white/80 leading-relaxed">
                <p>
                  From garments and accessories to more unique items, we embroider a wide range of
                  products in-house with high-quality finishes and attention to detail.
                </p>
                <p>
                  If you&apos;re unsure whether your item is suitable for embroidery, just ask our team.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-block mt-8 bg-white text-burgundy-800 hover:bg-gray-100 font-sans font-semibold text-sm px-6 py-3 rounded-md transition-colors"
              >
                Ask Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-burgundy-800 mb-3">
              Why Choose Embroidery?
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

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-burgundy-800 mb-3">
              Our Process
            </p>
            <div className="w-12 h-0.5 bg-burgundy-800 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-burgundy-200 z-0" />
            {process.map((step) => (
              <div key={step.step} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-burgundy-50 border-2 border-burgundy-200 flex items-center justify-center mb-4 relative">
                  <span className="absolute -top-2 -left-2 w-6 h-6 bg-burgundy-800 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.step}
                  </span>
                  {step.icon}
                </div>
                <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-gray-500 leading-relaxed max-w-[180px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-burgundy-800 mb-3">
              Frequently Asked Questions
            </p>
            <div className="w-12 h-0.5 bg-burgundy-800 mx-auto" />
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100">
            <div>
              <h2 className="font-serif text-3xl font-extrabold text-gray-900 leading-tight mb-1">
                Have a Design
              </h2>
              <h2 className="font-serif text-3xl font-extrabold text-burgundy-800 leading-tight mb-4">
                in Mind?
              </h2>
              <p className="font-sans text-sm text-gray-500 leading-relaxed">
                Send us your logo, artwork, or idea and our team will help bring it to life with
                high-quality embroidery and expert finishing.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 md:items-start lg:items-center lg:justify-end">
              <Link
                href="/contact"
                className="bg-burgundy-800 hover:bg-burgundy-900 text-white font-sans font-semibold text-sm px-8 py-4 rounded-md transition-colors text-center"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

    </SiteLayout>
  );
}