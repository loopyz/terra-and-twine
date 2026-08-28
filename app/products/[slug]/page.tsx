import { notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, formatPrice, getProduct } from "@/lib/products";
import AddToCart from "@/components/add-to-cart";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div>
      <Link href="/" className="text-sm text-stone-500 hover:text-emerald-700">
        ← Back to shop
      </Link>
      <div className="mt-4 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div
          className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br text-9xl ${product.gradient}`}
        >
          {product.emoji}
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-emerald-700">
            {product.category}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <p className="mt-2 text-2xl font-semibold">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 leading-relaxed text-stone-600">
            {product.description}
          </p>
          <p className="mt-3 text-sm text-stone-500">
            {product.stock > 25
              ? "In stock"
              : `Only ${product.stock} left in stock`}
          </p>
          <AddToCart slug={product.slug} priceCents={product.price} />
          <ul className="mt-8 space-y-1 border-t border-stone-200 pt-4 text-sm text-stone-500">
            <li>✓ Free shipping over $50</li>
            <li>✓ 30-day returns, no questions asked</li>
            <li>✓ Carbon-neutral delivery</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
