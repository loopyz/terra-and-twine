import Link from "next/link";
import { PRODUCTS, formatPrice } from "@/lib/products";

export default function Home() {
  return (
    <div>
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 p-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Thoughtful goods for people who talk to their plants.
        </h1>
        <p className="mt-3 max-w-xl text-stone-600">
          Planters, tools, and care essentials — small-batch, sturdy, and
          shipped with too much paper tape.
        </p>
        <a
          href="#catalog"
          className="mt-6 inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Browse the shop
        </a>
      </section>

      <section id="catalog">
        <h2 className="mb-4 text-lg font-medium text-stone-700">
          The catalog
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group rounded-xl border border-stone-200 bg-white p-4 transition hover:shadow-md"
            >
              <div
                className={`mb-3 flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br text-6xl ${product.gradient}`}
              >
                {product.emoji}
              </div>
              <h3 className="font-medium group-hover:text-emerald-700">
                {product.name}
              </h3>
              <p className="text-sm text-stone-500">{product.tagline}</p>
              <p className="mt-2 font-semibold">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
