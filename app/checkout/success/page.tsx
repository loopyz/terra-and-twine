import Link from "next/link";
import { formatPrice } from "@/lib/products";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; total?: string }>;
}) {
  const { order, total } = await searchParams;
  const totalCents = Number(total);

  return (
    <div className="py-16 text-center">
      <p className="text-6xl">🎉</p>
      <h1 className="mt-4 text-3xl font-semibold">Order confirmed</h1>
      <p className="mt-2 text-stone-600">
        {order ? (
          <>
            Order <span className="font-mono font-medium">{order}</span>
            {Number.isFinite(totalCents) && totalCents > 0 && (
              <> — {formatPrice(totalCents)}</>
            )}{" "}
            is on its way.
          </>
        ) : (
          "Your order is on its way."
        )}
      </p>
      <p className="mt-1 text-sm text-stone-400">
        (Not really. This is a demo store.)
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-800"
      >
        Keep shopping
      </Link>
    </div>
  );
}
