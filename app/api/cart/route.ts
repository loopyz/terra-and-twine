import { NextRequest, NextResponse } from "next/server";
import { CART_COOKIE, parseCart, type Cart } from "@/lib/cart";
import { getProduct } from "@/lib/products";

function readCartFrom(req: NextRequest): Cart {
  return parseCart(req.cookies.get(CART_COOKIE)?.value);
}

function respondWith(cart: Cart): NextResponse {
  const res = NextResponse.json({ cart });
  res.cookies.set(CART_COOKIE, JSON.stringify(cart), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
  return res;
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ cart: readCartFrom(req) });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : null;
  const quantity =
    typeof body?.quantity === "number" ? Math.floor(body.quantity) : 1;

  if (!slug || !getProduct(slug) || quantity < 1) {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  }

  const cart = readCartFrom(req);
  cart[slug] = Math.min((cart[slug] ?? 0) + quantity, 99);
  return respondWith(cart);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : null;

  const cart = readCartFrom(req);
  if (slug) {
    delete cart[slug];
  } else {
    for (const key of Object.keys(cart)) delete cart[key];
  }
  return respondWith(cart);
}
