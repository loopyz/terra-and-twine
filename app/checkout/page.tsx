import Link from "next/link";
import { cartLines, cartTotal, readCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { quoteShipping } from "@/lib/shipping";
import CheckoutForm from "@/components/checkout-form";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cart = await readCart();
  const lines = cartLines(cart);
  const total = cartTotal(cart);
  const quote = quoteShipping(total);

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-semibold">Nothing to check out</h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-10 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <CheckoutForm totalCents={total} />
      </div>
      <aside className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-medium">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {lines.map(({ product, quantity }) => (
            <li key={product.slug} className="flex justify-between">
              <span>
                {product.emoji} {product.name} × {quantity}
              </span>
              <span>{formatPrice(product.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-stone-200 pt-4 text-sm">
          <div className="flex justify-between text-stone-500">
            <span>Subtotal</span>
            <span>{formatPrice(quote.subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span>Shipping</span>
            <span>
              {quote.freeShippingApplied ? "Free" : formatPrice(quote.shippingCents)}
            </span>
          </div>
          <div className="flex justify-between pt-1 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(quote.totalCents)}</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-stone-400">
          Demo checkout — no payment is taken.
        </p>
      </aside>
    </div>
  );
}
