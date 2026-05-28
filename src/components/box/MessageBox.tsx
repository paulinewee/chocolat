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
      <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-x-hidden overflow-y-visible">
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
                    <span
                      aria-hidden
                      className="pointer-events-none absolute z-0 h-[72%] w-[98%] rounded-sm bg-white/80"
                    />
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
