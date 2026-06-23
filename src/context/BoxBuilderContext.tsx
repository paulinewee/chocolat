"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BoxShape, ChocolateMessage, PlacedChocolate } from "@/types";
import { BOX_SPOT_COUNTS } from "@/types";
import { isPickComplete } from "@/lib/box-validation";
import {
  createBuilderDraft,
  normalizeBuilderDraft,
  toSavedBoxDraft,
  withChocolatesForShape,
  withMessagesForShape,
  withShapeSelection,
  type BuilderDraft,
} from "@/lib/box-builder-state";
import { generateBoxId, loadBox, saveBox } from "@/lib/storage";

interface BoxBuilderContextValue {
  draft: BuilderDraft;
  spotCount: number;
  pickComplete: boolean;
  setBoxShape: (shape: BoxShape) => void;
  setBoxColor: (color: string) => void;
  setChocolates: (chocolates: PlacedChocolate[]) => void;
  setMessages: (messages: ChocolateMessage[]) => void;
  setCardText: (text: string) => void;
  finalizeAndSave: () => Promise<string | null>;
  resetDraft: () => void;
}

const BoxBuilderContext = createContext<BoxBuilderContextValue | null>(null);

const SESSION_KEY = "chocolat-builder-session";

function freshDraft(): BuilderDraft {
  const draft = createBuilderDraft();
  draft.id = generateBoxId();
  return draft;
}

export function BoxBuilderProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<BuilderDraft>(freshDraft);
  const [hydrated, setHydrated] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        // Restore in-progress builder from sessionStorage after client mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration from browser storage
        setDraft(normalizeBuilderDraft(JSON.parse(stored)));
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
        setSessionError(true);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(draft));
    } catch {
      /* quota exceeded — continue in-memory */
    }
  }, [draft, hydrated]);

  const spotCount = BOX_SPOT_COUNTS[draft.boxShape];
  const pickComplete = isPickComplete(draft.boxShape, draft.chocolates);

  const setBoxShape = useCallback((shape: BoxShape) => {
    setDraft((d) => ({
      ...withShapeSelection(d, shape),
      boxShapeChosen: true,
    }));
  }, []);

  const setBoxColor = useCallback((color: string) => {
    setDraft((d) => ({ ...d, boxColor: color }));
  }, []);

  const setChocolates = useCallback((chocolates: PlacedChocolate[]) => {
    setDraft((d) => withChocolatesForShape(d, chocolates));
  }, []);

  const setMessages = useCallback((messages: ChocolateMessage[]) => {
    setDraft((d) => withMessagesForShape(d, messages));
  }, []);

  const setCardText = useCallback((text: string) => {
    setDraft((d) => ({ ...d, cardText: text }));
  }, []);

  const finalizeAndSave = useCallback(async (): Promise<string | null> => {
    if (!isPickComplete(draft.boxShape, draft.chocolates)) {
      return null;
    }
    const final = toSavedBoxDraft({
      ...draft,
      createdAt: new Date().toISOString(),
    });
    if (!final.id) {
      final.id = generateBoxId();
    }
    try {
      await saveBox(final);
    } catch {
      return null;
    }
    sessionStorage.removeItem(SESSION_KEY);
    return final.id;
  }, [draft]);

  const resetDraft = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setDraft(freshDraft());
    setSessionError(false);
  }, []);

  const value = useMemo(
    () => ({
      draft,
      spotCount,
      pickComplete,
      setBoxShape,
      setBoxColor,
      setChocolates,
      setMessages,
      setCardText,
      finalizeAndSave,
      resetDraft,
    }),
    [
      draft,
      spotCount,
      pickComplete,
      setBoxShape,
      setBoxColor,
      setChocolates,
      setMessages,
      setCardText,
      finalizeAndSave,
      resetDraft,
    ],
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="font-mono text-xs tracking-widest text-ink/50">loading…</span>
      </div>
    );
  }

  return (
    <BoxBuilderContext.Provider value={value}>
      {sessionError && (
        <div
          className="border-b border-amber-200/80 bg-amber-50 px-4 py-2 text-center font-mono text-[10px] tracking-wide text-amber-900/80"
          role="status"
        >
          Could not restore your last session — starting fresh.
          <button
            type="button"
            onClick={() => setSessionError(false)}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
      {children}
    </BoxBuilderContext.Provider>
  );
}

export function useBoxBuilder() {
  const ctx = useContext(BoxBuilderContext);
  if (!ctx) throw new Error("useBoxBuilder must be used within BoxBuilderProvider");
  return ctx;
}

export function useSharedBox(id: string) {
  const [box, setBox] = useState<Awaited<ReturnType<typeof loadBox>>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(false);
      try {
        const loaded = await loadBox(id);
        if (!cancelled) setBox(loaded);
      } catch {
        if (!cancelled) {
          setBox(null);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { box, loading, error };
}
