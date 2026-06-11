"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import SiteLayout from "@/components/layout/SiteLayout";
import CheckoutForm from "@/components/cart/CheckoutForm";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/hooks/useCart";
import { checkoutSchema, type CheckoutValues } from "@/lib/validations";
import { Lock } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const { cart } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "payment">("details");

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "United Kingdom",
    },
  });

  const handleDetailsSubmit = async (values: CheckoutValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, shippingAddress: values }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create payment intent");
      setClientSecret(data.clientSecret);
      setStep("payment");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0 && typeof window !== "undefined") {
    return (
      <SiteLayout>
        <div className="container-custom py-20 text-center">
          <p className="font-sans text-gray-500">Your cart is empty.</p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-custom py-10 md:py-14 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900">Checkout</h1>
          <div className="flex items-center gap-1.5 text-xs font-sans text-gray-500">
            <Lock size={13} className="text-emerald-600" />
            Secure &amp; encrypted
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8 font-sans text-sm">
          <span className={`flex items-center gap-1.5 ${step === "details" ? "text-burgundy-800 font-semibold" : "text-gray-400"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "details" ? "bg-burgundy-800 text-white" : "bg-gray-200 text-gray-500"}`}>1</span>
            Your Details
          </span>
          <div className="flex-1 h-px bg-gray-200 max-w-[60px]" />
          <span className={`flex items-center gap-1.5 ${step === "payment" ? "text-burgundy-800 font-semibold" : "text-gray-400"}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "payment" ? "bg-burgundy-800 text-white" : "bg-gray-200 text-gray-500"}`}>2</span>
            Payment
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main form */}
          <div className="lg:col-span-3">
            {step === "details" && (
              <CheckoutForm
                form={form}
                onSubmit={handleDetailsSubmit}
                loading={loading}
              />
            )}

            {step === "payment" && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#722F37",
                      fontFamily: "DM Sans, system-ui, sans-serif",
                      borderRadius: "6px",
                    },
                  },
                }}
              >
                <StripePaymentForm
                  clientSecret={clientSecret}
                  shippingAddress={form.getValues()}
                  onBack={() => setStep("details")}
                />
              </Elements>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <OrderSummary cart={cart} />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useCart as useCartHook } from "@/hooks/useCart";

function StripePaymentForm({
  clientSecret,
  shippingAddress,
  onBack,
}: {
  clientSecret: string;
  shippingAddress: CheckoutValues;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCartHook();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const { error: submitErr } = await elements.submit();
    if (submitErr) {
      setError(submitErr.message || "Validation error");
      setProcessing(false);
      return;
    }

    const { error: confirmErr } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
        payment_method_data: {
          billing_details: {
            name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: {
              line1: shippingAddress.address_line_1,
              line2: shippingAddress.address_line_2 || "",
              city: shippingAddress.city,
              postal_code: shippingAddress.postcode,
              country: "GB",
            },
          },
        },
      },
    });

    if (confirmErr) {
      setError(confirmErr.message || "Payment failed. Please try again.");
      setProcessing(false);
    } else {
      clearCart();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-lg font-bold text-gray-900 mb-5">
          Payment Details
        </h2>
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-sans text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="btn-outline flex-1 justify-center"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="btn-primary flex-1 justify-center"
        >
          {processing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Lock size={15} />
              Pay Now
            </>
          )}
        </button>
      </div>

      <p className="font-sans text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
        <Lock size={11} />
        Payments are secured by Stripe. We never store your card details.
      </p>
    </form>
  );
}
