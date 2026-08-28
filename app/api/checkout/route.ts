import { NextRequest, NextResponse } from "next/server";
import { CART_COOKIE, cartTotal, parseCart } from "@/lib/cart";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!email.includes("@") || name.length === 0) {
    return NextResponse.json(
      { error: "A name and a valid email are required." },
      { status: 400 },
    );
  }

  const cart = parseCart(req.cookies.get(CART_COOKIE)?.value);
  const total = cartTotal(cart);
  if (total === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Demo store: no payment processing. Mint an order id and clear the cart.
  const orderId = `TT-${Date.now().toString(36).toUpperCase()}`;

  const res = NextResponse.json({ orderId, totalCents: total });
  res.cookies.set(CART_COOKIE, "{}", { path: "/", sameSite: "lax" });
  return res;
}
