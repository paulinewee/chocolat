"use client";

import { useEffect, useState } from "react";
import type { BoxSize } from "@/components/box/BoxVisual";

/** Prefer a smaller box layout on narrow viewports. */
export function useResponsiveBoxSize(desktop: BoxSize = "xl"): BoxSize {
  const [size, setSize] = useState<BoxSize>(desktop);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setSize(mq.matches ? "lg" : desktop);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [desktop]);

  return size;
}
