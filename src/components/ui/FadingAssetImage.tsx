"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ASSET_VERSION } from "@/lib/assets";
import {
  PROTECTED_IMAGE_CLASS,
  mergeImageProtectionHandlers,
  preventImageContextMenu,
  preventImageDragStart,
} from "@/lib/image-protection";

function isSvgSrc(src: ImageProps["src"]): boolean {
  return typeof src === "string" && src.endsWith(".svg");
}

function srcKey(src: ImageProps["src"]): string {
  return typeof src === "string" ? src : JSON.stringify(src);
}

/**
 * Drop-in replacement for AssetImage that cross-fades between the old and new
 * image whenever `src` changes.  The container must have a defined size
 * (e.g. `aspect-square` or explicit dimensions) for the absolute overlay to
 * work correctly.
 */
export function FadingAssetImage({
  src,
  alt = "",
  className = "",
  containerClassName = "",
  style,
  draggable = false,
  onContextMenu,
  onDragStart,
  width,
  height,
  ...props
}: ImageProps & { containerClassName?: string }) {
  const [cur, setCur] = useState(src);
  const [prev, setPrev] = useState<ImageProps["src"] | null>(null);

  useEffect(() => {
    if (srcKey(src) === srcKey(cur)) return;
    setPrev(cur);
    setCur(src);
  }, [src, cur]);

  const shared: Omit<ImageProps, "src" | "className"> = {
    alt: alt ?? "",
    width: width as number,
    height: height as number,
    unoptimized: isSvgSrc(src),
    draggable,
    onContextMenu: mergeImageProtectionHandlers(
      preventImageContextMenu,
      onContextMenu,
    ),
    onDragStart: mergeImageProtectionHandlers(
      preventImageDragStart,
      onDragStart,
    ),
    ...props,
  };

  const imgCls = `${PROTECTED_IMAGE_CLASS} h-full w-full object-contain ${className}`.trim();

  return (
    <div className={`relative ${containerClassName}`} style={style}>
      {/* New image underneath — always fully visible */}
      <Image
        key={`cur-${srcKey(cur)}-${ASSET_VERSION}`}
        src={cur}
        className={imgCls}
        {...shared}
      />
      {/* Previous image on top, fading out */}
      {prev && (
        <Image
          key={`prev-${srcKey(prev)}-${ASSET_VERSION}`}
          src={prev}
          className={`${imgCls} absolute inset-0 animate-[asset-fade-out_380ms_ease-out_forwards]`}
          onAnimationEnd={() => setPrev(null)}
          {...shared}
        />
      )}
    </div>
  );
}
