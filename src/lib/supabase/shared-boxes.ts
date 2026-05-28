import { normalizeSavedBox } from "@/lib/box-validation";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { BoxDraft } from "@/types";

type SharedBoxRow = {
  id: string;
  box_shape: string;
  box_color: string;
  chocolates: unknown;
  messages: unknown;
  card_text: string;
  created_at: string;
};

function toRow(draft: BoxDraft): Omit<SharedBoxRow, "created_at"> {
  return {
    id: draft.id,
    box_shape: draft.boxShape,
    box_color: draft.boxColor,
    chocolates: draft.chocolates,
    messages: draft.messages,
    card_text: draft.cardText,
  };
}

function fromRow(row: SharedBoxRow): BoxDraft | null {
  return normalizeSavedBox({
    id: row.id,
    boxShape: row.box_shape,
    boxColor: row.box_color,
    chocolates: row.chocolates,
    messages: row.messages,
    cardText: row.card_text,
    createdAt: row.created_at,
  });
}

export async function saveSharedBoxToSupabase(draft: BoxDraft): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { error } = await supabase.from("shared_boxes").upsert(toRow(draft), {
    onConflict: "id",
  });

  if (error) throw error;
}

export async function loadSharedBoxFromSupabase(
  id: string,
): Promise<BoxDraft | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("shared_boxes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return fromRow(data as SharedBoxRow) ?? null;
}
