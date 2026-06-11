"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Mail } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (paymentIntentId) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [paymentIntentId]);

  return (
    <SiteLayout>
      <div className="container-custom py-20 max-w-xl mx-auto text-center">
        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">
              Order Confirmed!
            </h1>
            <p className="font-sans text-gray-500 mb-8 leading-relaxed">
              Thank you for your order. We&apos;ve received your payment and are getting your items ready.
              A confirmation email has been sent to your inbox.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <Mail className="w-6 h-6 text-burgundy-800 mx-auto mb-2" />
                <p className="font-sans text-xs text-gray-600">Confirmation email sent to your inbox</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <Package className="w-6 h-6 text-burgundy-800 mx-auto mb-2" />
                <p className="font-sans text-xs text-gray-600">We&apos;ll notify you when your order is dispatched</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/shop/school-wear" className="btn-primary">
                Continue Shopping
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">
              Something went wrong
            </h1>
            <p className="font-sans text-gray-500 mb-6">
              We couldn&apos;t confirm your order. Please contact us at{" "}
              <a href="mailto:info@abstitch.co.uk" className="text-burgundy-800 hover:underline">
                info@abstitch.co.uk
              </a>
            </p>
            <Link href="/" className="btn-primary">Go Home</Link>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
