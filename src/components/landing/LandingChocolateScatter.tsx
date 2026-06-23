"use client";

import { AssetImage } from "@/components/ui/AssetImage";
import { getChocolateImageSrc } from "@/lib/assets";
import type { ChocolateShapeId, ChocolateType } from "@/types";

type ScatterItem = {
  type: ChocolateType;
  shapeId: ChocolateShapeId;
  left: string;
  top: string;
  /** Rendered size in px */
  size: number;
  /** Rotation in degrees */
  rot: number;
};

/**
 * Loose scatter around the edges — clear middle for title + button.
 * Sizes are explicit px so they don't balloon to the SVG's intrinsic dimensions.
 * Rotations are varied to look hand-scattered, not grid-stamped.
 */
const SCATTER: ScatterItem[] = [
  { type: "white",  shapeId: "heart",      left: "14%",  top: "16%", size: 136, rot: 0 },
  { type: "dark",   shapeId: "zigzag-egg", left: "32%",  top: "10%", size: 118, rot: 0 },
  { type: "milk",   shapeId: "swirl",      left: "58%",  top: "13%", size: 144, rot: 0 },
  { type: "white",  shapeId: "seahorse",   left: "80%",  top: "11%", size: 118, rot: 0 },
  { type: "dark",   shapeId: "flower",     left: "88%",  top: "34%", size: 138, rot: 0 },
  { type: "milk",   shapeId: "truffle",    left: "76%",  top: "22%", size: 110, rot: 0 },
  { type: "white",  shapeId: "gem",        left: "85%",  top: "58%", size: 120, rot: 0 },
  { type: "dark",   shapeId: "bear",       left: "80%",  top: "78%", size: 130, rot: 0 },
  { type: "milk",   shapeId: "bunny",      left: "62%",  top: "87%", size: 122, rot: 0 },
  { type: "white",  shapeId: "cake-slice", left: "40%",  top: "89%", size: 128, rot: 0 },
  { type: "dark",   shapeId: "cinnamon",   left: "20%",  top: "83%", size: 116, rot: 0 },
  { type: "milk",   shapeId: "pretzel",    left: "11%",  top: "68%", size: 132, rot: 0 },
  { type: "white",  shapeId: "ladybug",    left: "14%",  top: "46%", size: 112, rot: 0 },
  { type: "dark",   shapeId: "clamshell",  left: "11%",  top: "26%", size: 136, rot: 0 },
  { type: "milk",   shapeId: "swirl",      left: "70%",  top: "46%", size: 108, rot: 0 },
  { type: "white",  shapeId: "zigzag-egg", left: "26%",  top: "20%", size: 114, rot: 0 },
];

export function LandingChocolateScatter() {
  return (
    <div
      className="pointer-events-none absolute inset-[max(0.75rem,env(safe-area-inset-top))_max(0.625rem,env(safe-area-inset-right))_max(0.75rem,env(safe-area-inset-bottom))_max(0.625rem,env(safe-area-inset-left))] sm:inset-4 md:inset-6"
      aria-hidden
    >
      {SCATTER.map((item, index) => (
        <div
          key={`${item.type}-${item.shapeId}-${index}`}
          className="absolute"
          style={{
            left: item.left,
            top: item.top,
            transform: `translate(-50%, -50%) rotate(${item.rot}deg)`,
            width: item.size,
            height: item.size,
          }}
        >
          <AssetImage
            src={getChocolateImageSrc(item.type, item.shapeId)}
            alt=""
            width={item.size}
            height={item.size}
            className="h-full w-full object-contain"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
