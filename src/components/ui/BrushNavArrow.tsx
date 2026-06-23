"use client";

import { useId } from "react";

type BrushNavArrowProps = {
  direction: "left" | "right";
  className?: string;
  size?: number;
};

/**
 * Arrow with stem + head. Light brush displacement keeps edges organic but readable.
 */
export function BrushNavArrow({
  direction,
  className = "",
  size = 40,
}: BrushNavArrowProps) {
  const rawId = useId();
  const filterId = `brush-arrow-${rawId.replace(/:/g, "")}`;

  // viewBox 0 0 40 40 — stem on y=20, tip ±8 vertically
  const arrowPath =
    direction === "left"
      ? "M29 20 H14 M14 20 L20.5 13.5 M14 20 L20.5 26.5"
      : "M11 20 H26 M26 20 L19.5 13.5 M26 20 L19.5 26.5";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <filter
          id={filterId}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="2"
            seed="4"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="0.55"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="0.08" result="soft" />
          <feMerge>
            <feMergeNode in="soft" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={arrowPath}
        filter={`url(#${filterId})`}
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navControlClass =
  "inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center bg-transparent p-1.5 text-ink transition-opacity hover:opacity-65 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 disabled:cursor-not-allowed disabled:opacity-30";

export { navControlClass };
