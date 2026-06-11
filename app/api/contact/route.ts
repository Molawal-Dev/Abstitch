import { NextRequest, NextResponse } from "next/server";
import { sendContactFormEmail, sendOrderEnquiryEmail } from "@/lib/email/templates";
import { contactFormSchema, orderEnquirySchema } from "@/lib/validations";
import { z } from "zod";

const rateLimitMap = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;
  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) return true;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

const requestSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("contact") }).merge(contactFormSchema),
  z.object({ type: z.literal("order") }).merge(orderEnquirySchema),
]);

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const data = parsed.data;

    if (data.type === "contact") {
      await sendContactFormEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      });
    } else {
      await sendOrderEnquiryEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        school_or_organisation: data.school_or_organisation,
        items_required: data.items_required,
        quantity: data.quantity,
        embroidery_required: data.embroidery_required,
        logo_description: data.logo_description,
        additional_notes: data.additional_notes,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
