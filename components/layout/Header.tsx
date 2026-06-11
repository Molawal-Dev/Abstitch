"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ChevronDown, Phone, Mail, Heart } from "lucide-react";
import SchoolSearch from "@/components/layout/SchoolSearch";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Abstitch", href: "/about" },
  {
    label: "Shop",
    children: [
      {
        label: "School Wear",
        href: "/shop/school-wear",
        children: [
          { label: "Primary Schools", href: "/shop/school-wear/primary" },
          { label: "Academy Schools", href: "/shop/school-wear/academy" },
        ],
      },
      { label: "Garments", href: "/shop/garments" },
    ],
  },
  {
    label: "Our Services",
    children: [
      { label: "Embroidery", href: "/services/embroidery" },
      { label: "Printing", href: "/services/printing" },
      { label: "Alterations & Repair", href: "/services/alterations" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { cart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <>
      <div className="bg-burgundy-800 text-white text-xs py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <span className="opacity-80">
            Over 50 years of quality school wear &amp; embroidery in Aberdeen
          </span>
          <div className="flex items-center gap-6">
            <a
              href="tel:+4401224639152"
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <Phone size={12} />
              <span>01224 639 152</span>
            </a>
            <a
              href="mailto:info@abstitch.co.uk"
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <Mail size={12} />
              <span>info@abstitch.co.uk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-50 bg-white transition-all duration-300",
          scrolled ? "shadow-md" : "shadow-sm"
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/logo-dark.png"
                alt="Abstitch"
                width={160}
                height={60}
                className="object-contain h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) =>
                item.children ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 font-sans text-sm font-medium transition-colors rounded",
                        activeDropdown === item.label
                          ? "text-burgundy-800"
                          : "text-gray-700 hover:text-burgundy-800"
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-200",
                          activeDropdown === item.label && "rotate-180"
                        )}
                      />
                    </button>

                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 pt-1 min-w-[220px] z-50">
                        <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden py-2">
                          {item.children.map((child) => (
                            <div key={child.label}>
                              {child.children ? (
                                <div className="group relative">
                                  <Link
                                    href={child.href}
                                    className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-800 font-medium transition-colors"
                                  >
                                    {child.label}
                                    <ChevronDown
                                      size={12}
                                      className="-rotate-90"
                                    />
                                  </Link>
                                  <div className="absolute left-full top-0 pl-1 hidden group-hover:block min-w-[200px]">
                                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden py-2">
                                      {child.children.map((sub) => (
                                        <Link
                                          key={sub.label}
                                          href={sub.href}
                                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-800 transition-colors"
                                        >
                                          {sub.label}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <Link
                                  href={child.href}
                                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-800 transition-colors"
                                >
                                  {child.label}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={cn(
                      "px-4 py-2 font-sans text-sm font-medium transition-colors rounded",
                      pathname === item.href
                        ? "text-burgundy-800"
                        : "text-gray-700 hover:text-burgundy-800"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <SchoolSearch />

              <Link
                href="/wishlist"
                className="relative p-2 text-gray-700 hover:text-burgundy-800 transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-burgundy-800 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-burgundy-800 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} />
                {cart.item_count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-burgundy-800 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.item_count > 99 ? "99+" : cart.item_count}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-burgundy-800 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        <div className="h-0.5 bg-gradient-to-r from-transparent via-burgundy-800 to-transparent opacity-20" />
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <Image
                src="/logo-dark.png"
                alt="Abstitch"
                width={120}
                height={45}
                className="object-contain h-9 w-auto"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-500 hover:text-burgundy-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-1">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label}>
                    <button
                      onClick={() =>
                        setMobileExpanded(
                          mobileExpanded === item.label ? null : item.label
                        )
                      }
                      className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-700 hover:text-burgundy-800 hover:bg-burgundy-50 rounded-md transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={cn(
                          "transition-transform",
                          mobileExpanded === item.label && "rotate-180"
                        )}
                      />
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <div key={child.label}>
                            <Link
                              href={child.href}
                              className="block px-3 py-2.5 text-sm text-gray-600 hover:text-burgundy-800 hover:bg-burgundy-50 rounded-md transition-colors font-medium"
                            >
                              {child.label}
                            </Link>
                            {child.children && (
                              <div className="ml-4 space-y-1">
                                {child.children.map((sub) => (
                                  <Link
                                    key={sub.label}
                                    href={sub.href}
                                    className="block px-3 py-2 text-sm text-gray-500 hover:text-burgundy-800 hover:bg-burgundy-50 rounded-md transition-colors"
                                  >
                                    {sub.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className="block px-3 py-3 text-sm font-medium text-gray-700 hover:text-burgundy-800 hover:bg-burgundy-50 rounded-md transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            <div className="p-4 border-t border-gray-100 mt-4 bg-burgundy-50">
              <p className="text-xs text-gray-500 mb-2">Contact Us</p>
              <a
                href="tel:+4401224639152"
                className="flex items-center gap-2 text-sm text-burgundy-800 py-1"
              >
                <Phone size={14} />
                01224 639 152
              </a>
              <a
                href="mailto:info@abstitch.co.uk"
                className="flex items-center gap-2 text-sm text-burgundy-800 py-1"
              >
                <Mail size={14} />
                info@abstitch.co.uk
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}