import { NextRequest, NextResponse } from "next/server";
import { getStripe, formatAmountForStripe } from "@/lib/stripe/client";
import { calculateShipping } from "@/lib/utils";
import type { CartItem, ShippingAddress } from "@/types";
import { z } from "zod";

const bodySchema = z.object({
  cart: z.object({
    items: z.array(z.object({
      product_id: z.string(),
      variant_id: z.string().nullable(),
      name: z.string(),
      slug: z.string(),
      image: z.string(),
      color: z.string().nullable(),
      size: z.string().nullable(),
      gender: z.string().nullable().optional(),
      price: z.number(),
      quantity: z.number().int().positive(),
      school: z.string().nullable().optional(),
    })),
    total: z.number(),
    item_count: z.number(),
  }),
  shippingAddress: z.object({
    fulfilment: z.enum(["delivery", "collection"]).optional(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address_line_1: z.string().optional().or(z.literal("")),
    address_line_2: z.string().optional(),
    city: z.string().optional().or(z.literal("")),
    county: z.string().optional(),
    postcode: z.string().optional().or(z.literal("")),
    country: z.string(),
    notes: z.string().optional(),
  }),
  fulfilment: z.enum(["delivery", "collection"]).optional(),
  deliveryFee: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { cart, shippingAddress, fulfilment, deliveryFee } = parsed.data;

    if (!cart.items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const shipping =
      fulfilment === "collection"
        ? 0
        : fulfilment === "delivery"
        ? deliveryFee ?? calculateShipping(subtotal)
        : calculateShipping(subtotal);

    const total = subtotal + shipping;

    const lineItemsDescription = cart.items
  .map((i) => `${i.quantity}x ${i.name}${i.color ? ` (${i.color})` : ""}${i.size ? ` / ${i.size}` : ""}${i.gender ? ` / ${i.gender}` : ""}${i.school ? ` / ${i.school}` : ""}`)
  .join(", ");

    const cartItemsJson = JSON.stringify(cart.items);
    const CHUNK_SIZE = 480;
    const cartItemChunks: Record<string, string> = {};
    for (let i = 0; i < Math.ceil(cartItemsJson.length / CHUNK_SIZE); i++) {
      cartItemChunks[`cart_items_json_${i}`] = cartItemsJson.substring(
        i * CHUNK_SIZE,
        (i + 1) * CHUNK_SIZE
      );
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: formatAmountForStripe(total),
      currency: "gbp",
      automatic_payment_methods: { enabled: true },
      receipt_email: shippingAddress.email,
      metadata: {
        customer_name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        customer_email: shippingAddress.email,
        customer_phone: shippingAddress.phone,
        shipping_address: JSON.stringify(shippingAddress),
        cart_items: lineItemsDescription.substring(0, 500),
        cart_items_json_chunks: String(Object.keys(cartItemChunks).length),
        ...cartItemChunks,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        fulfilment_method: fulfilment || "collection",
      },
      description: `Abstitch order — ${shippingAddress.first_name} ${shippingAddress.last_name}`,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
