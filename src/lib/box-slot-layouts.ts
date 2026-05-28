import type { BoxShape } from "@/types";

/**
 * Slot centers as % of the box asset (top-left origin).
 * Calibrated from /public/boxes/pink-svg/{shape}-top.svg transparent wells.
 */
export interface BoxSlotConfig {
  slots: { x: number; y: number }[];
}

export const BOX_SLOT_CONFIGS: Record<BoxShape, BoxSlotConfig> = {
  circle: {
    slots: [
      { x: 36.8, y: 22.2 }, // top left
      { x: 65.1, y: 21.8 }, // top right
      { x: 21.9, y: 41.7 }, // middle left
      { x: 50.4, y: 41.1 }, // middle center
      { x: 77.9, y: 41.4 }, // middle right
      { x: 32.9, y: 61.8 }, // bottom left
      { x: 62.8, y: 61.7 }, // bottom right
    ],
  },
  square: {
    slots: [
      { x: 20.0, y: 22.5 },
      { x: 45.0, y: 21.9 },
      { x: 69.0, y: 22.4 },
      { x: 24.2, y: 43.6 },
      { x: 48.6, y: 42.8 },
      { x: 72.4, y: 43.9 },
      { x: 30.8, y: 63.3 },
      { x: 55.1, y: 62.5 },
      { x: 79.9, y: 63.2 },
    ],
  },
  flower: {
    slots: [
      { x: 51.5, y: 41.5 }, // center (petals are indices 1–5)
      { x: 47.8, y: 23.2 },
      { x: 72.9, y: 35.0 },
      { x: 71.8, y: 56.6 },
      { x: 43.4, y: 61.2 },
      { x: 27.1, y: 38.1 },
    ],
  },
  heart: {
    slots: [
      { x: 76.7, y: 14.7 },
      { x: 23.6, y: 19.7 },
      { x: 48.6, y: 33.6 },
      { x: 76.9, y: 34.6 },
      { x: 21.4, y: 39.4 },
      { x: 65.6, y: 52.6 },
      { x: 37.1, y: 55.1 },
      { x: 51.1, y: 70.6 }, // bottom tip (not merged area at ~50%, 74%)
    ],
  },
  butterfly: {
    slots: [
      { x: 51.4, y: 37.2 }, // center body (not the lower-wing merge at ~49%, 73%)
      { x: 17.6, y: 19.2 },
      { x: 82.8, y: 14.6 },
      { x: 26.1, y: 35.3 },
      { x: 75.7, y: 31.4 },
      { x: 40.3, y: 53.8 },
      { x: 67.9, y: 50.3 },
      { x: 27.5, y: 69.2 },
      { x: 79.9, y: 65.7 },
    ],
  },
};

export function slotContainerPosition(
  shape: BoxShape,
  slotIndex: number,
): { left: string; top: string } {
  const slot = BOX_SLOT_CONFIGS[shape].slots[slotIndex];
  if (!slot) return { left: "50%", top: "50%" };
  return { left: `${slot.x}%`, top: `${slot.y}%` };
}

export function getBoxSlots(shape: BoxShape) {
  return BOX_SLOT_CONFIGS[shape].slots;
}

/** Center wells overlap petal hit targets — paint them last for drag/drop. */
const CENTER_SLOT_INDEX: Partial<Record<BoxShape, number>> = {
  flower: 0,
  butterfly: 0,
};

export function getSlotDropRenderOrder(shape: BoxShape, count: number): number[] {
  const center = CENTER_SLOT_INDEX[shape];
  const indices = Array.from({ length: count }, (_, i) => i);
  if (center === undefined || center >= count) return indices;
  return [...indices.filter((i) => i !== center), center];
}
