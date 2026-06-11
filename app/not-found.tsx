import Link from "next/link";
import SiteLayout from "@/components/layout/SiteLayout";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="container-custom py-24 text-center max-w-lg mx-auto">
        <p className="font-serif text-8xl font-bold text-burgundy-100 mb-0">404</p>
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3 -mt-4">Page Not Found</h1>
        <p className="font-sans text-gray-500 mb-8">
          Sorry, we couldn&apos;t find the page you were looking for. It may have been moved or removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/shop/school-wear" className="btn-outline">Browse Products</Link>
        </div>
      </div>
    </SiteLayout>
  );
}
