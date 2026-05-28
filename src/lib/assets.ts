import type { BoxShape, ChocolateShapeId, ChocolateType } from "@/types";
import { BOX_COLORS, type BoxAssetFolder } from "@/lib/data";

/** Bump when /public box or chocolate images change (cache bust via Image `key`) */
export const ASSET_VERSION =
  process.env.NEXT_PUBLIC_ASSET_VERSION ?? "20260527-svg7";

/** Internal shape id → filename prefix in /public/chocolates-svg */
export const CHOCOLATE_ASSET_NAMES: Record<ChocolateShapeId, string> = {
  heart: "heart",
  swirl: "swirl",
  flower: "flower",
  clamshell: "pearl",
  seahorse: "seahorse",
  "leaf-cake": "tart",
  cinnamon: "biscuit",
  "cake-slice": "pie",
  "zigzag-egg": "egg",
  bear: "bear",
  gem: "gem",
  truffle: "dome",
  bunny: "rabbit",
  pretzel: "ball",
  ladybug: "bug",
};

const TYPE_SUFFIX: Record<ChocolateType, string> = {
  white: "w",
  milk: "m",
  dark: "d",
};

const CHOCOLATE_DIR = "chocolates-svg";

export function getChocolateImageSrc(
  type: ChocolateType,
  shapeId: ChocolateShapeId,
): string {
  const name = CHOCOLATE_ASSET_NAMES[shapeId];
  return `/${CHOCOLATE_DIR}/${name}-${TYPE_SUFFIX[type]}.svg`;
}

/** Box shape → asset basename (square uses rect) */
export function getBoxAssetName(shape: BoxShape): string {
  return shape === "square" ? "rect" : shape;
}

export type BoxImageVariant = "full" | "base" | "top" | "ribbon";

export function getBoxImageSrc(
  shape: BoxShape,
  variant: BoxImageVariant = "full",
  colorHex?: string,
): string {
  const folder = getBoxColorFolder(colorHex);
  const name = getBoxAssetName(shape);
  if (variant === "full") return `/boxes/${folder}/${name}.svg`;
  return `/boxes/${folder}/${name}-${variant}.svg`;
}

/** Closed ribbon box with card slot (`*-ribbon-1.svg`; blue/yellow asset sets only). */
export function getBoxRibbon1Src(shape: BoxShape, colorHex?: string): string {
  const folder = getBoxColorFolder(colorHex);
  const name = getBoxAssetName(shape);
  return `/boxes/${folder}/${name}-ribbon-1.svg`;
}

export type LidVariant = "top" | "ribbon";

/** Resolves to `pink-svg`, `blue-svg`, or `yellow-svg` under /public/boxes */
export function getBoxColorFolder(colorHex?: string): `${BoxAssetFolder}-svg` {
  const match = BOX_COLORS.find((c) => c.value === colorHex);
  const base: BoxAssetFolder = match?.folder ?? "pink";
  return `${base}-svg`;
}

export const BOX_IMAGE_SIZES = {
  picker: { w: 320, h: 320 },
  md: { w: 520, h: 520 },
  lg: { w: 600, h: 600 },
  xl: { w: 640, h: 640 },
} as const;
