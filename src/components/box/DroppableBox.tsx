"use client";

import { useCallback } from "react";
import type { BoxShape, PlacedChocolate } from "@/types";
import { getChocolateDragData } from "@/lib/chocolate-drag";
import type { PendingChocolate } from "@/components/chocolate/ChocolatePicker";
import { ChocolatePiece } from "@/components/chocolate/ChocolatePiece";
import {
  BOX_CHOCOLATE_PX,
  BoxSlotDropLayer,
  BoxSlotLayer,
  BoxVisual,
  slotHitSizePx,
  type BoxSize,
} from "@/components/box/BoxVisual";

interface DroppableBoxProps {
  shape: BoxShape;
  color: string;
  chocolates: PlacedChocolate[];
  onChange: (chocolates: PlacedChocolate[]) => void;
  spotCount: number;
  size?: BoxSize;
  className?: string;
  pending?: PendingChocolate | null;
  onPendingPlaced?: () => void;
}

export function DroppableBox({
  shape,
  color,
  chocolates,
  onChange,
  spotCount,
  size = "xl",
  className = "",
  pending,
  onPendingPlaced,
}: DroppableBoxProps) {
  const isFilled = useCallback(
    (slotIndex: number) => chocolates.some((c) => c.slotIndex === slotIndex),
    [chocolates],
  );

  const placeChocolate = useCallback(
    (payload: { type: PlacedChocolate["type"]; shapeId: PlacedChocolate["shapeId"] }, slotIndex: number) => {
      const next = chocolates.filter((c) => c.slotIndex !== slotIndex);
      next.push({ slotIndex, type: payload.type, shapeId: payload.shapeId });
      onChange(next);
    },
    [chocolates, onChange],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleSlotDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const payload = getChocolateDragData(e);
    if (!payload) return;

    placeChocolate(payload, slotIndex);
  };

  const handleEmptySlotTap = (slotIndex: number) => {
    if (!pending || isFilled(slotIndex)) return;
    placeChocolate(pending, slotIndex);
    onPendingPlaced?.();
  };

  const removeFromSlot = (slotIndex: number) => {
    onChange(chocolates.filter((c) => c.slotIndex !== slotIndex));
  };

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col items-center overflow-hidden ${className}`}
    >
      <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
        <BoxVisual
          shape={shape}
          color={color}
          size={size}
          stacked
          className="mx-auto"
          dropOverlay={
          <BoxSlotDropLayer
            shape={shape}
            size={size}
            spotCount={spotCount}
            isFilled={isFilled}
            onDragOver={handleDragOver}
            onDrop={handleSlotDrop}
            onEmptySlotTap={pending ? handleEmptySlotTap : undefined}
          />
        }
      >
        <BoxSlotLayer shape={shape} size={size} spotCount={spotCount}>
          {(index) => {
            const placed = chocolates.find((c) => c.slotIndex === index);
            if (!placed) return null;

            const hit = slotHitSizePx(shape, index, size);

            return (
              <button
                type="button"
                onClick={() => removeFromSlot(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleSlotDrop(e, index)}
                className="relative z-10 flex min-h-11 min-w-11 touch-manipulation cursor-pointer items-center justify-center"
                style={{ width: hit, height: hit }}
                aria-label="Remove chocolate"
              >
                <ChocolatePiece
                  type={placed.type}
                  shapeId={placed.shapeId}
                  size="slot"
                  pixelSize={BOX_CHOCOLATE_PX[size]}
                />
              </button>
            );
          }}
        </BoxSlotLayer>
      </BoxVisual>
      </div>

      <p className="mt-2 shrink-0 px-2 pb-1 text-center font-mono text-[9px] leading-relaxed tracking-[0.14em] text-muted sm:text-[10px] sm:tracking-[0.18em] md:text-xs md:tracking-[0.2em]">
        <span className="sm:hidden">TAP A CHOCOLATE, THEN TAP A SLOT · TAP IN BOX TO REMOVE</span>
        <span className="hidden sm:inline">
          CLICK CHOCOLATE TO REMOVE OR DRAG IN A NEW CHOCOLATE TO REPLACE
        </span>
      </p>
    </div>
  );
}
