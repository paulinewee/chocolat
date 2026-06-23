"use client";

import { PaperTexture } from "@paper-design/shaders-react";
import { PAGE_PAPER_TEXTURE_PROPS } from "@/lib/paper-texture-props";

/** Paper grain across the whole viewport — not per illustration */
export function PagePaperTexture() {
  return (
    <div
      className="page-paper-texture pointer-events-none fixed inset-0 z-[1]"
      aria-hidden
    >
      <PaperTexture
        width="100%"
        height="100%"
        minPixelRatio={1}
        maxPixelCount={2_500_000}
        style={{ width: "100%", height: "100%" }}
        {...PAGE_PAPER_TEXTURE_PROPS}
      />
    </div>
  );
}
