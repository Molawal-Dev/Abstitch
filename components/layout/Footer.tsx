import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="mb-4">
            <Image
              src="/logo-light.png"
              alt="Abstitch"
              width={140}
              height={55}
              className="object-contain h-11 w-auto"
            />
            <div className="h-0.5 w-16 bg-burgundy-800 mt-1.5" />
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Aberdeen&apos;s trusted supplier of school uniforms, embroidery,
            and workwear for over 50 years. Quality you can rely on, service
            you can count on.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:bg-burgundy-800 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:bg-burgundy-800 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:bg-burgundy-800 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-sans font-semibold text-white uppercase tracking-widest text-xs mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {[
              { label: "Home", href: "/" },
              { label: "About Abstitch", href: "/about" },
              { label: "School Wear", href: "/shop/school-wear" },
              { label: "Garments", href: "/shop/garments" },
              { label: "Our Services", href: "/services" },
              { label: "Contact Us", href: "/contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-burgundy-300 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-burgundy-700 flex-shrink-0" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-sans font-semibold text-white uppercase tracking-widest text-xs mb-4">
            Our Services
          </h3>
          <ul className="space-y-2.5">
            {[
              { label: "Embroidery", href: "/services/embroidery" },
              { label: "Printing", href: "/services/printing" },
              { label: "Alterations & Repair", href: "/services/alterations" },
              { label: "Place an Order", href: "/contact#order" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-burgundy-300 transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-burgundy-700 flex-shrink-0" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-sans font-semibold text-white uppercase tracking-widest text-xs mb-4">
            Get In Touch
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-burgundy-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-400">
                35 Ann Street, Aberdeen, UK. AB25 3LH
              </span>
            </li>
            <li>
              <a
                href="tel:+441224639152"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-burgundy-300 transition-colors"
              >
                <Phone size={16} className="text-burgundy-500 flex-shrink-0" />
                01224 639 152
              </a>
            </li>
            <li>
              <a
                href="mailto:info@abstitch.co.uk"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-burgundy-300 transition-colors"
              >
                <Mail size={16} className="text-burgundy-500 flex-shrink-0" />
                info@abstitch.co.uk
              </a>
            </li>
          </ul>

          <div className="mt-5 p-3 bg-gray-800 rounded-lg">
            <p className="text-xs font-medium text-white mb-1">Opening Hours</p>
            <p className="text-xs text-gray-400">Mon–Fri: 9:00am – 5:00pm</p>
            <p className="text-xs text-gray-400">Saturday and Sunday: Closed</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {year} Abstitch. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Secure payments</span>
              <div className="flex gap-1.5">
                {["VISA", "MC", "AMEX"].map((c) => (
                  <span
                    key={c}
                    className="text-[9px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded font-bold tracking-wide"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
