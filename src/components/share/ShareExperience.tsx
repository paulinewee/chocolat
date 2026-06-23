"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BoxDraft, ChocolateMessage, PlacedChocolate } from "@/types";
import { BOX_SPOT_COUNTS } from "@/types";
import { messageHasContent } from "@/lib/message-utils";
import { BOX_CHOCOLATE_PX, BoxSlotLayer, BoxVisual } from "@/components/box/BoxVisual";
import { ChocolatePiece } from "@/components/chocolate/ChocolatePiece";
import { AssetImage } from "@/components/ui/AssetImage";
import { BOX_IMAGE_SIZES, getBoxImageSrc } from "@/lib/assets";
import { ShareBoxCardOverlay } from "@/components/share/ShareBoxCardOverlay";
import { ShareConfetti } from "@/components/share/ShareConfetti";
import { useResponsiveBoxSize } from "@/hooks/useResponsiveBoxSize";
import { CHOCOLATE_SHAPES } from "@/lib/data";
import { toMapEmbed, toSpotifyEmbed } from "@/lib/embed-utils";

interface ShareExperienceProps {
 box: BoxDraft;
}

type OpenPhase = "closed" | "card" | "chocolates";

/** Bites until the chocolate is gone and the message opens (0 = full, 1 = half). */
const BITES_TO_FINISH = 2;
const CONFETTI_MS = 2600;
const LID_SETTLE_MS = 850;

function cropInsetTopPercent(biteCount: number): string {
 if (biteCount <= 0) return "0%";
 if (biteCount === 1) return "50%";
 return "100%";
}

function allChocolatesEaten(
 chocolates: BoxDraft["chocolates"],
 biteCounts: Record<number, number>,
): boolean {
 return (
  chocolates.length > 0 &&
  chocolates.every((c) => (biteCounts[c.slotIndex] ?? 0) >= BITES_TO_FINISH)
 );
}

