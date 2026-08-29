// Server-side shipping rules. The storefront intentionally does NOT show
// these numbers before checkout — shipping is revealed on the checkout page.
export const FREE_SHIPPING_THRESHOLD_CENTS = 5000; // free shipping over $50
export const FLAT_SHIPPING_FEE_CENTS = 599; // otherwise $5.99 flat

export interface ShippingQuote {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  freeShippingApplied: boolean;
  centsToFreeShipping: number; // 0 when free shipping applies
}

export function quoteShipping(subtotalCents: number): ShippingQuote {
  const freeShippingApplied = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCents = freeShippingApplied ? 0 : FLAT_SHIPPING_FEE_CENTS;
  return {
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    freeShippingApplied,
    centsToFreeShipping: freeShippingApplied
      ? 0
      : FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents,
  };
}
