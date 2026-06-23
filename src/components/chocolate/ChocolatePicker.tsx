"use client";

import { useState } from "react";
import type { ChocolateShapeId, ChocolateType } from "@/types";
import { CHOCOLATE_SHAPES, CHOCOLATE_TYPES } from "@/lib/data";
import { setChocolateDragData } from "@/lib/chocolate-drag";
import { ChocolatePiece } from "./ChocolatePiece";

/** Cell size for the picker tiles */
const PICK_GRID_PX = 110;

/** Approximate swatch color for each chocolate type */
const CHOCOLATE_TYPE_COLORS: Record<ChocolateType, string> = {
  white: "#f0e8d8",
  milk: "#c48a52",
  dark: "#5c3220",
};

/** Deterministic per-tile jitter so pieces look hand-placed, not gridded */
function organicTransform(index: number): string {
  const rot = ((index * 37) % 21) - 10; // -10..10 deg
  const dy = ((index * 53) % 23) - 11;  // -11..11 px
  const dx = ((index * 29) % 19) - 9;   // -9..9 px
  return `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
}

export type PendingChocolate = {
  type: ChocolateType;
  shapeId: ChocolateShapeId;
};

interface ChocolatePickerProps {
  pending?: PendingChocolate | null;
  onSelect?: (type: ChocolateType, shapeId: ChocolateShapeId) => void;
}

function ShapeGrid({
  type,
  pending,
  onSelect,
  onDragStart,
}: {
  type: ChocolateType;
  pending?: PendingChocolate | null;
  onSelect: (type: ChocolateType, shapeId: ChocolateShapeId) => void;
  onDragStart: (e: React.DragEvent, type: ChocolateType, shapeId: ChocolateShapeId) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8">
      {CHOCOLATE_SHAPES.map((shape, index) => {
        const isPending =
          pending?.type === type && pending.shapeId === shape.id;
        return (
          <button
            key={`${type}-${shape.id}`}
            type="button"
            onClick={() => onSelect(type, shape.id)}
            className={`group/choc relative mx-auto flex touch-manipulation items-center justify-center rounded-full outline-none transition-transform duration-200 ease-out hover:z-10 hover:-translate-y-2 focus-visible:z-10 focus-visible:-translate-y-2 ${
              isPending ? "z-10 -translate-y-1" : ""
            }`}
            style={{ width: PICK_GRID_PX, height: PICK_GRID_PX }}
            aria-pressed={isPending}
            aria-label={`Select ${shape.label} ${type} chocolate`}
          >
            <span
              className="flex h-full w-full items-center justify-center transition-transform duration-200 ease-out group-hover/choc:rotate-0 group-focus-visible/choc:rotate-0"
              style={{ transform: organicTransform(index) }}
            >
              <ChocolatePiece
                type={type}
                shapeId={shape.id}
                size="pick"
                pixelSize={PICK_GRID_PX}
                draggable
                onDragStart={(e) => onDragStart(e, type, shape.id)}
              />
            </span>

            <span
              className={`pointer-events-none absolute -top-2 left-1/2 z-20 -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded-full border border-ink/15 bg-cream px-2 py-0.5 text-[10px] leading-tight tracking-[0.04em] text-ink opacity-0 shadow-sm transition-all duration-200 ease-out [-webkit-text-stroke:0] group-hover/choc:-translate-y-0 group-hover/choc:opacity-100 group-focus-visible/choc:-translate-y-0 group-focus-visible/choc:opacity-100 ${
                isPending ? "opacity-100" : ""
              }`}
            >
              {shape.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ChocolatePicker({ pending, onSelect }: ChocolatePickerProps) {
  const [activeType, setActiveType] = useState<ChocolateType>("white");
  const [prevType, setPrevType] = useState<ChocolateType | null>(null);

  const handleTypeChange = (type: ChocolateType) => {
    if (type === activeType) return;
    setPrevType(activeType);
    setActiveType(type);
  };

  const handleDragStart = (
    e: React.DragEvent,
    type: ChocolateType,
    shapeId: ChocolateShapeId,
  ) => {
    setChocolateDragData(e, { type, shapeId });
  };

  const handleSelect = (type: ChocolateType, shapeId: ChocolateShapeId) => {
    onSelect?.(type, shapeId);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Type tabs — colored circles like the box color picker */}
      <div className="mb-3 flex shrink-0 items-center justify-center gap-3 py-1 sm:mb-4 sm:gap-3.5">
        {CHOCOLATE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleTypeChange(type)}
            aria-label={type}
            aria-pressed={activeType === type}
            className={`h-9 w-9 touch-manipulation rounded-full border-2 transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-8 sm:w-8 md:h-7 md:w-7 ${
              activeType === type
                ? "scale-110 border-ink"
                : "border-ink/20 hover:border-ink/40"
            }`}
            style={{ backgroundColor: CHOCOLATE_TYPE_COLORS[type] }}
          />
        ))}
      </div>

      {pending && (
        <p className="mb-2 shrink-0 text-center text-[11px] tracking-[0.04em] text-muted sm:text-xs">
          tap a slot in the box to place this chocolate
        </p>
      )}

      {/* Cross-fading section — only one type visible at a time */}
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
        {/* Active section fades in */}
        <section
          key={`active-${activeType}`}
          className="px-1 pb-6 pt-7 sm:pb-8 animate-[asset-fade-in_280ms_ease-out_forwards]"
        >
          <ShapeGrid
            type={activeType}
            pending={pending}
            onSelect={handleSelect}
            onDragStart={handleDragStart}
          />
        </section>

        {/* Previous section fades out on top */}
        {prevType && (
          <section
            key={`fading-${prevType}`}
            aria-hidden
            className="pointer-events-none absolute inset-0 px-1 pb-6 pt-7 sm:pb-8 animate-[asset-fade-out_280ms_ease-out_forwards]"
            onAnimationEnd={() => setPrevType(null)}
          >
            <ShapeGrid
              type={prevType}
              pending={pending}
              onSelect={handleSelect}
              onDragStart={handleDragStart}
            />
          </section>
        )}
      </div>
    </div>
  );
}
