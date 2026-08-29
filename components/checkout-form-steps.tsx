"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { defineExperiment, useExperiment, useTrevo } from "@trevosdk/react";
import CheckoutForm from "@/components/checkout-form";

const checkoutStepsExperiment = defineExperiment(
  "progressive-disclosure-checkout-with-trust-and-summary-above-the-form",
  ["control", "variant"],
);

export function CheckoutFormExperiment({ totalCents }: { totalCents: number }) {
  const variant = useExperiment(checkoutStepsExperiment);

  if (variant === "control") {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <CheckoutForm totalCents={totalCents} />
      </div>
    );
  }

  return (
    <div className="order-last md:order-first">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <CheckoutFormSteps totalCents={totalCents} />
    </div>
  );
}

export default function CheckoutFormSteps({
  totalCents,
}: {
  totalCents: number;
}) {
  const trevo = useTrevo();
  const router = useRouter();
  const started = useRef(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [card, setCard] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startForm() {
    if (started.current) return;
    started.current = true;
    trevo?.track("checkout_form_started", {
      experiment:
        "progressive-disclosure-checkout-with-trust-and-summary-above-the-form",
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
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
  const action =
    "w-full rounded-full bg-emerald-700 px-6 py-3 font-medium text-white hover:bg-emerald-800 disabled:opacity-60";

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        Step {step} of 3
      </p>
      {step === 1 && (
        <>
          <p className="text-sm text-stone-500">
            ✓ Free shipping over $50 · ✓ 30-day returns · ✓ Carbon-neutral
            delivery
          </p>
          <h2 className="text-lg font-medium">Where should we send it?</h2>
          <label className="block text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onFocus={startForm}
              onChange={(event) => setEmail(event.target.value)}
              className={field}
            />
          </label>
          <button type="submit" className={action}>
            Continue
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <label className="block text-sm font-medium">
            Full name
            <input
              name="name"
              required
              placeholder="Fern Enthusiast"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={field}
            />
          </label>
          <label className="block text-sm font-medium">
            Shipping address
            <input
              name="address"
              required
              placeholder="123 Greenhouse Lane"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className={field}
            />
          </label>
          <button type="submit" className={action}>
            Continue to payment
          </button>
        </>
      )}
      {step === 3 && (
        <>
          <label className="block text-sm font-medium">
            Card number
            <input
              name="card"
              inputMode="numeric"
              required
              placeholder="4242 4242 4242 4242"
              value={card}
              onChange={(event) => setCard(event.target.value)}
              className={field}
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className={action}>
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </>
      )}
    </form>
  );
}
