import { NextRequest, NextResponse } from "next/server";
import { sendBrochureRequestEmail } from "@/lib/email/templates";
import { brochureRequestSchema } from "@/lib/validations";

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

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = brochureRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const { name, company, position, email, number } = parsed.data;

    await sendBrochureRequestEmail({ name, company, position, email, number });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Brochure request error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}