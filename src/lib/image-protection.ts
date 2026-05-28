import type { DragEvent, MouseEvent, SyntheticEvent } from "react";

/** Shared class for brand artwork — discourages drag, select, and long-press save. */
export const PROTECTED_IMAGE_CLASS =
  "asset-protected pointer-events-none select-none [-webkit-user-drag:none] [user-drag:none]";

export function preventImageContextMenu(event: SyntheticEvent) {
  event.preventDefault();
}

export function preventImageDragStart(event: DragEvent) {
  event.preventDefault();
}

export function mergeImageProtectionHandlers<
  E extends MouseEvent | DragEvent,
>(prevent: (event: E) => void, handler?: (event: E) => void) {
  return (event: E) => {
    prevent(event);
    handler?.(event);
  };
}
