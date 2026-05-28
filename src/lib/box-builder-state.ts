import { BOX_COLORS } from "@/lib/data";
import {
  isBoxShape,
  placedSlotSet,
  pruneMessagesForChocolates,
  sanitizeMessages,
  sanitizePlacedChocolates,
} from "@/lib/box-validation";
import type { BoxDraft, BoxShape, ChocolateMessage, PlacedChocolate } from "@/types";
import { BOX_SPOT_COUNTS } from "@/types";

export function emptyChocolatesByShape(): Record<BoxShape, PlacedChocolate[]> {
  return {
    circle: [],
    square: [],
    flower: [],
    heart: [],
    butterfly: [],
  };
}

export function emptyMessagesByShape(): Record<BoxShape, ChocolateMessage[]> {
  return {
    circle: [],
    square: [],
    flower: [],
    heart: [],
    butterfly: [],
  };
}

function sanitizeShapeMaps(
  chocolatesByShape: Record<BoxShape, PlacedChocolate[]>,
  messagesByShape: Record<BoxShape, ChocolateMessage[]>,
): {
  chocolatesByShape: Record<BoxShape, PlacedChocolate[]>;
  messagesByShape: Record<BoxShape, ChocolateMessage[]>;
} {
  const nextChocolates = emptyChocolatesByShape();
  const nextMessages = emptyMessagesByShape();

  for (const shape of Object.keys(BOX_SPOT_COUNTS) as BoxShape[]) {
    const spotCount = BOX_SPOT_COUNTS[shape];
    const chocolates = sanitizePlacedChocolates(chocolatesByShape[shape], spotCount);
    const slots = placedSlotSet(chocolates);
    nextChocolates[shape] = chocolates;
    nextMessages[shape] = sanitizeMessages(messagesByShape[shape], spotCount, slots);
  }

  return { chocolatesByShape: nextChocolates, messagesByShape: nextMessages };
}

/** Session draft may store placements per shape so switching boxes does not copy slots. */
export type BuilderDraft = BoxDraft & {
  chocolatesByShape: Record<BoxShape, PlacedChocolate[]>;
  messagesByShape: Record<BoxShape, ChocolateMessage[]>;
  /** User confirmed a box shape on the picker screen (enables NEXT). */
  boxShapeChosen?: boolean;
};

function normalizeBoxColor(color: string | undefined): string {
  const fallback = BOX_COLORS[0].value;
  if (!color) return fallback;
  if (BOX_COLORS.some((c) => c.value === color)) return color;
  return fallback;
}

export function createBuilderDraft(): BuilderDraft {
  const chocolatesByShape = emptyChocolatesByShape();
  const messagesByShape = emptyMessagesByShape();
  return {
    id: "",
    boxShape: "square",
    boxColor: "#f4c4c8",
    chocolates: [],
    messages: [],
    cardText: "",
    createdAt: new Date().toISOString(),
    chocolatesByShape,
    messagesByShape,
    boxShapeChosen: false,
  };
}

export function normalizeBuilderDraft(stored: unknown): BuilderDraft {
  const base = createBuilderDraft();
  if (!stored || typeof stored !== "object") return base;

  const data = stored as Partial<BuilderDraft>;
  const shape = isBoxShape(data.boxShape) ? data.boxShape : base.boxShape;

  let chocolatesByShape = data.chocolatesByShape
    ? { ...emptyChocolatesByShape(), ...data.chocolatesByShape }
    : emptyChocolatesByShape();
  let messagesByShape = data.messagesByShape
    ? { ...emptyMessagesByShape(), ...data.messagesByShape }
    : emptyMessagesByShape();

  if (!data.chocolatesByShape) {
    chocolatesByShape[shape] = sanitizePlacedChocolates(data.chocolates, BOX_SPOT_COUNTS[shape]);
    const slots = placedSlotSet(chocolatesByShape[shape]);
    messagesByShape[shape] = sanitizeMessages(data.messages, BOX_SPOT_COUNTS[shape], slots);
  }

  const sanitized = sanitizeShapeMaps(chocolatesByShape, messagesByShape);

  const hadLegacyProgress =
    (data.chocolates?.length ?? 0) > 0 ||
    Object.values(sanitized.chocolatesByShape).some((list) => list.length > 0);

  return {
    id: typeof data.id === "string" && data.id.trim() ? data.id.trim() : base.id,
    boxShape: shape,
    boxColor: normalizeBoxColor(
      typeof data.boxColor === "string" ? data.boxColor : base.boxColor,
    ),
    cardText: typeof data.cardText === "string" ? data.cardText : "",
    createdAt:
      typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    chocolatesByShape: sanitized.chocolatesByShape,
    messagesByShape: sanitized.messagesByShape,
    chocolates: [...sanitized.chocolatesByShape[shape]],
    messages: [...sanitized.messagesByShape[shape]],
    boxShapeChosen: data.boxShapeChosen ?? hadLegacyProgress,
  };
}

export function withShapeSelection(
  draft: BuilderDraft,
  shape: BoxShape,
): BuilderDraft {
  return {
    ...draft,
    boxShape: shape,
    chocolates: [...(draft.chocolatesByShape[shape] ?? [])],
    messages: [...(draft.messagesByShape[shape] ?? [])],
  };
}

export function withChocolatesForShape(
  draft: BuilderDraft,
  chocolates: PlacedChocolate[],
): BuilderDraft {
  const shape = draft.boxShape;
  const spotCount = BOX_SPOT_COUNTS[shape];
  const sanitized = sanitizePlacedChocolates(chocolates, spotCount);
  const messages = pruneMessagesForChocolates(
    draft.messagesByShape[shape] ?? [],
    sanitized,
  );

  return {
    ...draft,
    chocolates: sanitized,
    messages,
    chocolatesByShape: { ...draft.chocolatesByShape, [shape]: sanitized },
    messagesByShape: { ...draft.messagesByShape, [shape]: messages },
  };
}

export function withMessagesForShape(
  draft: BuilderDraft,
  messages: ChocolateMessage[],
): BuilderDraft {
  const shape = draft.boxShape;
  const spotCount = BOX_SPOT_COUNTS[shape];
  const slots = placedSlotSet(draft.chocolatesByShape[shape] ?? []);
  const sanitized = sanitizeMessages(messages, spotCount, slots);

  return {
    ...draft,
    messages: sanitized,
    messagesByShape: { ...draft.messagesByShape, [shape]: sanitized },
  };
}

/** Saved box for sharing — current shape only, no per-shape maps */
export function toSavedBoxDraft(draft: BuilderDraft): BoxDraft {
  const messages = pruneMessagesForChocolates(draft.messages, draft.chocolates);
  const { chocolatesByShape: _c, messagesByShape: _m, boxShapeChosen: _b, ...rest } = draft;
  return {
    ...rest,
    chocolates: [...draft.chocolates],
    messages,
  };
}