export function ShareExperience({ box }: ShareExperienceProps) {
 const [phase, setPhase] = useState<OpenPhase>("closed");
 const [lidLifted, setLidLifted] = useState(false);
 const [lidSettling, setLidSettling] = useState(false);
 const [biteCounts, setBiteCounts] = useState<Record<number, number>>({});
 const [activeSlot, setActiveSlot] = useState<number | null>(null);
 const [showConfetti, setShowConfetti] = useState(false);
 const [isComplete, setIsComplete] = useState(false);
 const celebratedRef = useRef(false);
 const celebrationTimersRef = useRef<number[]>([]);

 const spotCount = BOX_SPOT_COUNTS[box.boxShape];
 const hasChocolates = box.chocolates.length > 0;
 const hasCard = box.cardText.trim().length > 0;
 const chocolatesRevealed = phase === "chocolates";
 const showCardOnBox = (phase === "card" || isComplete) && hasCard;
 const boxSize = useResponsiveBoxSize("xl");
 const chocPx = BOX_CHOCOLATE_PX[boxSize];

 const getMessage = (slotIndex: number) =>
  box.messages.find((m) => m.slotIndex === slotIndex);

 const startCelebration = useCallback(() => {
  if (celebratedRef.current) return;
  celebratedRef.current = true;
  setShowConfetti(true);

  celebrationTimersRef.current.push(
   window.setTimeout(() => {
    setShowConfetti(false);
    setLidLifted(false);
    setLidSettling(true);
    setPhase(hasCard ? "card" : "closed");
    setIsComplete(true);
    setActiveSlot(null);
   }, CONFETTI_MS),
   window.setTimeout(() => {
    setLidSettling(false);
   }, CONFETTI_MS + LID_SETTLE_MS),
  );
 }, [hasCard]);

 useEffect(() => {
  return () => {
   celebrationTimersRef.current.forEach((id) => window.clearTimeout(id));
   celebrationTimersRef.current = [];
  };
 }, []);

 const handleChocolateClick = (slotIndex: number) => {
  if (!chocolatesRevealed || isComplete) return;

  const current = biteCounts[slotIndex] ?? 0;
  if (current >= BITES_TO_FINISH) return;

  const next = current + 1;
  setBiteCounts((prev) => {
   const updated = { ...prev, [slotIndex]: next };
   if (allChocolatesEaten(box.chocolates, updated)) {
    queueMicrotask(startCelebration);
   }
   return updated;
  });

  if (next >= BITES_TO_FINISH && messageHasContent(getMessage(slotIndex))) {
   setActiveSlot(slotIndex);
  }
 };

 const revealChocolates = () => {
  setLidLifted(true);
  setPhase("chocolates");
 };

 const handleLidClick = () => {
  if (chocolatesRevealed || isComplete) return;

  if (phase === "closed") {
   if (hasCard) {
    setPhase("card");
   } else {
    revealChocolates();
   }
   return;
  }

  if (phase === "card") {
   revealChocolates();
  }
 };

 const activeMessage = activeSlot !== null ? getMessage(activeSlot) : null;
 const activeChocolate =
  activeSlot !== null
   ? box.chocolates.find((c) => c.slotIndex === activeSlot)
   : undefined;

 if (!hasChocolates) {
  return (
   <div className="safe-pad-x mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-12">
    <h1 className="text-xl sm:text-2xl md:text-3xl">
     I made this box of chocolates for you
    </h1>
    <p className="mt-8 text-sm text-muted">
     This box is empty — the sender may not have finished filling it.
    </p>
   </div>
  );
 }

 const showNote =
  !isComplete &&
  activeMessage !== null &&
  activeChocolate !== undefined &&
  messageHasContent(activeMessage);

 return (
  <div className="safe-pad-x mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12">
   <ShareConfetti active={showConfetti} />

   <h1 className="text-center text-xl leading-tight sm:text-2xl md:text-3xl">
    I made this box of chocolates for you
   </h1>

   {/* Box — same size as original */}
   <div className="mt-6 w-full sm:mt-8">
    <div className="relative mx-auto w-full max-w-[min(100%,680px)] overflow-visible px-1">
     <BoxVisual
      shape={box.boxShape}
      color={box.boxColor}
      size={boxSize}
      stacked
      lidVariant="ribbon"
      showTopFrame={chocolatesRevealed && !isComplete}
      onLidClick={chocolatesRevealed || isComplete ? undefined : handleLidClick}
      lidLifted={lidLifted && !lidSettling}
      lidSettling={lidSettling}
     >
      {chocolatesRevealed && !isComplete && (
       <BoxSlotLayer shape={box.boxShape} size={boxSize} spotCount={spotCount}>
        {(index) => {
         const choc = box.chocolates.find((c) => c.slotIndex === index);
         if (!choc) return null;

         const biteCount = biteCounts[index] ?? 0;
         const eaten = biteCount >= BITES_TO_FINISH;

         if (eaten) return null;

         return (
          <div className="relative flex flex-col items-center">
           <button
            type="button"
            onClick={() => handleChocolateClick(index)}
            className="relative z-[1] focus:outline-none"
            style={{ width: chocPx, height: chocPx }}
            title="Click to take a bite"
           >
            <div
             className="overflow-hidden transition-[clip-path] duration-300 ease-out"
             style={{
              width: chocPx,
              height: chocPx,
              clipPath: `inset(${cropInsetTopPercent(biteCount)} 0 0 0)`,
             }}
            >
             <ChocolatePiece
              type={choc.type}
              shapeId={choc.shapeId}
              size="slot"
              pixelSize={chocPx}
              hasMessage={false}
             />
            </div>
           </button>
          </div>
         );
        }}
       </BoxSlotLayer>
      )}
     </BoxVisual>

     {showCardOnBox && <ShareBoxCardOverlay cardText={box.cardText} />}

     {/* Propped lid */}
     {lidLifted && !lidSettling && (
      <div
       aria-hidden
       className="pointer-events-none absolute z-10 animate-[lid-prop-in_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards]"
       style={{
        width: "100%",
        right: "78%",
        top: "40px",
        transformOrigin: "bottom right",
       }}
      >
       <AssetImage
        src={getBoxImageSrc(box.boxShape, "ribbon", box.boxColor)}
        alt=""
        width={BOX_IMAGE_SIZES.xl.w}
        height={BOX_IMAGE_SIZES.xl.h}
        className="h-full w-full object-contain drop-shadow-lg"
        draggable={false}
       />
      </div>
     )}
    </div>
   </div>

   {isComplete && (
    <button
     type="button"
     onClick={() => window.location.reload()}
     className="message-reveal mt-8 text-sm tracking-[0.04em] text-ink underline underline-offset-[3px] hover:text-ink/75"
    >
     eat this box again
    </button>
   )}

   {/* Note — fixed to right side, vertically centered, no layout shift */}
   {showNote && activeMessage && activeChocolate && (
    <div
     key={activeSlot}
     className="pointer-events-none fixed right-4 top-1/2 z-40 w-[min(90vw,360px)] -translate-y-1/2 sm:right-6 lg:right-8"
    >
     <div className="pointer-events-auto">
      <ShareNotePanel
       message={activeMessage}
       chocolate={activeChocolate}
      />
     </div>
    </div>
   )}
  </div>
 );
}

