"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageBox } from "@/components/box/MessageBox";
import { MessageSidePanel } from "@/components/message/MessageSidePanel";
import { NextButton } from "@/components/ui/NextButton";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { useBoxBuilder } from "@/context/BoxBuilderContext";
import { useRequirePickComplete } from "@/hooks/useCreateFlowGuard";
import {
  allChocolatesHaveMessages,
  messageHasContent,
} from "@/lib/message-utils";
import type { ChocolateMessage } from "@/types";

function orderedSlots(chocolates: { slotIndex: number }[]) {
  return chocolates.map((c) => c.slotIndex).sort((a, b) => a - b);
}

function getAdjacentSlot(
  slots: number[],
  current: number,
  direction: "next" | "prev",
): number | null {
  if (slots.length === 0) return null;
  const idx = slots.indexOf(current);
  if (idx === -1) return slots[0];
  const delta = direction === "next" ? 1 : -1;
  return slots[(idx + delta + slots.length) % slots.length] ?? null;
}

function getNextUnmessagedSlot(
  slots: number[],
  current: number,
  messages: ChocolateMessage[],
): number | null {
  if (slots.length === 0) return null;
  const hasMessage = new Set(
    messages.filter(messageHasContent).map((m) => m.slotIndex),
  );
  const idx = slots.indexOf(current);
  for (let offset = 1; offset <= slots.length; offset += 1) {
    const slot = slots[(idx + offset) % slots.length];
    if (!hasMessage.has(slot)) return slot;
  }
  return null;
}

export default function AddMessagePage() {
  const router = useRouter();
  const { draft, spotCount, setMessages } = useBoxBuilder();
  const pickComplete = useRequirePickComplete("message");
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [animatingOutSlot, setAnimatingOutSlot] = useState<number | null>(null);
  const [animatingInSlot, setAnimatingInSlot] = useState<number | null>(null);
  const [allCompleteNotice, setAllCompleteNotice] = useState(false);

  const currentMessage =
    editingSlot !== null
      ? draft.messages.find((m) => m.slotIndex === editingSlot)
      : undefined;
  const selectedChocolate =
    editingSlot !== null
      ? draft.chocolates.find((c) => c.slotIndex === editingSlot)
      : undefined;

  const transitionToSlot = (slotIndex: number) => {
    if (editingSlot === slotIndex) return;
    if (editingSlot !== null) {
      setAnimatingInSlot(editingSlot);
      window.setTimeout(() => setAnimatingInSlot(null), 280);
    }
    setAnimatingOutSlot(slotIndex);
    window.setTimeout(() => {
      setEditingSlot(slotIndex);
      setAnimatingOutSlot(null);
    }, 220);
  };

  const handleSave = (message: ChocolateMessage) => {
    const next = draft.messages.filter((m) => m.slotIndex !== message.slotIndex);
    if (messageHasContent(message)) {
      next.push(message);
    }
    setMessages(next);
    const slots = orderedSlots(draft.chocolates);
    const nextUnmessaged = getNextUnmessagedSlot(slots, message.slotIndex, next);
    if (nextUnmessaged !== null) {
      setAllCompleteNotice(false);
      transitionToSlot(nextUnmessaged);
      return;
    }
    if (allChocolatesHaveMessages(draft.chocolates, next)) {
      const slot = editingSlot;
      if (slot !== null) {
        setAnimatingInSlot(slot);
        window.setTimeout(() => setAnimatingInSlot(null), 280);
      }
      setEditingSlot(null);
      setAllCompleteNotice(true);
      return;
    }
    setAllCompleteNotice(false);
  };

  const handleClear = () => {
    if (editingSlot === null) return;
    setAllCompleteNotice(false);
    setMessages(draft.messages.filter((m) => m.slotIndex !== editingSlot));
    setAnimatingInSlot(editingSlot);
    window.setTimeout(() => setAnimatingInSlot(null), 280);
    setEditingSlot(null);
  };

  const handleChocolateSelect = (slotIndex: number) => {
    setAllCompleteNotice(false);
    transitionToSlot(slotIndex);
  };

  const handleStepSlot = (direction: "next" | "prev") => {
    if (editingSlot === null) return;
    setAllCompleteNotice(false);
    const slots = orderedSlots(draft.chocolates);
    const target = getAdjacentSlot(slots, editingSlot, direction);
    if (target !== null) transitionToSlot(target);
  };

  if (!pickComplete) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <span className="font-mono text-xs tracking-widest text-muted">LOADING…</span>
      </main>
    );
  }

  const hasChocolates = draft.chocolates.length > 0;
  const hasAtLeastOneMessage = draft.messages.some(messageHasContent);

  return (
    <main className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-cream">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1400px] flex-1 flex-col overflow-hidden px-4 py-4 md:px-8 md:py-6">
        <SiteHeader
          title="click a chocolate to add a message"
          backHref="/create/pick"
          navEnd={
            <NextButton
              disabled={!hasAtLeastOneMessage}
              onClick={() => hasAtLeastOneMessage && router.push("/create/card")}
            />
          }
        />

        <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-visible lg:grid-cols-2 lg:gap-8">
          {hasChocolates ? (
            <>
              <div className="relative z-20 flex min-h-0 items-center justify-center overflow-visible">
                <MessageBox
                  className="h-full"
                  shape={draft.boxShape}
                  color={draft.boxColor}
                  chocolates={draft.chocolates}
                  messages={draft.messages}
                  spotCount={spotCount}
                  onChocolateClick={handleChocolateSelect}
                  activeSlot={editingSlot}
                  animatingOutSlot={animatingOutSlot}
                  animatingInSlot={animatingInSlot}
                  size="fit"
                />
              </div>
              <div className="relative z-10 min-h-0 overflow-hidden px-3 sm:px-6 lg:px-10">
                {allCompleteNotice ? (
                  <div className="flex h-full items-center justify-center p-6 text-center">
                    <p className="max-w-sm font-serif text-[13px] leading-relaxed tracking-[0.04em] text-muted sm:text-sm">
                      All chocolates now have messages. Click to edit any messages or press
                      Next to continue.
                    </p>
                  </div>
                ) : editingSlot !== null && selectedChocolate ? (
                  <MessageSidePanel
                    slotIndex={editingSlot}
                    chocolate={selectedChocolate}
                    initial={currentMessage}
                    onSave={handleSave}
                    onClear={handleClear}
                    onPrev={() => handleStepSlot("prev")}
                    onNext={() => handleStepSlot("next")}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center">
                    <p className="font-serif text-[13px] tracking-[0.04em] text-muted sm:text-sm">
                      No chocolate selected. Select a chocolate to add a secret message to it
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="font-mono text-xs tracking-[0.2em] text-muted">
              Fill your box with chocolates first.
            </p>
          )}
        </div>

      </div>

    </main>
  );
}
