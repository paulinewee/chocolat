import { normalizeSavedBox } from "@/lib/box-validation";
import {
  loadSharedBoxFromSupabase,
  saveSharedBoxToSupabase,
} from "@/lib/supabase/shared-boxes";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { BoxDraft } from "@/types";

const PREFIX = "chocolat-box-";

/** Persist to Supabase when configured; always mirror to localStorage as backup. */
export async function saveBox(draft: BoxDraft): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${PREFIX}${draft.id}`, JSON.stringify(draft));
  }

  if (isSupabaseConfigured()) {
    await saveSharedBoxToSupabase(draft);
  }
}

export async function loadBox(id: string): Promise<BoxDraft | null> {
  if (isSupabaseConfigured()) {
    try {
      const remote = await loadSharedBoxFromSupabase(id);
      if (remote) {
        if (typeof window !== "undefined") {
          localStorage.setItem(`${PREFIX}${id}`, JSON.stringify(remote));
        }
        return remote;
      }
    } catch {
      /* fall through to local cache */
    }
  }

  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`${PREFIX}${id}`);
  if (!raw) return null;
  try {
    return normalizeSavedBox(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function generateBoxId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
