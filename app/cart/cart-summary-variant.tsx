"use client";

import { defineExperiment, useExperiment } from "@trevosdk/react";
import { formatPrice } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD_CENTS, quoteShipping } from "@/lib/shipping";
import { CheckoutButton } from "@/components/cart-actions";

const CART_DECISION_PAGE = defineExperiment(
  "turn-the-cart-page-into-a-decision-page-free-shipping-progress-and-return-shippi",
  ["control", "variant"],
);

export default function CartSummaryVariant({
  total,
  children,
}: {
  total: number;
  children: React.ReactNode;
}) {
  const variant = useExperiment(CART_DECISION_PAGE);

  if (variant === "control") {
    return <>{children}</>;
  }

  const quote = quoteShipping(total);
  const progress = Math.min(
    100,
    Math.round((total / FREE_SHIPPING_THRESHOLD_CENTS) * 100),
  );

  return (
    <div className="mt-6 border-t border-stone-200 pt-4">
      <div className="flex items-center justify-between">
        <p className="text-stone-500">Subtotal</p>
        <p className="font-semibold">{formatPrice(quote.subtotalCents)}</p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-stone-500">Shipping</p>
        <p className="font-semibold">
          {quote.freeShippingApplied
            ? "Free"
            : formatPrice(quote.shippingCents)}
        </p>
      </div>
      {!quote.freeShippingApplied && (
        <div className="mt-2">
          <p className="text-sm text-stone-500">
            Add {formatPrice(quote.centsToFreeShipping)} more for free shipping
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-emerald-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3">
        <p className="text-stone-500">Estimated total</p>
        <p className="text-xl font-semibold">{formatPrice(quote.totalCents)}</p>
      </div>
      <CheckoutButton totalCents={total} />
      <ul className="mt-4 space-y-1 text-sm text-stone-500">
        <li>✓ 30-day returns, no questions asked</li>
        <li>✓ Carbon-neutral delivery</li>
      </ul>
    </div>
  );
}
