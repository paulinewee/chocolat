import type { BoxShape, ChocolateShapeId, ChocolateType } from "@/types";

/** Which /public/boxes/{folder}-svg asset set to use (box art is per family, not per swatch hex). */
export type BoxAssetFolder = "pink" | "blue" | "yellow";

export const BOX_COLORS: {
  id: string;
  label: string;
  value: string;
  folder: BoxAssetFolder;
}[] = [
  { id: "pink", label: "Pink", value: "#f4c4c8", folder: "pink" },
  { id: "blue", label: "Blue", value: "#8eb8e0", folder: "blue" },
  { id: "yellow", label: "Yellow", value: "#f0e8b8", folder: "yellow" },
];

export const BOX_SHAPES: {
  id: BoxShape;
  label: string;
  spots: number;
}[] = [
  { id: "circle", label: "Circle", spots: 7 },
  { id: "square", label: "Square", spots: 9 },
  { id: "flower", label: "Flower", spots: 6 },
  { id: "heart", label: "Heart", spots: 8 },
  { id: "butterfly", label: "Butterfly", spots: 9 },
];

export const CHOCOLATE_SHAPES: { id: ChocolateShapeId; label: string; emoji: string }[] = [
  { id: "heart", label: "Heart", emoji: "♥" },
  { id: "swirl", label: "Swirl", emoji: "◎" },
  { id: "flower", label: "Flower", emoji: "✿" },
  { id: "clamshell", label: "Clam", emoji: "◠" },
  { id: "seahorse", label: "Seahorse", emoji: "🌊" },
  { id: "leaf-cake", label: "Leaf cake", emoji: "🍃" },
  { id: "cinnamon", label: "Cinnamon", emoji: "🌀" },
  { id: "cake-slice", label: "Cake slice", emoji: "△" },
  { id: "zigzag-egg", label: "Egg", emoji: "◉" },
  { id: "bear", label: "Bear", emoji: "🐻" },
  { id: "gem", label: "Gem", emoji: "◇" },
  { id: "truffle", label: "Truffle", emoji: "●" },
  { id: "bunny", label: "Bunny", emoji: "🐰" },
  { id: "pretzel", label: "Pretzel", emoji: "∞" },
  { id: "ladybug", label: "Ladybug", emoji: "•" },
];

export const CHOCOLATE_TYPES: ChocolateType[] = ["white", "milk", "dark"];
