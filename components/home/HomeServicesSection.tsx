import Link from "next/link";
import { Scissors, Printer, Wrench } from "lucide-react";

const services = [
  {
    icon: <Scissors className="w-8 h-8" />,
    title: "Embroidery",
    description:
      "Professional machine embroidery on school uniforms, workwear, and corporate clothing. Sharp, durable, and perfectly detailed.",
    href: "/services/embroidery",
    features: ["School crests", "Corporate logos", "Name badges", "Bulk orders"],
  },
  {
    icon: <Printer className="w-8 h-8" />,
    title: "Printing",
    description:
      "High-quality garment printing using the latest technology. Vibrant, long-lasting prints on any fabric.",
    href: "/services/printing",
    features: ["Screen printing", "Digital printing", "Heat transfer", "Full colour"],
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: "Alterations & Repair",
    description:
      "Expert tailoring and repair service. From hemming and resizing to full garment repairs — done with care.",
    href: "/services/alterations",
    features: ["Hemming", "Resizing", "Zip replacement", "Patching"],
  },
];

export default function HomeServicesSection() {
  return (
    <section className="py-16 md:py-20 bg-gray-900 text-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-burgundy-400 mb-2">
            What We Do
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
            Our Services
          </h2>
          <p className="font-sans text-gray-400 mt-3 max-w-xl mx-auto">
            From a single logo to thousands of garments — we deliver quality every time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="group bg-gray-800 rounded-xl p-7 hover:bg-burgundy-900 transition-colors duration-300 border border-gray-700 hover:border-burgundy-700"
            >
              <div className="text-burgundy-400 group-hover:text-burgundy-300 transition-colors mb-5">
                {s.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">
                {s.title}
              </h3>
              <p className="font-sans text-sm text-gray-400 leading-relaxed mb-5">
                {s.description}
              </p>
              <ul className="space-y-1.5">
                {s.features.map((f) => (
                  <li
                    key={f}
                    className="font-sans text-xs text-gray-500 group-hover:text-gray-400 flex items-center gap-2 transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-burgundy-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
