"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChocolateShapeId, ChocolateType } from "@/types";
import { CHOCOLATE_SHAPES, CHOCOLATE_TYPES } from "@/lib/data";
import { setChocolateDragData } from "@/lib/chocolate-drag";
import { ChocolatePiece } from "./ChocolatePiece";

/** Grid cell size for the 3×5 picker */
const PICK_GRID_PX = 88;

export type PendingChocolate = {
  type: ChocolateType;
  shapeId: ChocolateShapeId;
};

interface ChocolatePickerProps {
  pending?: PendingChocolate | null;
  onSelect?: (type: ChocolateType, shapeId: ChocolateShapeId) => void;
}

export function ChocolatePicker({ pending, onSelect }: ChocolatePickerProps) {
  const [activeType, setActiveType] = useState<ChocolateType>("white");
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<ChocolateType, HTMLElement | null>>({
    white: null,
    milk: null,
    dark: null,
  });
  const jumpLock = useRef(false);

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

  const scrollToType = useCallback((type: ChocolateType) => {
    const container = scrollRef.current;
    const section = sectionRefs.current[type];
    if (!container || !section) return;

    jumpLock.current = true;
    setActiveType(type);
    container.scrollTo({ top: section.offsetTop, behavior: "smooth" });
    window.setTimeout(() => {
      jumpLock.current = false;
    }, 700);
  }, []);

  useEffect(() => {
    const root = scrollRef.current;
    const sections = CHOCOLATE_TYPES.map((type) => sectionRefs.current[type]).filter(
      Boolean,
    ) as HTMLElement[];

    if (!root || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (jumpLock.current) return;

        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const best = visible.reduce((current, entry) =>
          entry.intersectionRatio > current.intersectionRatio ? entry : current,
        );

        const type = best.target.getAttribute("data-chocolate-type") as ChocolateType | null;
        if (type) setActiveType(type);
      },
      {
        root,
        rootMargin: "-4px 0px -45% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex shrink-0 gap-1.5 py-1 sm:mb-4 sm:gap-2">
        {CHOCOLATE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => scrollToType(type)}
            className={`min-h-11 touch-manipulation px-3 py-2.5 font-mono text-[10px] tracking-[0.16em] transition-colors sm:px-4 sm:text-xs sm:tracking-[0.2em] ${
              activeType === type
                ? "text-ink underline underline-offset-4"
                : "text-muted hover:text-ink/70"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {pending && (
        <p className="mb-2 shrink-0 text-center font-serif text-[11px] tracking-[0.04em] text-muted sm:text-xs">
          Tap a slot in the box to place this chocolate
        </p>
      )}

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
      >
        {CHOCOLATE_TYPES.map((type) => (
          <section
            key={type}
            id={`picker-${type}`}
            data-chocolate-type={type}
            ref={(node) => {
              sectionRefs.current[type] = node;
            }}
            className="pb-6 last:pb-3 sm:pb-8 sm:last:pb-4"
          >
            <div className="grid w-full max-w-md grid-cols-3 justify-items-center gap-x-1 gap-y-2 sm:max-w-lg sm:gap-x-3 sm:gap-y-4 lg:max-w-xl">
              {CHOCOLATE_SHAPES.map((shape) => {
                const isPending =
                  pending?.type === type && pending.shapeId === shape.id;
                return (
                  <button
                    key={`${type}-${shape.id}`}
                    type="button"
                    onClick={() => handleSelect(type, shape.id)}
                    className={`flex touch-manipulation items-center justify-center rounded-sm transition-shadow ${
                      isPending ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : ""
                    }`}
                    style={{ width: PICK_GRID_PX, height: PICK_GRID_PX }}
                    aria-pressed={isPending}
                    aria-label={`Select ${shape.label} ${type} chocolate`}
                  >
                    <ChocolatePiece
                      type={type}
                      shapeId={shape.id}
                      size="pick"
                      pixelSize={PICK_GRID_PX}
                      draggable
                      onDragStart={(e) => handleDragStart(e, type, shape.id)}
                    />
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