function ShareNotePanel({
 message,
 chocolate,
}: {
 message: ChocolateMessage;
 chocolate: PlacedChocolate;
}) {
 const label =
  CHOCOLATE_SHAPES.find((s) => s.id === chocolate.shapeId)?.label ??
  "Chocolate";
 const overline = `${label} ${chocolate.type} chocolate`;
 const hasEmbed = !!(message.mapUrl || message.spotifyUrl || message.imageUrl);

 return (
  <div className="message-reveal relative w-full pt-8 sm:pt-10" style={{ maxWidth: "min(90vw, 380px)" }}>
   {/* Chocolate piece in corner */}
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

   {/* Card — always vertical: text on top, embed below */}
   <div className="origin-top-left rotate-[-1deg] overflow-hidden border-2 border-black bg-cream">
    <div className="flex flex-col">
     {/* Text */}
     <div className="flex flex-col px-5 py-4 sm:px-6 sm:py-5">
      <p className="mb-2 text-[13px] tracking-[0.04em] text-ink">{overline}</p>
      <div className="flex min-h-[80px] items-center sm:min-h-[100px]">
       {message.html?.trim() ? (
        <div
         className="rich-editor w-full p-1 text-[20px] leading-[1.2] text-ink/85 sm:text-[24px]"
         dangerouslySetInnerHTML={{ __html: message.html }}
        />
       ) : (
        <p className="text-2xl text-ink/70">A note for you</p>
       )}
      </div>
     </div>

     {/* Embed — full width below text */}
     {hasEmbed && (
      <div className="border-t border-black/10 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
       {message.spotifyUrl && (
        <iframe
         src={toSpotifyEmbed(message.spotifyUrl)}
         width="100%"
         height="152"
         allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
         loading="lazy"
         className="rounded border-0"
         title="Spotify"
        />
       )}
       {message.mapUrl && !message.spotifyUrl && (
        <iframe
         src={toMapEmbed(message.mapUrl)}
         width="100%"
         height="200"
         loading="lazy"
         referrerPolicy="no-referrer-when-downgrade"
         className="rounded border-0"
         title="Map"
        />
       )}
       {message.imageUrl && !message.spotifyUrl && !message.mapUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
         src={message.imageUrl}
         alt=""
         className="max-h-[220px] w-full object-cover"
         onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
       )}
      </div>
     )}
    </div>
   </div>
  </div>
 );
}
