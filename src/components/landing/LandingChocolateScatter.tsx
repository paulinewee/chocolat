"use client";

import { AssetImage } from "@/components/ui/AssetImage";
import { getChocolateImageSrc } from "@/lib/assets";
import type { ChocolateShapeId, ChocolateType } from "@/types";

type ScatterItem = {
  type: ChocolateType;
  shapeId: ChocolateShapeId;
  left: string;
  top: string;
  size: number;
  rotate: number;
};

/** Even ring around center — clear middle for title + button */
const SCATTER: ScatterItem[] = [
  { type: "white", shapeId: "heart", left: "50%", top: "11%", size: 18, rotate: -8 },
  { type: "milk", shapeId: "swirl", left: "74%", top: "16%", size: 20, rotate: 12 },
  { type: "dark", shapeId: "flower", left: "89%", top: "34%", size: 19, rotate: 18 },
  { type: "white", shapeId: "gem", left: "91%", top: "54%", size: 17, rotate: -14 },
  { type: "milk", shapeId: "bear", left: "84%", top: "72%", size: 18, rotate: 10 },
  { type: "dark", shapeId: "truffle", left: "68%", top: "86%", size: 17, rotate: -16 },
  { type: "white", shapeId: "bunny", left: "50%", top: "91%", size: 16, rotate: 6 },
  { type: "milk", shapeId: "cake-slice", left: "32%", top: "86%", size: 17, rotate: 14 },
  { type: "dark", shapeId: "pretzel", left: "16%", top: "72%", size: 17, rotate: -10 },
  { type: "white", shapeId: "ladybug", left: "9%", top: "54%", size: 18, rotate: 16 },
  { type: "milk", shapeId: "clamshell", left: "11%", top: "34%", size: 19, rotate: -12 },
  { type: "dark", shapeId: "zigzag-egg", left: "26%", top: "16%", size: 17, rotate: 8 },
];

export function LandingChocolateScatter() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {SCATTER.map((item, index) => (
        <div
          key={`${item.type}-${item.shapeId}-${index}`}
          className="absolute"
          style={{
            left: item.left,
            top: item.top,
            transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
          }}
        >
          <AssetImage
            src={getChocolateImageSrc(item.type, item.shapeId)}
            alt=""
            width={item.size}
            height={item.size}
            className="h-auto w-full opacity-100 drop-shadow-sm"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
