import Image from "next/image";

const BANNER_HREF = "https://www.fullcollection.com/catalogue/299-product-use/353-safetywear-and-ppe?sort=recommended";

export default function HomeVideoBanner() {
  const isLinked = BANNER_HREF.length > 0;

  return (
    <section className="pb-16 md:pb-20 bg-white">
      <div className="container-custom">
        <a
          href={BANNER_HREF || undefined}
          target={isLinked ? "_blank" : undefined}
          rel={isLinked ? "noopener noreferrer" : undefined}
          aria-label="View our full list of PPE and workwear brands"
          className="group relative block w-full overflow-hidden rounded-2xl shadow-lg cursor-pointer"
        >
          <div className="relative w-full" style={{ aspectRatio: "1983 / 793" }}>
            <Image
              src="/images/under-video-banner.png"
              alt="Your trusted PPE, Workwear and Branding Partner"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="100vw"
              priority={false}
            />

            {/* Soft sheen sweep on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Burgundy ring reveal */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-4 ring-burgundy-600/40 transition-all duration-500" />
          </div>
        </a>
      </div>
    </section>
  );
}
