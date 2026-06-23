"use client";

import { useEffect, useState } from "react";
import type { BoxSize } from "@/components/box/BoxVisual";

/** On narrow viewports, use `fit` so boxes scale to available height instead of clipping. */
export function useResponsiveBoxSize(desktop: BoxSize = "xl"): BoxSize {
  const [size, setSize] = useState<BoxSize>(desktop);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setSize(mq.matches && desktop !== "picker" ? "fit" : desktop);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [desktop]);

  return size;
}
