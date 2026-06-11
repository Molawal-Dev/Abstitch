import Link from "next/link";

export default function HomeCTABanner() {
  return (
    <section className="py-16 bg-burgundy-800">
      <div className="container-custom text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Outfit Your School?
        </h2>
        <p className="font-sans text-white/80 max-w-xl mx-auto mb-8 text-base">
          Browse our full range or place a custom order enquiry. Our team is ready to help you find exactly what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop/school-wear"
            className="px-8 py-4 bg-white text-burgundy-800 font-sans font-bold text-sm tracking-wider uppercase rounded hover:bg-cream-100 transition-colors"
          >
            Shop Now
          </Link>
          <Link
            href="/contact#order"
            className="px-8 py-4 border-2 border-white/60 text-white font-sans font-bold text-sm tracking-wider uppercase rounded hover:border-white hover:bg-white/10 transition-colors"
          >
            Place an Enquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
