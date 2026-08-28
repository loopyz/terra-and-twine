"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrevo } from "@trevosdk/react";

export default function AddToCart({
  slug,
  priceCents,
}: {
  slug: string;
  priceCents: number;
}) {
  const trevo = useTrevo();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");

  async function add() {
    setState("adding");
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, quantity: 1 }),
    });
    if (res.ok) {
      trevo?.track("add_to_cart", { product: slug, value: priceCents / 100 });
      setState("added");
      router.refresh();
      setTimeout(() => setState("idle"), 1500);
    } else {
      setState("idle");
    }
  }

  return (
    <button
      onClick={add}
      disabled={state === "adding"}
      className="mt-6 w-full rounded-full bg-emerald-700 px-6 py-3 font-medium text-white transition hover:bg-emerald-800 disabled:opacity-60 sm:w-auto sm:px-10"
    >
      {state === "added" ? "Added ✓" : state === "adding" ? "Adding…" : "Add to cart"}
    </button>
  );
}
