"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBoxBuilder } from "@/context/BoxBuilderContext";
import { isPickComplete } from "@/lib/box-validation";
import { messageHasContent } from "@/lib/message-utils";

type CreateStep = "pick" | "message" | "card";

const REDIRECT: Record<CreateStep, string> = {
  pick: "/create/pick",
  message: "/create/message",
  card: "/create/card",
};

/** Redirect to pick when the box is not fully filled. */
export function useRequirePickComplete() {
  const router = useRouter();
  const { draft } = useBoxBuilder();
  const complete = isPickComplete(draft.boxShape, draft.chocolates);

  useEffect(() => {
    if (!complete) {
      router.replace(REDIRECT.pick);
    }
  }, [complete, router]);

  return complete;
}

/** Card step requires a full box and at least one non-empty chocolate message. */
export function useRequireCardReady() {
  const router = useRouter();
  const { draft } = useBoxBuilder();
  const pickComplete = isPickComplete(draft.boxShape, draft.chocolates);
  const hasMessage = draft.messages.some(messageHasContent);

  useEffect(() => {
    if (!pickComplete) {
      router.replace(REDIRECT.pick);
      return;
    }
    if (!hasMessage) {
      router.replace(REDIRECT.message);
    }
  }, [hasMessage, pickComplete, router]);

  return pickComplete && hasMessage;
}
