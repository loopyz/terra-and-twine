"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrevo } from "@trevosdk/react";

export default function CheckoutForm({ totalCents }: { totalCents: number }) {
  const trevo = useTrevo();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
      }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error ?? "Something went wrong.");
      setSubmitting(false);
      return;
    }

    trevo?.track("purchase_completed", {
      value: totalCents / 100,
      orderId: json.orderId,
    });
    router.push(
      `/checkout/success?order=${encodeURIComponent(json.orderId)}&total=${json.totalCents}`,
    );
  }

  const field =
    "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-emerald-600 focus:outline-none";

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <label className="block text-sm font-medium">
        Full name
        <input name="name" required placeholder="Fern Enthusiast" className={field} />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={field}
        />
      </label>
      <label className="block text-sm font-medium">
        Shipping address
        <input
          name="address"
          required
          placeholder="123 Greenhouse Lane"
          className={field}
        />
      </label>
      <label className="block text-sm font-medium">
        Card number
        <input
          name="card"
          inputMode="numeric"
          required
          placeholder="4242 4242 4242 4242"
          className={field}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-emerald-700 px-6 py-3 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        {submitting ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
