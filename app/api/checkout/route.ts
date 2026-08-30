import { NextRequest, NextResponse } from "next/server";
import { CART_COOKIE, cartTotal, parseCart } from "@/lib/cart";
import { quoteShipping } from "@/lib/shipping";
import { trevoServer } from "@/lib/trevo-server";

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
  const subtotal = cartTotal(cart);
  if (subtotal === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Shipping is computed server-side and only revealed at checkout.
  const quote = quoteShipping(subtotal);

  // Demo store: no payment processing. Mint an order id and clear the cart.
  const orderId = `TT-${Date.now().toString(36).toUpperCase()}`;

  // Record the order server-side — the authoritative conversion record.
  // Idempotent via insertId, keyed to the visitor's Trevo identity cookie.
  const trevo = trevoServer();
  const anonymousId = req.cookies.get("trevo_id")?.value;
  if (trevo && anonymousId) {
    trevo.track(
      "order_recorded",
      { anonymousId },
      {
        orderId,
        value: quote.totalCents / 100,
        subtotal: quote.subtotalCents / 100,
        shipping: quote.shippingCents / 100,
        freeShippingApplied: quote.freeShippingApplied,
      },
      { insertId: orderId },
    );
    await trevo.flush().catch(() => {});
  }

  const res = NextResponse.json({
    orderId,
    subtotalCents: quote.subtotalCents,
    shippingCents: quote.shippingCents,
    totalCents: quote.totalCents,
  });
  res.cookies.set(CART_COOKIE, "{}", { path: "/", sameSite: "lax" });
  return res;
}
