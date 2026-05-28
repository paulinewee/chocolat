"use client";

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

/** Local /public asset image with version key for cache busting (no query string). */
export function AssetImage({
  src,
  alt = "",
  className = "",
  draggable = false,
  onContextMenu,
  onDragStart,
  ...props
}: ImageProps) {
  const srcKey = typeof src === "string" ? src : "";
  const svg = isSvgSrc(src);

  return (
    <Image
      key={`${srcKey}-${ASSET_VERSION}`}
      src={src}
      alt={alt}
      unoptimized={svg}
      draggable={draggable}
      onContextMenu={mergeImageProtectionHandlers(
        preventImageContextMenu,
        onContextMenu,
      )}
      onDragStart={mergeImageProtectionHandlers(
        preventImageDragStart,
        onDragStart,
      )}
      className={`${PROTECTED_IMAGE_CLASS} ${className}`.trim()}
      {...props}
    />
  );
}
