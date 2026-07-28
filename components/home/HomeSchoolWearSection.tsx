import Link from "next/link";
import Image from "next/image";
import { ArrowRight, School, Shirt, HardHat } from "lucide-react";

interface CategoryCard {
  title: string;
  description: string;
  href: string;
  external?: boolean;
  image: string;
  ctaLabel: string;
  Icon: React.ElementType;
}

const categories: CategoryCard[] = [
  {
    title: "School Wear",
    description:
      "Shop approved uniforms by school, including primary and academy wear.",
    href: "/shop/school-wear",
    image: "/images/primary-schools.jpg",
    ctaLabel: "FIND YOUR SCHOOL",
    Icon: School,
  },
  {
    title: "Garments Collection",
    description:
      "Browse our full range of clothing ready for embroidery, printing or personalisation.",
    href: "https://abstitch.fullcollection.com",
    external: true,
    image: "/home-banners/garments-image.png",
    ctaLabel: "EXPLORE GARMENTS",
    Icon: Shirt,
  },
  {
    title: "PPE & Safety Wear",
    description:
      "Explore protective clothing, hi-vis, footwear and specialist workwear.",
    href: "/shop/safety-wear",
    image: "/images/ppe-image.png",
    ctaLabel: "SHOP PPE",
    Icon: HardHat,
  },
];

export default function HomeSchoolWearSection() {
  return (
    <section className="py-16 md:py-20 bg-cream-50" id="all-products">
      <div className="container-custom">
        <div className="text-center mb-10">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-burgundy-700 mb-2">
            Browse By Category
          </p>
          <h2 className="section-title">Find What You Need</h2>
          <p className="section-subtitle mx-auto mt-3">
            Explore our school uniforms, customisable garments and PPE collections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((cat) => {
            const Icon = cat.Icon;
            const className =
              "group relative rounded-2xl overflow-hidden flex flex-col justify-end min-h-[420px] transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl";

            const content = (
              <>
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

                <div className="relative z-10 p-7">
                  <div className="w-14 h-14 rounded-full bg-burgundy-800/70 backdrop-blur-sm flex items-center justify-center mb-6">
                    <Icon size={24} className="text-white" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                    {cat.title}
                  </h3>
                  <span className="block w-10 h-[2px] bg-burgundy-500 mb-4" />
                  <p className="font-sans text-sm text-white/80 leading-relaxed mb-6">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-2 font-sans font-bold text-xs tracking-wider text-white group-hover:gap-3 transition-all">
                    {cat.ctaLabel}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </>
            );

            return cat.external ? (
              <a
                key={cat.title}
                href={cat.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link key={cat.title} href={cat.href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
