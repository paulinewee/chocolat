import type { ChocolateMessage, PlacedChocolate } from "@/types";

/** Whether a slot has any note content (text or attachments). */
export function messageHasContent(msg: ChocolateMessage | undefined): boolean {
  if (!msg) return false;
  return !!(
    msg.html?.trim() ||
    msg.mapUrl?.trim() ||
    msg.spotifyUrl?.trim() ||
    msg.imageUrl?.trim()
  );
}

/** Every placed chocolate has a non-empty message. */
export function allChocolatesHaveMessages(
  chocolates: PlacedChocolate[],
  messages: ChocolateMessage[],
): boolean {
  if (chocolates.length === 0) return false;
  const withContent = new Set(
    messages.filter(messageHasContent).map((m) => m.slotIndex),
  );
  return chocolates.every((c) => withContent.has(c.slotIndex));
}
