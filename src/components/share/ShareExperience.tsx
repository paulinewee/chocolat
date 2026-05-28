"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BoxDraft } from "@/types";
import { BOX_SPOT_COUNTS } from "@/types";
import { messageHasContent } from "@/lib/message-utils";
import { BOX_CHOCOLATE_PX, BoxSlotLayer, BoxVisual } from "@/components/box/BoxVisual";
import { ChocolatePiece } from "@/components/chocolate/ChocolatePiece";
import { ShareBoxCardOverlay } from "@/components/share/ShareBoxCardOverlay";
import { ShareConfetti } from "@/components/share/ShareConfetti";
import { ShareMessageModal } from "@/components/share/ShareMessageModal";
import { useResponsiveBoxSize } from "@/hooks/useResponsiveBoxSize";

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
        <h1 className="font-script text-[1.75rem] italic sm:text-3xl md:text-4xl">
          I made this box of chocolates for you
        </h1>
        <p className="mt-8 font-serif text-sm text-muted">
          This box is empty — the sender may not have finished filling it.
        </p>
      </div>
    );
  }

  return (
    <div className="safe-pad-x mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12">
      <ShareConfetti active={showConfetti} />

      <h1 className="text-center font-script text-[1.75rem] leading-tight italic sm:text-3xl md:text-4xl">
        I made this box of chocolates for you
      </h1>

      <p
        className={`mt-3 mb-3 w-full max-w-3xl px-1 text-center font-serif text-[13px] leading-snug tracking-[0.04em] text-muted transition-opacity duration-300 sm:px-2 sm:text-sm md:max-w-none md:whitespace-nowrap md:px-4 ${
          phase === "closed" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={phase !== "closed"}
      >
        Tap the box to open and eat the chocolates to find hidden messages
      </p>

      <div className="relative mx-auto w-full max-w-[min(100%,680px)]">
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
      </div>

      {isComplete && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="message-reveal mt-8 font-serif text-sm tracking-[0.04em] text-ink underline underline-offset-[3px] hover:text-ink/75"
        >
          Eat this box again
        </button>
      )}

      {activeMessage &&
        activeChocolate &&
        messageHasContent(activeMessage) &&
        !isComplete && (
          <ShareMessageModal
            message={activeMessage}
            chocolate={activeChocolate}
            onClose={() => setActiveSlot(null)}
          />
        )}
    </div>
  );
}
