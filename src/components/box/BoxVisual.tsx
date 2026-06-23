"use client";

import type { ReactNode } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import type { BoxShape } from "@/types";
import type { LidVariant } from "@/lib/assets";
import {
  getBoxSlots,
  getSlotDropRenderOrder,
  slotContainerPosition,
} from "@/lib/box-slot-layouts";
import { BOX_IMAGE_SIZES, getBoxImageSrc } from "@/lib/assets";

export type BoxSize = "picker" | "md" | "lg" | "xl" | "fit";

const SIZE_CLASS: Record<BoxSize, string> = {
  picker: "w-48 aspect-square sm:w-52",
  md: "w-full max-w-[520px] aspect-square",
  lg: "w-full max-w-[600px] aspect-square",
  xl: "aspect-square w-full min-w-0 max-w-[min(100%,min(92vw,680px))]",
  fit: "aspect-square h-full max-h-full w-auto max-w-full min-h-0 min-w-0",
};

const IMAGE_DIM: Record<BoxSize, { w: number; h: number }> = {
  picker: BOX_IMAGE_SIZES.picker,
  md: BOX_IMAGE_SIZES.md,
  lg: BOX_IMAGE_SIZES.lg,
  xl: BOX_IMAGE_SIZES.xl,
  fit: BOX_IMAGE_SIZES.xl,
};

export const BOX_CHOCOLATE_PX: Record<BoxSize, number> = {
  picker: 0,
  md: 68,
  lg: 78,
  xl: 118,
  fit: 118,
};

/** Nudge slot contents downward (px) so chocolates sit in tray wells */
export const SLOT_NUDGE_Y_PX: Record<BoxSize, number> = {
  picker: 0,
  md: 10,
  lg: 12,
  xl: 15,
  fit: 15,
};

const SLOT_HIT_PX: Record<BoxSize, number> = {
  picker: 0,
  md: 56,
  lg: 64,
  xl: 76,
  fit: 76,
};

/** Corner wells (esp. top-right) sit under the lid rim — use a larger drop target */
export function slotHitSizePx(shape: BoxShape, slotIndex: number, size: BoxSize): number {
  const base = SLOT_HIT_PX[size];
  if (!base) return 0;
  const slot = getBoxSlots(shape)[slotIndex];
  if (!slot) return base;
  if (shape === "flower" && slotIndex === 0) return Math.round(base * 1.15);
  const isUpperCorner = slot.x >= 62 && slot.y <= 42;
  const isLowerTip = shape !== "flower" && slot.y >= 62;
  if (isUpperCorner || isLowerTip) return Math.round(base * 1.3);
  return base;
}

const LAYER_IMAGE_CLASS =
  "pointer-events-none absolute inset-0 h-full w-full object-contain object-center";

function lidImageSrc(shape: BoxShape, lidVariant: LidVariant, color?: string) {
  return getBoxImageSrc(shape, lidVariant === "ribbon" ? "ribbon" : "top", color);
}

interface BoxVisualProps {
  shape: BoxShape;
  color?: string;
  size?: BoxSize;
  variant?: "full" | "base" | "top" | "ribbon";
  stacked?: boolean;
  lidVariant?: LidVariant;
  className?: string;
  children?: ReactNode;
  showLid?: boolean;
  onLidClick?: () => void;
  lidLifted?: boolean;
  /** Animate ribbon lid settling back onto the box */
  lidSettling?: boolean;
  /** Remove lid layer entirely (after lift animation) */
  hideLid?: boolean;
  /** Stacked mode: [shape]-top frame above chocolates (open box rim). */
  showTopFrame?: boolean;
  /** Invisible per-slot drop targets rendered above the lid (z-[4]) */
  dropOverlay?: ReactNode;
}

