import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Stub: wire to Klaviyo/Mailchimp/Shopify customer API later.
  console.log("[newsletter] signup:", email);

  return NextResponse.json({ success: true });
}
