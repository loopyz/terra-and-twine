import Link from "next/link";
import { cartLines, cartTotal, readCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { RemoveFromCart, CheckoutButton } from "@/components/cart-actions";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await readCart();
  const lines = cartLines(cart);
  const total = cartTotal(cart);

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-5xl">🧺</p>
        <h1 className="mt-4 text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">
          The plants are waiting for their new pots.
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
      <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
        <p className="text-stone-500">Subtotal</p>
        <p className="text-xl font-semibold">{formatPrice(total)}</p>
      </div>
      <p className="mt-1 text-right text-sm text-stone-400">
        Shipping calculated at checkout
      </p>
      <CheckoutButton totalCents={total} />
    </div>
  );
}
