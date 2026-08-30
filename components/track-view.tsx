"use client";

import { useEffect, useRef } from "react";
import { useTrevo } from "@trevosdk/react";

type TrackProperties = NonNullable<
  Parameters<NonNullable<ReturnType<typeof useTrevo>>["track"]>[1]
>;

export default function TrackView({
  event,
  properties,
}: {
  event: string;
  properties?: TrackProperties;
}) {
  const trevo = useTrevo();
  const tracked = useRef<string | null>(null);

  useEffect(() => {
    if (!trevo || tracked.current === event) return;
    tracked.current = event;
    trevo.track(event, properties);
  }, [trevo, event, properties]);

  return null;
}
