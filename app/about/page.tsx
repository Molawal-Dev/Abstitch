import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";
import { Award, Users, Star, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About Abstitch | Aberdeen's School Wear & Embroidery Specialists",
  description:
    "Learn about Abstitch — Aberdeen's most trusted school wear supplier for over 50 years. Quality embroidery, printing, and uniforms across Scotland.",
};

export default function AboutPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-burgundy-950 to-burgundy-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={i} x1={i * 60} y1="0" x2={i * 60 - 100} y2="400" stroke="white" strokeWidth="1" />
            ))}
          </svg>
        </div>
        <div className="container-custom relative text-center max-w-3xl mx-auto">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-burgundy-300 mb-3">Our Story</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-5">
            Aberdeen&apos;s Uniform<br />Specialists Since the 1970s
          </h1>
          <p className="font-sans text-white/75 text-lg leading-relaxed">
            Abstitch has been supplying quality school wear, embroidery, and workwear to Aberdeen and the wider
            Scotland region for over five decades. A family business built on trust, quality, and service.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-burgundy-700 mb-2">Our Heritage</p>
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-5">
                Trusted by Aberdeen Families for Over 50 Years
              </h2>
              <div className="space-y-4 font-sans text-gray-600 leading-relaxed text-sm">
                <p>
                  Abstitch was founded in Aberdeen with a simple mission: to provide the highest quality school uniforms
                  and garments to local families at fair prices, with personalised service that larger retailers simply
                  cannot offer.
                </p>
                <p>
                  Over the decades, we have grown to serve over 60 schools and academies across Aberdeen and
                  Aberdeenshire, supplying everything from embroidered blazers and polo shirts to PE kits, hoodies,
                  and safety workwear.
                </p>
                <p>
                  Our in-house embroidery and printing capabilities mean we can personalise any garment with your
                  school crest, company logo, or bespoke design — with turnarounds that keep up with the demands of
                  school life.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "20+", label: "Years in Business" },
                { number: "50+", label: "Schools Served" },
                { number: "1000+", label: "Products Available" },
                { number: "5★", label: "Customer Rating" },
              ].map((stat) => (
                <div key={stat.label} className="bg-burgundy-50 rounded-2xl p-6 text-center">
                  <p className="font-serif text-4xl font-bold text-burgundy-800">{stat.number}</p>
                  <p className="font-sans text-xs text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-cream-50">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-burgundy-700 mb-2">What We Stand For</p>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Award size={24} />, title: "Quality First", desc: "Every garment we supply meets our strict quality standards. We only stock brands and fabrics that stand the test of time." },
              { icon: <Users size={24} />, title: "Community Rooted", desc: "Aberdeen is our home. We're proud to serve local schools, businesses, and families — and give back to the community we love." },
              { icon: <Star size={24} />, title: "Personalised Service", desc: "We treat every customer as an individual. No call centres, no chatbots — just real people who know their products." },
              { icon: <Shield size={24} />, title: "Reliability", desc: "When you need uniform items for the new school term, we deliver on time, every time. You can count on us." },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-11 h-11 rounded-lg bg-burgundy-50 flex items-center justify-center text-burgundy-800 mb-4">
                  {v.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="font-sans text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
            Ready to Work With Us?
          </h2>
          <p className="font-sans text-gray-500 mb-8">
            Whether you need uniforms for a single child or 500 pupils, we&apos;re here to help.
            Get in touch or browse our full product range today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop/school-wear" className="btn-primary">Browse School Wear</Link>
            <Link href="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
