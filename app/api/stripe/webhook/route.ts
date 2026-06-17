import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  sendOrderConfirmationToCustomer,
  sendNewOrderNotificationToAdmin,
} from "@/lib/email/templates";
import type { ShippingAddress, OrderItem, CartItem } from "@/types";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
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

  const cartItemsRaw: CartItem[] = [];

  try {
    const chunkCount = parseInt(meta.cart_items_json_chunks || "0", 10);
    if (chunkCount > 0) {
      let json = "";
      for (let i = 0; i < chunkCount; i++) {
        json += meta[`cart_items_json_${i}`] || "";
      }
      const parsedItems = JSON.parse(json) as CartItem[];
      cartItemsRaw.push(...parsedItems);
    }
  } catch (err) {
    console.error("Failed to parse cart items from metadata:", err);
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

  // Create order_items rows so each item retains its school context
  let orderItems: OrderItem[] = [];
  if (cartItemsRaw.length > 0) {
    const itemsToInsert = cartItemsRaw.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      product_slug: item.slug,
      variant_id: item.variant_id,
      color: item.color,
      size: item.size,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
      school: item.school || null,
    }));

    const { data: insertedItems, error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsToInsert)
      .select("*");

    if (itemsError) {
      console.error("Failed to create order items:", itemsError);
    } else {
      orderItems = insertedItems as OrderItem[];
    }
  }

  // Send emails
  try {
    const fullOrder = {
      ...order,
      items: orderItems,
    };

    await Promise.all([
      sendOrderConfirmationToCustomer(fullOrder),
      sendNewOrderNotificationToAdmin(fullOrder),
    ]);
  } catch (emailErr) {
    console.error("Email sending failed:", emailErr);
  }
}
