import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  sendOrderConfirmationToCustomer,
  sendNewOrderNotificationToAdmin,
} from "@/lib/email/templates";
import type { ShippingAddress, OrderItem } from "@/types";
import type Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    await handlePaymentSuccess(intent);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(intent: Stripe.PaymentIntent) {
  const supabase = createServerSupabaseClient();
  const meta = intent.metadata;

  let shippingAddress: ShippingAddress;
  try {
    shippingAddress = JSON.parse(meta.shipping_address);
  } catch {
    console.error("Could not parse shipping address from metadata");
    return;
  }

  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_payment_intent_id", intent.id)
    .single();

  if (existing) {
    console.log("Order already exists for intent:", intent.id);
    return;
  }

  const cartItemsRaw: {
    product_id: string;
    variant_id: string | null;
    name: string;
    slug: string;
    image: string;
    color: string | null;
    size: string | null;
    price: number;
    quantity: number;
  }[] = [];

  try {
    // We stored a short description but need full items — stored in payment intent metadata
    // In production, you'd store the full cart in a temporary session or pass via metadata
    // For now we'll create a basic order record
  } catch {
    // ignore
  }

  const subtotal = parseFloat(meta.subtotal || "0");
  const shipping = parseFloat(meta.shipping || "0");
  const total = parseFloat(meta.total || "0");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_email: meta.customer_email,
      customer_name: meta.customer_name,
      shipping_address: shippingAddress,
      subtotal,
      shipping,
      total,
      status: "processing",
      stripe_payment_intent_id: intent.id,
      notes: meta.cart_items,
    })
    .select("*")
    .single();

  if (orderError || !order) {
    console.error("Failed to create order:", orderError);
    return;
  }

  // Send emails
  try {
    const fullOrder = {
      ...order,
      items: [],
    };

    await Promise.all([
      sendOrderConfirmationToCustomer(fullOrder),
      sendNewOrderNotificationToAdmin(fullOrder),
    ]);
  } catch (emailErr) {
    console.error("Email sending failed:", emailErr);
  }
}
