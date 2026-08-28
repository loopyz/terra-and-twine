"use client";

import Link from "next/link";
import { assertNever, defineExperiment, useExperiment } from "@trevosdk/react";
import { type CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { RemoveFromCart, CheckoutButton } from "@/components/cart-actions";

const CART_REASSURANCE = defineExperiment(
  "turn-the-cart-into-a-reassurance-page-with-free-shipping-progress-and-a-persiste",
  ["control", "variant"],
);

const FREE_SHIPPING_CENTS = 5000;

export function CartSummaryExperiment({
  lines,
  total,
  children,
}: {
  lines: CartLine[];
  total: number;
  children: React.ReactNode;
}) {
  const variant = useExperiment(CART_REASSURANCE);

  switch (variant) {
    case "control":
      return <>{children}</>;
    case "variant":
      return <CartSummaryVariant lines={lines} total={total} />;
    default:
      return assertNever(variant);
  }
}

function CartSummaryVariant({
  lines,
  total,
}: {
  lines: CartLine[];
  total: number;
}) {
  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-5xl">🧺</p>
        <h1 className="mt-4 text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">
          Pick a pot — free shipping over $50 and 30-day returns.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Back to the shop
        </Link>
      </div>
    );
  }

  const remaining = FREE_SHIPPING_CENTS - total;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold">Your cart</h1>
      <ul className="mt-6 divide-y divide-stone-200">
        {lines.map(({ product, quantity }) => (
          <li key={product.slug} className="flex items-center gap-4 py-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-3xl ${product.gradient}`}
            >
              {product.emoji}
            </div>
            <div className="flex-1">
              <Link
                href={`/products/${product.slug}`}
                className="font-medium hover:text-emerald-700"
              >
                {product.name}
              </Link>
              <p className="text-sm text-stone-500">
                {formatPrice(product.price)} × {quantity}
              </p>
            </div>
            <p className="font-semibold">
              {formatPrice(product.price * quantity)}
            </p>
            <RemoveFromCart slug={product.slug} />
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
        <p className="text-sm font-medium text-emerald-700">
          {remaining > 0
            ? `Add ${formatPrice(remaining)} more for free shipping`
            : "Free shipping unlocked 🎉"}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
          <p className="text-stone-500">Subtotal</p>
          <p className="text-xl font-semibold">{formatPrice(total)}</p>
        </div>
        <CheckoutButton totalCents={total} />
        <p className="mt-4 text-center text-xs text-stone-500">
          ✓ 30-day returns, no questions asked · ✓ Carbon-neutral delivery
        </p>
      </div>
    </div>
  );
}
