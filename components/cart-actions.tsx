"use client";

import { useRouter } from "next/navigation";
import { useTrevo } from "@trevosdk/react";

export function RemoveFromCart({ slug }: { slug: string }) {
  const router = useRouter();

  async function remove() {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={remove}
      aria-label="Remove from cart"
      className="text-stone-400 transition hover:text-red-600"
    >
      ✕
    </button>
  );
}

export function CheckoutButton({ totalCents }: { totalCents: number }) {
  const trevo = useTrevo();
  const router = useRouter();

  function startCheckout() {
    trevo?.track("checkout_started", { value: totalCents / 100 });
    router.push("/checkout");
  }

  return (
    <button
      onClick={startCheckout}
      className="mt-6 w-full rounded-full bg-emerald-700 px-6 py-3 font-medium text-white hover:bg-emerald-800"
    >
      Proceed to checkout
    </button>
  );
}
