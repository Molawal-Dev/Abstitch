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
      price: z.number(),
      quantity: z.number().int().positive(),
    })),
    total: z.number(),
    item_count: z.number(),
  }),
  shippingAddress: z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address_line_1: z.string(),
    address_line_2: z.string().optional(),
    city: z.string(),
    county: z.string().optional(),
    postcode: z.string(),
    country: z.string(),
    notes: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { cart, shippingAddress } = parsed.data;

    if (!cart.items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    const lineItemsDescription = cart.items
      .map((i) => `${i.quantity}x ${i.name}${i.color ? ` (${i.color})` : ""}${i.size ? ` / ${i.size}` : ""}`)
      .join(", ");

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
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
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
