"use client";

import { messageHasContent } from "@/lib/message-utils";
import type { BoxShape, ChocolateMessage, PlacedChocolate } from "@/types";
import { ChocolatePiece } from "@/components/chocolate/ChocolatePiece";
import {
  BOX_CHOCOLATE_PX,
  BoxSlotLayer,
  BoxVisual,
  type BoxSize,
} from "@/components/box/BoxVisual";

interface MessageBoxProps {
  shape: BoxShape;
  color: string;
  chocolates: PlacedChocolate[];
  messages: ChocolateMessage[];
  spotCount: number;
  onChocolateClick: (slotIndex: number) => void;
  activeSlot?: number | null;
  animatingOutSlot?: number | null;
  animatingInSlot?: number | null;
  size?: BoxSize;
  className?: string;
}

export function MessageBox({
  shape,
  color,
  chocolates,
  messages,
  spotCount,
  onChocolateClick,
  activeSlot = null,
  animatingOutSlot = null,
  animatingInSlot = null,
  size = "xl",
  className = "",
}: MessageBoxProps) {
  const getMessage = (index: number) =>
    messages.find((m) => m.slotIndex === index);

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col items-center overflow-x-hidden overflow-y-visible ${className}`}
    >
      <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-visible px-1">
        <BoxVisual shape={shape} color={color} size={size} stacked className="mx-auto">
          <BoxSlotLayer shape={shape} size={size} spotCount={spotCount}>
            {(index) => {
              const placed = chocolates.find((c) => c.slotIndex === index);
              if (!placed) return null;
              if (activeSlot === index && animatingInSlot !== index) return null;
              const hasMessage = messageHasContent(getMessage(index));
              const outAnim = animatingOutSlot === index;
              const inAnim = animatingInSlot === index;
              return (
                <div
                  className={`relative flex items-center justify-center ${outAnim ? "message-slot-anim-out" : ""} ${inAnim ? "message-slot-anim-in" : ""}`}
                >
                  {hasMessage && (
                    <svg
                      aria-hidden
                      className="pointer-events-none absolute z-0 h-[72%] w-[98%] overflow-visible"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <filter id="brush-box" x="-10%" y="-10%" width="120%" height="120%">
                          <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.035 0.055"
                            numOctaves="4"
                            seed="11"
                            result="noise"
                          />
                          <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale="4"
                            xChannelSelector="R"
                            yChannelSelector="G"
                          />
                        </filter>
                      </defs>
                      {/* Fill */}
                      <rect x="0" y="0" width="100" height="100" fill="rgba(255,255,255,0.82)" />
                      {/* Hand-drawn brush border */}
                      <rect
                        x="4" y="4" width="92" height="92"
                        fill="none"
                        stroke="#361700"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#brush-box)"
                      />
                    </svg>
                  )}
                  <ChocolatePiece
                    type={placed.type}
                    shapeId={placed.shapeId}
                    size="slot"
                    pixelSize={BOX_CHOCOLATE_PX[size]}
                    interactive
                    hasMessage={false}
                    onClick={() => onChocolateClick(index)}
                    className="relative z-[1]"
                  />
                </div>
              );
            }}
          </BoxSlotLayer>
        </BoxVisual>
      </div>
    </div>
  );
}
