"use client";

import type { ChocolateShapeId, ChocolateType } from "@/types";
import { CHOCOLATE_SHAPES } from "@/lib/data";
import { getChocolateImageSrc } from "@/lib/assets";
import {
  PROTECTED_IMAGE_CLASS,
  preventImageContextMenu,
  preventImageDragStart,
} from "@/lib/image-protection";
import { AssetImage } from "@/components/ui/AssetImage";

interface ChocolatePieceProps {
  type: ChocolateType;
  shapeId: ChocolateShapeId;
  size?: "grid" | "slot" | "lg" | "pick";
  /** Override rendered size in px (e.g. per-box calibration) */
  pixelSize?: number;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  interactive?: boolean;
  onClick?: () => void;
  hasMessage?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_PX = {
  grid: 88,
  slot: 72,
  lg: 80,
  pick: 76,
} as const;

export function ChocolatePiece({
  type,
  shapeId,
  size = "grid",
  pixelSize,
  draggable,
  onDragStart,
  interactive,
  onClick,
  hasMessage,
  className = "",
  style,
}: ChocolatePieceProps) {
  const shape = CHOCOLATE_SHAPES.find((s) => s.id === shapeId);
  const px = pixelSize ?? SIZE_PX[size];
  const src = getChocolateImageSrc(type, shapeId);

  const Component = draggable ? "div" : interactive || onClick ? "button" : "div";

  const handleDragStart = (e: React.DragEvent) => {
    const img = (e.currentTarget as HTMLElement).querySelector("img");
    if (img) {
      e.dataTransfer.setDragImage(img, px / 2, px / 2);
    }
    onDragStart?.(e);
  };

  const isClickable = !!(interactive || onClick);
  const showHoverHalo = isClickable;

  return (
    <Component
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
      onClick={onClick}
      type={isClickable ? "button" : undefined}
      className={`
        group relative flex shrink-0 items-center justify-center select-none bg-transparent
        ${draggable ? "cursor-grab active:cursor-grabbing" : ""}
        ${isClickable ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20" : ""}
        ${className}
      `}
      style={style}
      title={shape?.label}
    >
      {showHoverHalo && (
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 opacity-0 shadow-[inset_0_0_0_1px_rgb(26_26_26/0.05)] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ width: px * 1.08, height: px * 1.08 }}
          aria-hidden
        />
      )}
      {draggable ? (
        <span className="relative z-[1]" style={{ width: px, height: px }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={shape?.label ?? "Chocolate"}
            width={px}
            height={px}
            draggable={false}
            onContextMenu={preventImageContextMenu}
            onDragStart={preventImageDragStart}
            className={`h-auto w-full bg-transparent object-contain ${PROTECTED_IMAGE_CLASS}`}
            style={{ width: px, height: px }}
          />
        </span>
      ) : (
        <AssetImage
          src={src}
          alt={shape?.label ?? "Chocolate"}
          width={px}
          height={px}
          className={`relative z-[1] h-auto w-full bg-transparent object-contain ${PROTECTED_IMAGE_CLASS}`}
          style={{ width: px, height: px }}
        />
      )}
      {hasMessage && (
        <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border border-white bg-rose-400 shadow-sm" />
      )}
    </Component>
  );
}
