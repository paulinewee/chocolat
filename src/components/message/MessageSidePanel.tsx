"use client";

import { useEffect, useRef, useState } from "react";
import { ChocolatePiece } from "@/components/chocolate/ChocolatePiece";
import { flowButtonSmClass } from "@/components/ui/buttonStyles";
import { CHOCOLATE_SHAPES } from "@/lib/data";
import type { ChocolateMessage, PlacedChocolate } from "@/types";

type AttachmentKind = "map" | "spotify" | "image";

interface MessageSidePanelProps {
  slotIndex: number;
  chocolate: PlacedChocolate;
  initial?: ChocolateMessage;
  onSave: (message: ChocolateMessage) => void;
  onClear: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function MessageSidePanel({
  slotIndex,
  chocolate,
  initial,
  onSave,
  onClear,
  onPrev,
  onNext,
}: MessageSidePanelProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mapUrl, setMapUrl] = useState(initial?.mapUrl ?? "");
  const [spotifyUrl, setSpotifyUrl] = useState(initial?.spotifyUrl ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [activeAttachment, setActiveAttachment] = useState<AttachmentKind | null>(null);

  useEffect(() => {
    setMapUrl(initial?.mapUrl ?? "");
    setSpotifyUrl(initial?.spotifyUrl ?? "");
    setImageUrl(initial?.imageUrl ?? "");
    if (editorRef.current) {
      editorRef.current.innerHTML = initial?.html ?? "";
    }
    setActiveAttachment(null);
  }, [initial?.html, initial?.imageUrl, initial?.mapUrl, initial?.spotifyUrl, slotIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const editingField =
        tag === "input" || tag === "textarea" || target?.isContentEditable;
      if (editingField) return;
      event.preventDefault();
      if (event.key === "ArrowLeft") onPrev();
      else onNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onNext, onPrev]);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleSave = () => {
    onSave({
      slotIndex,
      html: editorRef.current?.innerHTML ?? "",
      mapUrl: mapUrl || undefined,
      spotifyUrl: spotifyUrl || undefined,
      imageUrl: imageUrl || undefined,
    });
  };

  const toggleAttachment = (kind: AttachmentKind) => {
    setActiveAttachment((prev) => (prev === kind ? null : kind));
  };

  const attachmentValue = (kind: AttachmentKind) => {
    if (kind === "map") return mapUrl;
    if (kind === "spotify") return spotifyUrl;
    return imageUrl;
  };

  const setAttachmentValue = (kind: AttachmentKind, value: string) => {
    if (kind === "map") setMapUrl(value);
    else if (kind === "spotify") setSpotifyUrl(value);
    else setImageUrl(value);
  };

  const clearAttachment = (kind: AttachmentKind) => {
    setAttachmentValue(kind, "");
    setActiveAttachment(null);
  };

  const hasAttachment = (kind: AttachmentKind) => !!attachmentValue(kind);
  const selectedShapeLabel =
    CHOCOLATE_SHAPES.find((shape) => shape.id === chocolate.shapeId)?.label ??
    "Chocolate";
  const chocolateOverline = `${selectedShapeLabel} ${chocolate.type} chocolate`;

  return (
    <div className="h-full overflow-y-auto p-2 sm:p-4">
      <div className="relative mx-auto mt-[60px] w-full max-w-[560px] pt-10">
      <div className="pointer-events-none absolute -top-1 right-2 z-30 sm:right-4">
        <ChocolatePiece
          type={chocolate.type}
          shapeId={chocolate.shapeId}
          size="slot"
          pixelSize={118}
          className="message-panel-chocolate"
        />
      </div>

      <div className="origin-top-left rotate-[-1deg] border-2 border-black bg-white/65 px-4 py-3 sm:px-6 sm:py-4">
        <p className="my-[6px] font-serif text-[13px] tracking-[0.04em] text-ink">
          {chocolateOverline}
        </p>
        <div className="mt-2 flex min-h-[188px] items-center sm:min-h-[220px]">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Write a note..."
            className="rich-editor w-full min-h-[128px] p-1 font-script text-[28px] leading-[1.15] text-ink/85 sm:min-h-[150px]"
          />
        </div>

        {activeAttachment && (
          <div className="mt-3 border border-ink/30 bg-white/60 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-serif text-[12px] tracking-[0.04em] text-ink/75">
                {activeAttachment === "map" && "Location"}
                {activeAttachment === "spotify" && "Song"}
                {activeAttachment === "image" && "Image"}
              </span>
              {hasAttachment(activeAttachment) && (
                <button
                  type="button"
                  onClick={() => clearAttachment(activeAttachment)}
                  className="font-serif text-[12px] tracking-[0.04em] text-muted hover:text-ink"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="url"
              autoFocus
              value={attachmentValue(activeAttachment)}
              onChange={(e) => setAttachmentValue(activeAttachment, e.target.value)}
              placeholder={
                activeAttachment === "map"
                  ? "https://maps.google.com/..."
                  : activeAttachment === "spotify"
                    ? "https://open.spotify.com/track/..."
                    : "https://..."
              }
              className="mt-2 w-full border border-ink/25 bg-cream px-3 py-2 text-sm"
            />
            {activeAttachment === "image" && imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-3 max-h-24 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>
        )}

        {(mapUrl || spotifyUrl || imageUrl) && !activeAttachment && (
          <div className="mt-3 flex flex-wrap gap-2">
            {mapUrl && <AttachmentChip label="Location" onEdit={() => setActiveAttachment("map")} />}
            {spotifyUrl && <AttachmentChip label="Song" onEdit={() => setActiveAttachment("spotify")} />}
            {imageUrl && <AttachmentChip label="Image" onEdit={() => setActiveAttachment("image")} />}
          </div>
        )}

        <div className="mt-6 flex items-end justify-between gap-4">
          <div className="flex items-center gap-2">
            {[
              { cmd: "bold", label: "B" },
              { cmd: "italic", label: "I" },
              { cmd: "underline", label: "U" },
            ].map(({ cmd, label }) => (
              <button
                key={cmd}
                type="button"
                onClick={() => exec(cmd)}
                className="flex h-9 w-9 items-center justify-center border border-ink/25 bg-transparent font-mono text-[10px] tracking-[0.18em] text-ink/80 transition-colors hover:border-ink/40 hover:text-ink"
              >
                {label}
              </button>
            ))}
            <AttachmentIconButton
              kind="map"
              label="Add location"
              active={activeAttachment === "map"}
              filled={hasAttachment("map")}
              onClick={() => toggleAttachment("map")}
            />
            <AttachmentIconButton
              kind="spotify"
              label="Add song"
              active={activeAttachment === "spotify"}
              filled={hasAttachment("spotify")}
              onClick={() => toggleAttachment("spotify")}
            />
            <AttachmentIconButton
              kind="image"
              label="Add image"
              active={activeAttachment === "image"}
              filled={hasAttachment("image")}
              onClick={() => toggleAttachment("image")}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClear}
              className={`flex h-9 min-w-[90px] items-center justify-center border border-ink/25 px-4 leading-none text-muted transition-colors hover:border-ink/40 hover:text-ink ${flowButtonSmClass}`}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`flex h-9 min-w-[120px] items-center justify-center bg-ink px-6 leading-none text-cream transition-colors hover:bg-ink/88 ${flowButtonSmClass}`}
            >
              Save
            </button>
          </div>
        </div>

      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous chocolate"
          className="flex h-8 w-8 items-center justify-center font-mono text-base text-ink/70 transition-colors hover:text-ink"
        >
          ←
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next chocolate"
          className="flex h-8 w-8 items-center justify-center font-mono text-base text-ink/70 transition-colors hover:text-ink"
        >
          →
        </button>
      </div>
      </div>
    </div>
  );
}

function AttachmentIconButton({
  kind,
  label,
  active,
  filled,
  onClick,
}: {
  kind: AttachmentKind;
  label: string;
  active: boolean;
  filled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center border transition-colors ${
        active || filled
          ? "border-ink/40 bg-ink/5 text-ink"
          : "border-ink/15 text-muted hover:border-ink/30 hover:text-ink"
      }`}
    >
      {kind === "map" && <MapPinIcon />}
      {kind === "spotify" && <MusicIcon />}
      {kind === "image" && <ImageIcon />}
    </button>
  );
}

function AttachmentChip({
  label,
  onEdit,
}: {
  label: string;
  onEdit: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="border border-ink/15 px-2 py-1 font-mono text-[10px] tracking-wider text-muted hover:border-ink/30 hover:text-ink"
    >
      {label} ✓
    </button>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="M21 16l-5-5-4 4-2-2-5 5" />
    </svg>
  );
}
