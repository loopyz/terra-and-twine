"use client";

import { useEffect, useRef } from "react";
import { useTrevo } from "@trevosdk/react";

export default function OrderConfirmationTracker({
  orderId,
}: {
  orderId?: string;
}) {
  const trevo = useTrevo();
  const tracked = useRef(false);

  useEffect(() => {
    if (!trevo || tracked.current) return;
    tracked.current = true;
    trevo.track("order_confirmation_viewed", {
      orderId,
      experiment:
        "split-checkout-into-contact-then-payment-steps-so-the-form-starts-before-the-car",
    });
  }, [trevo, orderId]);

  return null;
}
