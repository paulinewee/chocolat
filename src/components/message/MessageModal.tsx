"use client";

import { useEffect, useRef, useState } from "react";
import { flowButtonClass, flowButtonSmClass } from "@/components/ui/buttonStyles";
import { toMapEmbed, toSpotifyEmbed } from "@/lib/embed-utils";
import type { ChocolateMessage } from "@/types";

type AttachmentKind = "map" | "spotify" | "image";

interface MessageModalProps {
  slotIndex: number;
  initial?: ChocolateMessage;
  onSave: (message: ChocolateMessage) => void;
  onClose: () => void;
  onClear: () => void;
}

export function MessageModal({
  slotIndex,
  initial,
  onSave,
  onClose,
  onClear,
}: MessageModalProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mapUrl, setMapUrl] = useState(initial?.mapUrl ?? "");
  const [spotifyUrl, setSpotifyUrl] = useState(initial?.spotifyUrl ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [activeAttachment, setActiveAttachment] = useState<AttachmentKind | null>(
    null,
  );

  useEffect(() => {
    if (editorRef.current && initial?.html) {
      editorRef.current.innerHTML = initial.html;
    }
  }, [initial?.html]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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
    onClose();
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-labelledby="message-modal-title"
    >
      <div
        className={`max-h-[90vh] w-full overflow-y-auto bg-cream shadow-lg ${mapUrl || spotifyUrl || imageUrl ? "max-w-3xl" : "max-w-lg"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex ${mapUrl || spotifyUrl || imageUrl ? "flex-row" : "flex-col"}`}>
          {/* Left column: editor + controls */}
          <div className="flex min-w-0 flex-1 flex-col p-6">
            <h2
              id="message-modal-title"
              className="font-mono text-xs tracking-[0.2em]"
            >
              MESSAGE FOR CHOCOLATE {slotIndex + 1}
            </h2>

            <div className="mt-4 flex flex-wrap gap-1 border border-ink/10 p-1">
              {[
                { cmd: "bold", label: "B" },
                { cmd: "italic", label: "I" },
                { cmd: "underline", label: "U" },
              ].map(({ cmd, label }) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => exec(cmd)}
                  className="px-2 py-1 font-mono text-xs hover:bg-ink/5"
                >
                  {label}
                </button>
              ))}
            </div>

            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Write a note…"
              className="rich-editor mt-3 min-h-[120px] border border-ink/15 p-3 text-sm leading-relaxed"
            />

            <div className="mt-4 flex items-center gap-2">
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

            {activeAttachment && (
              <div className="mt-3 border border-ink/10 bg-white/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] tracking-widest text-muted">
                    {activeAttachment === "map" && "LOCATION"}
                    {activeAttachment === "spotify" && "SONG"}
                    {activeAttachment === "image" && "IMAGE"}
                  </span>
                  {hasAttachment(activeAttachment) && (
                    <button
                      type="button"
                      onClick={() => clearAttachment(activeAttachment)}
                      className="font-mono text-[10px] tracking-widest text-muted hover:text-ink"
                    >
                      REMOVE
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
                      ? "https://maps.google.com/…"
                      : activeAttachment === "spotify"
                        ? "https://open.spotify.com/track/…"
                        : "https://…"
                  }
                  className="mt-2 w-full border border-ink/15 bg-cream px-3 py-2 text-sm"
                />
              </div>
            )}

            <div className="mt-6 flex justify-between gap-3">
              <button
                type="button"
                onClick={onClear}
                className={`text-muted hover:text-ink ${flowButtonSmClass}`}
              >
                Clear
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 text-muted ${flowButtonSmClass}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className={`${flowButtonClass} bg-ink text-cream hover:bg-ink/88`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Right column: live embed */}
          {(mapUrl || spotifyUrl || imageUrl) && (
            <div className="w-[48%] shrink-0 self-stretch border-l border-ink/10">
              {spotifyUrl && (
                <iframe
                  src={toSpotifyEmbed(spotifyUrl)}
                  width="100%"
                  height="100%"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="min-h-[280px] border-0"
                  title="Spotify"
                />
              )}
              {mapUrl && !spotifyUrl && (
                <iframe
                  src={toMapEmbed(mapUrl)}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="min-h-[280px] border-0"
                  title="Map"
                />
              )}
              {imageUrl && !spotifyUrl && !mapUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>
          )}
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
