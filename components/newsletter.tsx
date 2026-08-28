"use client";

import { useState } from "react";
import { useTrevo } from "@trevosdk/react";

export default function Newsletter() {
  const trevo = useTrevo();
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const email = new FormData(event.currentTarget).get("email");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      trevo?.track("newsletter_signup");
      setState("done");
    } else {
      setState("idle");
    }
  }

  return (
    <section className="border-t border-stone-200 bg-emerald-50 py-10">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="text-lg font-semibold">The Sunday Repotting</h2>
        <p className="mt-1 text-sm text-stone-600">
          One email a week: care tips, new arrivals, zero spam.
        </p>
        {state === "done" ? (
          <p className="mt-4 font-medium text-emerald-700">
            You&apos;re on the list 🌱
          </p>
        ) : (
          <form
            onSubmit={subscribe}
            className="mx-auto mt-4 flex max-w-md gap-2"
          >
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
