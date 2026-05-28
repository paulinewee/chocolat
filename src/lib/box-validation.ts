import { BOX_COLORS, CHOCOLATE_SHAPES, CHOCOLATE_TYPES } from "@/lib/data";
import { messageHasContent } from "@/lib/message-utils";
import type {
  BoxDraft,
  BoxShape,
  ChocolateMessage,
  ChocolateShapeId,
  ChocolateType,
  PlacedChocolate,
} from "@/types";
import { BOX_SPOT_COUNTS } from "@/types";

const BOX_SHAPES = Object.keys(BOX_SPOT_COUNTS) as BoxShape[];
const VALID_TYPES = new Set<string>(CHOCOLATE_TYPES);
const VALID_SHAPE_IDS = new Set<string>(CHOCOLATE_SHAPES.map((s) => s.id));

export function isBoxShape(value: unknown): value is BoxShape {
  return typeof value === "string" && BOX_SHAPES.includes(value as BoxShape);
}

export function isValidChocolateType(value: unknown): value is ChocolateType {
  return typeof value === "string" && VALID_TYPES.has(value);
}

export function isValidChocolateShapeId(value: unknown): value is ChocolateShapeId {
  return typeof value === "string" && VALID_SHAPE_IDS.has(value);
}

export function sanitizePlacedChocolates(
  raw: unknown,
  spotCount: number,
): PlacedChocolate[] {
  if (!Array.isArray(raw)) return [];

  const bySlot = new Map<number, PlacedChocolate>();

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const slotIndex = (item as PlacedChocolate).slotIndex;
    const type = (item as PlacedChocolate).type;
    const shapeId = (item as PlacedChocolate).shapeId;
    if (
      typeof slotIndex !== "number" ||
      slotIndex < 0 ||
      slotIndex >= spotCount ||
      !isValidChocolateType(type) ||
      !isValidChocolateShapeId(shapeId)
    ) {
      continue;
    }
    bySlot.set(slotIndex, { slotIndex, type, shapeId });
  }

  return Array.from(bySlot.values()).sort((a, b) => a.slotIndex - b.slotIndex);
}

export function sanitizeMessages(
  raw: unknown,
  spotCount: number,
  placedSlots: ReadonlySet<number>,
): ChocolateMessage[] {
  if (!Array.isArray(raw)) return [];

  const bySlot = new Map<number, ChocolateMessage>();

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const slotIndex = (item as ChocolateMessage).slotIndex;
    if (typeof slotIndex !== "number" || slotIndex < 0 || slotIndex >= spotCount) {
      continue;
    }
    if (!placedSlots.has(slotIndex)) continue;

    const msg: ChocolateMessage = {
      slotIndex,
      html: typeof (item as ChocolateMessage).html === "string" ? (item as ChocolateMessage).html : "",
      mapUrl: trimOptional((item as ChocolateMessage).mapUrl),
      spotifyUrl: trimOptional((item as ChocolateMessage).spotifyUrl),
      imageUrl: trimOptional((item as ChocolateMessage).imageUrl),
    };

    if (!messageHasContent(msg)) continue;
    bySlot.set(slotIndex, msg);
  }

  return Array.from(bySlot.values()).sort((a, b) => a.slotIndex - b.slotIndex);
}

function trimOptional(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function placedSlotSet(chocolates: PlacedChocolate[]): Set<number> {
  return new Set(chocolates.map((c) => c.slotIndex));
}

export function isPickComplete(shape: BoxShape, chocolates: PlacedChocolate[]): boolean {
  const spotCount = BOX_SPOT_COUNTS[shape];
  if (chocolates.length !== spotCount) return false;
  for (let i = 0; i < spotCount; i++) {
    if (!chocolates.some((c) => c.slotIndex === i)) return false;
  }
  return true;
}

export function pruneMessagesForChocolates(
  messages: ChocolateMessage[],
  chocolates: PlacedChocolate[],
): ChocolateMessage[] {
  const slots = placedSlotSet(chocolates);
  return messages.filter((m) => slots.has(m.slotIndex) && messageHasContent(m));
}

/** Normalize persisted or session data into a safe BoxDraft. */
export function normalizeSavedBox(raw: unknown): BoxDraft | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Partial<BoxDraft>;
  if (typeof data.id !== "string" || !data.id.trim()) return null;
  if (!isBoxShape(data.boxShape)) return null;

  const spotCount = BOX_SPOT_COUNTS[data.boxShape];
  const chocolates = sanitizePlacedChocolates(data.chocolates, spotCount);
  const slots = placedSlotSet(chocolates);
  const messages = sanitizeMessages(data.messages, spotCount, slots);

  return {
    id: data.id.trim(),
    boxShape: data.boxShape,
    boxColor:
      typeof data.boxColor === "string" &&
      BOX_COLORS.some((c) => c.value === data.boxColor)
        ? data.boxColor
        : BOX_COLORS[0].value,
    chocolates,
    messages,
    cardText: typeof data.cardText === "string" ? data.cardText : "",
    createdAt:
      typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
  };
}

export function isValidBoxId(id: string): boolean {
  return /^[a-z0-9]+-[a-z0-9]+$/i.test(id) && id.length <= 64;
}
