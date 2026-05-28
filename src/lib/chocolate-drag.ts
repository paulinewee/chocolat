import {
  isValidChocolateShapeId,
  isValidChocolateType,
} from "@/lib/box-validation";
import type { ChocolateShapeId, ChocolateType } from "@/types";

const MIME = "application/chocolate";

export interface ChocolateDragPayload {
  type: ChocolateType;
  shapeId: ChocolateShapeId;
}

export function setChocolateDragData(
  e: React.DragEvent,
  payload: ChocolateDragPayload,
): void {
  const json = JSON.stringify(payload);
  e.dataTransfer.setData(MIME, json);
  e.dataTransfer.setData("text/plain", json);
  e.dataTransfer.effectAllowed = "copy";
}

export function getChocolateDragData(e: React.DragEvent): ChocolateDragPayload | null {
  const raw =
    e.dataTransfer.getData(MIME) || e.dataTransfer.getData("text/plain");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ChocolateDragPayload;
    if (!isValidChocolateType(parsed?.type) || !isValidChocolateShapeId(parsed?.shapeId)) {
      return null;
    }
    return { type: parsed.type, shapeId: parsed.shapeId };
  } catch {
    return null;
  }
}