export function BoxVisual({
  shape,
  color,
  size = "md",
  variant = "full",
  stacked = false,
  lidVariant = "top",
  className = "",
  children,
  showLid,
  onLidClick,
  lidLifted,
  lidSettling = false,
  hideLid = false,
  showTopFrame = false,
  dropOverlay,
}: BoxVisualProps) {
  const dims = IMAGE_DIM[size];
  const lidSrc = lidImageSrc(shape, lidVariant, color);

  const renderLidLayer = (zClass: string, interactive: boolean) => {
    if (interactive && onLidClick && !lidLifted) {
      return (
        <button
          type="button"
          onClick={onLidClick}
          className={`absolute inset-0 ${zClass} cursor-pointer`}
          aria-label="Open the box"
        >
              <AssetImage
                src={lidSrc}
                alt=""
                width={dims.w}
                height={dims.h}
                className={LAYER_IMAGE_CLASS}
                draggable={false}
              />
        </button>
      );
    }

    return (
      <div
        className={`absolute inset-0 ${zClass} ${lidLifted && !lidSettling ? "lid-lifted" : ""} ${lidSettling ? "lid-settling" : ""} pointer-events-none`}
      >
        <AssetImage
          src={lidSrc}
          alt=""
          width={dims.w}
          height={dims.h}
          className={LAYER_IMAGE_CLASS}
          draggable={false}
        />
      </div>
    );
  };

  if (stacked) {
    return (
      <div className={`relative isolate ${SIZE_CLASS[size]} ${className}`}>
        <AssetImage
          src={getBoxImageSrc(shape, "base", color)}
          alt=""
          width={dims.w}
          height={dims.h}
          className={`${LAYER_IMAGE_CLASS} z-[1]`}
          priority
          draggable={false}
        />

        {children && (
          <div className="pointer-events-none absolute inset-0 z-[2]">
            <div className="pointer-events-auto relative h-full w-full">
              {children}
            </div>
          </div>
        )}

        {showTopFrame && (
          <div className="pointer-events-none absolute inset-0 z-[3]">
            <AssetImage
              src={getBoxImageSrc(shape, "top", color)}
              alt=""
              width={dims.w}
              height={dims.h}
              className={LAYER_IMAGE_CLASS}
              draggable={false}
            />
          </div>
        )}

        {!hideLid &&
          renderLidLayer(showTopFrame ? "z-[4]" : "z-[3]", !!onLidClick)}

        {dropOverlay && (
          <div className="pointer-events-none absolute inset-0 z-[4]">
            <div className="relative h-full w-full">{dropOverlay}</div>
          </div>
        )}
      </div>
    );
  }

  const src = getBoxImageSrc(shape, variant, color);

  return (
    <div className={`relative ${SIZE_CLASS[size]} ${className}`}>
      <AssetImage
        src={src}
        alt=""
        width={dims.w}
        height={dims.h}
        className="h-full w-full object-contain object-center"
        priority={size === "picker"}
        draggable={false}
      />

      {children && <div className="absolute inset-0 z-10">{children}</div>}

      {showLid && renderLidLayer("z-20", !!onLidClick)}
    </div>
  );
}

export function BoxSlotDropLayer({
  shape,
  size = "md",
  spotCount,
  onDragOver,
  onDrop,
  onEmptySlotTap,
  /** Filled slots use pointer-events-none so clicks reach chocolates below (z-[2]). */
  isFilled,
}: {
  shape: BoxShape;
  size?: BoxSize;
  spotCount?: number;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, slotIndex: number) => void;
  onEmptySlotTap?: (slotIndex: number) => void;
  isFilled?: (slotIndex: number) => boolean;
}) {
  const slots = getBoxSlots(shape);
  const count = spotCount ?? slots.length;
  const nudgeY = SLOT_NUDGE_Y_PX[size];
  const renderOrder = getSlotDropRenderOrder(shape, count);

  return (
    <div className="relative h-full w-full">
      {renderOrder.map((index) => {
        const { left, top } = slotContainerPosition(shape, index);
        const hit = slotHitSizePx(shape, index, size);
        const filled = isFilled?.(index) ?? false;
        return (
          <div
            key={index}
            className={`absolute ${filled ? "pointer-events-none touch-none" : "pointer-events-auto touch-manipulation"}`}
            style={{
              left,
              top,
              width: hit,
              height: hit,
              transform: `translate(-50%, calc(-50% + ${nudgeY}px))`,
            }}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            onClick={
              !filled && onEmptySlotTap
                ? () => onEmptySlotTap(index)
                : undefined
            }
            aria-label={`Drop chocolate in slot ${index + 1}`}
          />
        );
      })}
    </div>
  );
}

export function BoxSlotLayer({
  shape,
  size = "md",
  spotCount,
  children,
}: {
  shape: BoxShape;
  size?: BoxSize;
  spotCount?: number;
  children: (slotIndex: number) => ReactNode;
}) {
  const slots = getBoxSlots(shape);
  const count = spotCount ?? slots.length;

  return (
    <div className="relative h-full w-full">
      {Array.from({ length: count }, (_, index) => {
        const { left, top } = slotContainerPosition(shape, index);
        const nudgeY = SLOT_NUDGE_Y_PX[size];
        return (
          <div
            key={index}
            className="absolute z-0"
            style={{
              left,
              top,
              transform: `translate(-50%, calc(-50% + ${nudgeY}px))`,
            }}
          >
            {children(index)}
          </div>
        );
      })}
    </div>
  );
}
