import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Scissors,
  Clock,
  Wallet,
  Award,
  MessageCircle,
  Search,
  Hand,
  PackageCheck,
} from "lucide-react";
import FaqAccordion from "@/components/ui/FaqAccordion";

export const metadata: Metadata = {
  title: "Alterations & Repair Services | Abstitch Aberdeen",
  description:
    "Expert garment alterations and repairs in Aberdeen. Hemming, resizing, zip replacement, and more — done with care and precision.",
};

const whyChoose = [
  {
    icon: <Award size={28} className="text-burgundy-800" />,
    title: "Expert Craftsmanship",
    desc: "Skilled tailoring carried out with care, precision, and attention to detail.",
  },
  {
    icon: <Wallet size={28} className="text-burgundy-800" />,
    title: "Extend Garment Life",
    desc: "Get more value from your clothing with quality repairs instead of replacing.",
  },
  {
    icon: <Clock size={28} className="text-burgundy-800" />,
    title: "Quick Turnaround",
    desc: "Most alterations and repairs are completed within a few working days.",
  },
  {
    icon: <MessageCircle size={28} className="text-burgundy-800" />,
    title: "No Job Too Small",
    desc: "From a single button to full resizing, we're happy to help with any job.",
  },
];

const process = [
  {
    step: "1",
    icon: <Hand size={22} className="text-burgundy-800" />,
    title: "Bring It In",
    desc: "Drop your garment off at our Aberdeen store or get in touch to arrange collection.",
  },
  {
    step: "2",
    icon: <Search size={22} className="text-burgundy-800" />,
    title: "Assessment & Quote",
    desc: "We assess the work required and give you a price before anything begins.",
  },
  {
    step: "3",
    icon: <Scissors size={22} className="text-burgundy-800" />,
    title: "Alteration & Repair",
    desc: "Our skilled team carries out the work with care and precision.",
  },
  {
    step: "4",
    icon: <PackageCheck size={22} className="text-burgundy-800" />,
    title: "Ready for Collection",
    desc: "We'll let you know once your garment is ready to collect or be returned.",
  },
];

const faqs = [
  {
    q: "What types of alterations do you offer?",
    a: "We offer a wide range of alterations including hemming, waist and seat adjustments, sleeve shortening or lengthening, taking in or letting out garments, and much more.",
  },
  {
    q: "Can you repair zips and buttons?",
    a: "Yes. We replace zips, buttons, and carry out seam and patch repairs to extend the life of your garments.",
  },
  {
    q: "How long will my alteration take?",
    a: "Most alterations and repairs are completed within a few working days, depending on the complexity of the job.",
  },
  {
    q: "Do I need to book an appointment?",
    a: "No appointment is necessary — simply bring your garment into our Aberdeen store or contact us to discuss your requirements.",
  },
  {
    q: "How much will it cost?",
    a: "Pricing depends on the type and complexity of the alteration or repair. We'll always give you a price before any work begins.",
  },
  {
    q: "Can you alter school uniforms?",
    a: "Yes. We regularly alter school uniforms, workwear, and everyday clothing to ensure the perfect fit.",
  },
];

export default function AlterationsPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative min-h-[380px] flex overflow-hidden bg-gray-900">
        <Image
          src="/images/services/alterations.png"
          alt="Tailor working on garment alterations"
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
            <span className="text-white/80">Alterations &amp; Repair</span>
          </nav>
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
              Tailoring &amp; Repairs{" "}
              <br />
              Done with{" "}
              <span className="text-burgundy-400">Care</span>
            </h1>
            <p className="font-sans text-white/80 text-base leading-relaxed mb-3">
              Expert garment alterations and repairs in Aberdeen.
            </p>
            <p className="font-sans text-white/70 text-sm leading-relaxed mb-8">
              Hemming, resizing, zip replacement, and more.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="bg-burgundy-800 hover:bg-burgundy-900 text-white font-sans font-semibold text-sm px-6 py-3 rounded-md transition-colors"
              >
                Bring It In
              </Link>
              <Link
                href="/contact"
                className="border border-white/40 text-white hover:bg-white/10 font-sans font-semibold text-sm px-6 py-3 rounded-md transition-colors"
              >
                Get In Touch
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
                Expert Tailoring &amp; Repairs
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                The Perfect Fit.{" "}
                <br />
                Made to{" "}
                <span className="text-burgundy-800">Last.</span>
              </h2>
              <div className="space-y-4 font-sans text-sm text-gray-600 leading-relaxed">
                <p>
                  Our in-house alterations service handles everything from a simple hem to full
                  garment resizing. Bring in your school uniform, workwear, or everyday clothing
                  and we&apos;ll make it fit perfectly.
                </p>
                <p>
                  We repair zips, patch worn fabric, replace buttons, and fix seams — extending
                  the life of garments so you get maximum value from your investment.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
              <Image
                src="/images/services/quality-embroidery.png"
                alt="Close up of tailoring and sewing"
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
                src="/images/services/repairs.png"
                alt="Sewing machine and fabric repair"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-burgundy-300 mb-3">
                What We Can Do
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white leading-tight mb-6">
                From a Quick Fix{" "}
                <br />
                to a{" "}
                <span className="text-burgundy-400">Full Resize.</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-sm text-white/85">
                {[
                  "Hemming trousers, skirts and dresses",
                  "Waist and seat adjustments",
                  "Sleeve shortening or lengthening",
                  "Zip replacement",
                  "Button replacement",
                  "Patch repairs",
                  "Seam repairs",
                  "Taking in or letting out garments",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-burgundy-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
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
              Why Choose Our Alterations?
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
                Bring It In
              </h2>
              <h2 className="font-serif text-3xl font-extrabold text-burgundy-800 leading-tight mb-4">
                Today.
              </h2>
              <p className="font-sans text-sm text-gray-500 leading-relaxed">
                Pop into our Aberdeen store or contact us to discuss your alteration
                requirements. We&apos;ll give you a price before any work begins.
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