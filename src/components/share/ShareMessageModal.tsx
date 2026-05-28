"use client";

import { useEffect } from "react";
import { ChocolatePiece } from "@/components/chocolate/ChocolatePiece";
import { CHOCOLATE_SHAPES } from "@/lib/data";
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
        className="message-reveal relative flex max-h-[min(92dvh,720px)] w-full max-w-[min(100%,400px)] flex-col pt-8 sm:max-h-[min(90dvh,720px)] sm:pt-10"
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
          className="origin-top-left w-full rotate-[-1deg] cursor-pointer overflow-y-auto overscroll-contain border-2 border-black bg-cream px-4 py-3 text-left sm:px-6 sm:py-4"
        >
          <p
            id="share-message-title"
            className="my-[6px] font-serif text-[13px] tracking-[0.04em] text-ink"
          >
            {chocolateOverline}
          </p>

          <div className="mt-2 flex min-h-[120px] items-center sm:min-h-[140px]">
            {message.html?.trim() ? (
              <div
                className="rich-editor w-full p-1 font-script text-[22px] leading-[1.15] text-ink/85 sm:text-[28px]"
                dangerouslySetInnerHTML={{ __html: message.html }}
              />
            ) : (
              <p className="font-script text-2xl text-ink/70">A note for you</p>
            )}
          </div>

          {hasAttachments && (
            <div
              className="mt-4 space-y-2 border-t border-ink/10 pt-4"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {message.mapUrl && (
                <a
                  href={message.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-serif text-sm text-rose-600 underline"
                >
                  View on Google Maps →
                </a>
              )}
              {message.spotifyUrl && (
                <a
                  href={message.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-serif text-sm text-green-700 underline"
                >
                  Listen on Spotify →
                </a>
              )}
              {message.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={message.imageUrl}
                  alt=""
                  className="mt-2 max-h-48 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
