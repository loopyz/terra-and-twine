"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { defineExperiment, useExperiment, useTrevo } from "@trevosdk/react";

const CHECKOUT_STEPS_KEY =
  "split-checkout-into-contact-then-payment-steps-so-the-form-starts-before-the-car";

const CHECKOUT_STEPS = defineExperiment(CHECKOUT_STEPS_KEY, [
  "control",
  "variant",
]);

export default function CheckoutFormSteps({
  totalCents,
  children,
}: {
  totalCents: number;
  children: React.ReactNode;
}) {
  const variant = useExperiment(CHECKOUT_STEPS);

  if (variant === "control") {
    return <>{children}</>;
  }

  return <StepsForm totalCents={totalCents} />;
}

function StepsForm({ totalCents }: { totalCents: number }) {
  const trevo = useTrevo();
  const router = useRouter();
  const started = useRef(false);
  const [step, setStep] = useState<"contact" | "payment">("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [card, setCard] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function start() {
    if (started.current) return;
    started.current = true;
    trevo?.track("checkout_form_started", { experiment: CHECKOUT_STEPS_KEY });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === "contact") {
      setStep("payment");
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

  return (
    <form onSubmit={submit} onChange={start} className="mt-6 space-y-4">
      {step === "contact" ? (
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
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
          <button
            type="submit"
            className="w-full rounded-full bg-emerald-700 px-6 py-3 font-medium text-white hover:bg-emerald-800"
          >
            Continue to payment
          </button>
          <p className="text-center text-xs text-stone-500">
            No payment taken until you place the order
          </p>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm">
            <div className="text-stone-500">
              <p className="font-medium text-stone-900">{name}</p>
              <p>{email}</p>
              <p>{address}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep("contact")}
              className="font-medium text-emerald-700 hover:text-emerald-800"
            >
              Edit
            </button>
          </div>
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
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-emerald-700 px-6 py-3 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </>
      )}
    </form>
  );
}
