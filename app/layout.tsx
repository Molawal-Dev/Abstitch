import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";
import { Toaster } from "@/components/ui/Toaster";
import { WishlistProvider } from "@/hooks/useWishlist";
import { ConfirmModalProvider } from "@/components/ui/ConfirmModal";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.abstitch.com"
  ),
  title: {
    default: "Abstitch | School Wear, Embroidery & Printing — Aberdeen",
    template: "%s | Abstitch",
  },
  description:
    "Abstitch supplies quality school uniforms, embroidery, printing, and workwear across Aberdeen and Scotland. Over 50 years of trusted service.",
  keywords: [
    "school uniforms Aberdeen",
    "school wear Scotland",
    "embroidery Aberdeen",
    "uniform printing",
    "Abstitch",
    "workwear",
    "safety wear",
  ],
  icons: {
    icon: "/logo-light.png",
    shortcut: "/logo-light.png",
    apple: "/logo-light.png",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.abstitch.com",
    siteName: "Abstitch",
    title: "Abstitch | School Wear, Embroidery & Printing — Aberdeen",
    description:
      "Quality school uniforms, embroidery, printing, and workwear across Aberdeen and Scotland.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abstitch | School Wear & Embroidery",
    description: "Quality school uniforms and embroidery in Aberdeen, Scotland.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-white text-gray-900 antialiased">
        <CartProvider>
          <WishlistProvider>
            <Toaster>
              <ConfirmModalProvider>
                {children}
              </ConfirmModalProvider>
            </Toaster>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
