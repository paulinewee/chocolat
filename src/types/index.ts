export type BoxShape = "circle" | "square" | "flower" | "heart" | "butterfly";

export type ChocolateType = "white" | "milk" | "dark";

export type ChocolateShapeId =
  | "heart"
  | "swirl"
  | "flower"
  | "clamshell"
  | "seahorse"
  | "leaf-cake"
  | "cinnamon"
  | "cake-slice"
  | "zigzag-egg"
  | "bear"
  | "gem"
  | "truffle"
  | "bunny"
  | "pretzel"
  | "ladybug";

export interface PlacedChocolate {
  slotIndex: number;
  type: ChocolateType;
  shapeId: ChocolateShapeId;
}

export interface ChocolateMessage {
  slotIndex: number;
  html: string;
  mapUrl?: string;
  spotifyUrl?: string;
  imageUrl?: string;
}

export interface BoxDraft {
  id: string;
  boxShape: BoxShape;
  boxColor: string;
  chocolates: PlacedChocolate[];
  messages: ChocolateMessage[];
  cardText: string;
  createdAt: string;
}

export const BOX_SPOT_COUNTS: Record<BoxShape, number> = {
  circle: 7,
  square: 9,
  flower: 6,
  heart: 8,
  butterfly: 9,
};
