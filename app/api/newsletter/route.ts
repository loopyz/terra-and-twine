import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email.includes("@")) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  // Demo store: we don't actually store the address anywhere.
  return NextResponse.json({ ok: true });
}
