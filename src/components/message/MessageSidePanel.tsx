"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChocolatePiece } from "@/components/chocolate/ChocolatePiece";
import { flowButtonSmClass } from "@/components/ui/buttonStyles";
import { CHOCOLATE_SHAPES } from "@/lib/data";
import { toMapEmbed, toSpotifyEmbed } from "@/lib/embed-utils";
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

 useLayoutEffect(() => {
  if (editorRef.current) {
   editorRef.current.innerHTML = initial?.html ?? "";
  }
 }, [initial?.html]);

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
  <div className="h-full overflow-y-auto p-1 pb-4 sm:p-4">
   <div className="relative mx-auto mt-8 w-full max-w-[560px] pt-8 sm:mt-[60px] sm:pt-10">
   <div className="pointer-events-none absolute -top-1 right-1 z-30 sm:right-4">
    <ChocolatePiece
     type={chocolate.type}
     shapeId={chocolate.shapeId}
     size="slot"
     pixelSize={92}
     className="message-panel-chocolate sm:hidden"
    />
    <ChocolatePiece
     type={chocolate.type}
     shapeId={chocolate.shapeId}
     size="slot"
     pixelSize={118}
     className="message-panel-chocolate hidden sm:block"
    />
   </div>

   {/* Card — splits into two columns when an embed is present */}
   <div className="origin-top-left rotate-[-1deg] border-2 border-black bg-white/65">
    <div className={`flex ${mapUrl || spotifyUrl || imageUrl ? "flex-row" : "flex-col"}`}>

     {/* ── Left column: text + controls ── */}
     <div className="flex min-w-0 flex-1 flex-col px-3 py-3 sm:px-6 sm:py-4">
      <p className="my-[6px] text-[13px] tracking-[0.04em] text-ink">
       {chocolateOverline}
      </p>
      <div className="mt-2 flex min-h-[120px] flex-1 items-start sm:min-h-[180px]">
       <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Write a note..."
        className="rich-editor w-full min-h-[100px] p-1 text-[22px] leading-[1.15] text-ink/85 sm:min-h-[130px] sm:text-[28px]"
       />
      </div>

      {activeAttachment && (
       <div className="mt-3 border border-ink/30 bg-white/60 p-3">
        <div className="flex items-center justify-between gap-2">
         <span className="text-[12px] tracking-[0.04em] text-ink/75">
          {activeAttachment === "map" && "Location"}
          {activeAttachment === "spotify" && "Song"}
          {activeAttachment === "image" && "Image"}
         </span>
         {hasAttachment(activeAttachment) && (
          <button
           type="button"
           onClick={() => clearAttachment(activeAttachment)}
           className="text-[12px] tracking-[0.04em] text-muted hover:text-ink"
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
       </div>
      )}

       <div className="flex items-center justify-between gap-2">
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
           className="flex h-11 w-11 touch-manipulation items-center justify-center border border-ink/25 bg-transparent font-mono text-[10px] tracking-[0.18em] text-ink/80 transition-colors hover:border-ink/40 hover:text-ink sm:h-9 sm:w-9"
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
        <div className="flex shrink-0 items-center gap-2">
         <button
          type="button"
          onClick={onClear}
          className={`flex h-11 touch-manipulation items-center justify-center border border-ink/25 px-4 leading-none text-muted transition-colors hover:border-ink/40 hover:text-ink sm:h-9 ${flowButtonSmClass}`}
         >
          clear
         </button>
         <button
          type="button"
          onClick={handleSave}
          className={`flex h-11 touch-manipulation items-center justify-center bg-ink px-5 leading-none text-cream transition-colors hover:bg-ink/88 sm:h-9 ${flowButtonSmClass}`}
         >
          save
         </button>
        </div>
       </div>
     </div>{/* end left column */}

     {/* ── Right column: live embed ── */}
     {(mapUrl || spotifyUrl || imageUrl) && (
      <div className="w-[48%] shrink-0 self-stretch border-l-2 border-black/10">
       {spotifyUrl && (
        <iframe
         src={toSpotifyEmbed(spotifyUrl)}
         width="100%"
         height="100%"
         allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
         loading="lazy"
         className="min-h-[200px] border-0"
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
         className="min-h-[200px] border-0"
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
    </div>{/* end two-col flex */}
   </div>{/* end card */}

   <div className="mt-3 flex items-center justify-center gap-3">
    <button
     type="button"
     onClick={onPrev}
     aria-label="Previous chocolate"
     className="flex h-11 w-11 touch-manipulation items-center justify-center font-mono text-lg text-ink/70 transition-colors hover:text-ink sm:h-8 sm:w-8 sm:text-base"
    >
     ←
    </button>
    <button
     type="button"
     onClick={onNext}
     aria-label="Next chocolate"
     className="flex h-11 w-11 touch-manipulation items-center justify-center font-mono text-lg text-ink/70 transition-colors hover:text-ink sm:h-8 sm:w-8 sm:text-base"
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
   className={`flex h-11 w-11 touch-manipulation items-center justify-center border transition-colors sm:h-9 sm:w-9 ${
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
