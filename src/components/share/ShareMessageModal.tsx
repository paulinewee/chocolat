"use client";

import { useEffect } from "react";
import { ChocolatePiece } from "@/components/chocolate/ChocolatePiece";
import { CHOCOLATE_SHAPES } from "@/lib/data";
import { toMapEmbed, toSpotifyEmbed } from "@/lib/embed-utils";
import type { ChocolateMessage, PlacedChocolate } from "@/types";

interface ShareMessageModalProps {
 message: ChocolateMessage;
 chocolate: PlacedChocolate;
 onClose: () => void;
}

export function ShareMessageModal({
 message,
 chocolate,
 onClose,
}: ShareMessageModalProps) {
 const selectedShapeLabel =
  CHOCOLATE_SHAPES.find((shape) => shape.id === chocolate.shapeId)?.label ??
  "Chocolate";
 const chocolateOverline = `${selectedShapeLabel} ${chocolate.type} chocolate`;
 const hasAttachments = !!(message.mapUrl || message.spotifyUrl || message.imageUrl);

 useEffect(() => {
  const onKeyDown = (e: KeyboardEvent) => {
   if (e.key === "Escape") onClose();
  };
  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
 }, [onClose]);

 useEffect(() => {
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => {
   document.body.style.overflow = prev;
  };
 }, []);

 return (
  <div
   className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6"
   onClick={onClose}
   role="dialog"
   aria-modal
   aria-labelledby="share-message-title"
  >
   <div
    className={`message-reveal relative flex pt-8 sm:pt-10 max-h-[min(92dvh,720px)] w-full flex-col sm:max-h-[min(90dvh,720px)] ${hasAttachments ? "max-w-[min(100%,680px)]" : "max-w-[min(100%,400px)]"}`}
    onClick={(e) => e.stopPropagation()}
   >
    <div className="pointer-events-none absolute -top-1 right-1 z-30 sm:right-4">
     <ChocolatePiece
      type={chocolate.type}
      shapeId={chocolate.shapeId}
      size="slot"
      pixelSize={92}
      className="sm:hidden"
     />
     <ChocolatePiece
      type={chocolate.type}
      shapeId={chocolate.shapeId}
      size="slot"
      pixelSize={118}
      className="hidden sm:block"
     />
    </div>

    {/* Card — two columns when embed is present */}
    <div
     className="origin-top-left w-full rotate-[-1deg] overflow-hidden border-2 border-black bg-cream text-left"
    >
     <div className={`flex ${hasAttachments ? "flex-row" : "flex-col"}`}>
      {/* Left: text content */}
      <div
       role="button"
       tabIndex={0}
       onClick={onClose}
       onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
         e.preventDefault();
         onClose();
        }
       }}
       className="flex min-w-0 flex-1 cursor-pointer flex-col overflow-y-auto overscroll-contain px-4 py-3 sm:px-6 sm:py-4"
      >
       <p
        id="share-message-title"
        className="my-[6px] text-[13px] tracking-[0.04em] text-ink"
       >
        {chocolateOverline}
       </p>

       <div className="mt-2 flex min-h-[120px] items-center sm:min-h-[140px]">
        {message.html?.trim() ? (
         <div
          className="rich-editor w-full p-1 text-[22px] leading-[1.15] text-ink/85 sm:text-[28px]"
          dangerouslySetInnerHTML={{ __html: message.html }}
         />
        ) : (
         <p className="text-2xl text-ink/70">A note for you</p>
        )}
       </div>
      </div>

      {/* Right: live embed */}
      {hasAttachments && (
       <div
        className="w-[48%] shrink-0 self-stretch border-l-2 border-black/10"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
       >
        {message.spotifyUrl && (
         <iframe
          src={toSpotifyEmbed(message.spotifyUrl)}
          width="100%"
          height="100%"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="min-h-[220px] border-0"
          title="Spotify"
         />
        )}
        {message.mapUrl && !message.spotifyUrl && (
         <iframe
          src={toMapEmbed(message.mapUrl)}
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="min-h-[220px] border-0"
          title="Map"
         />
        )}
        {message.imageUrl && !message.spotifyUrl && !message.mapUrl && (
         // eslint-disable-next-line @next/next/no-img-element
         <img
          src={message.imageUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
         />
        )}
       </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
