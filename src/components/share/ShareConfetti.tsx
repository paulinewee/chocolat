"use client";

import { useMemo } from "react";

const PIECE_COUNT = 56;

function createPieces() {
  return Array.from({ length: PIECE_COUNT }, (_, i) => {
    const radians = ((i / PIECE_COUNT) * 360 + (i % 7) * 11 * (Math.PI / 180));
    const distance = 100 + (i % 11) * 32;
    const tx = Math.cos(radians) * distance;
    const ty = Math.sin(radians) * distance;
    const delay = (i % 9) * 0.035;
    const duration = 1.5 + (i % 5) * 0.2;
    const size = 5 + (i % 4) * 2;
    const rotate = (i % 13) * 27;
    return { tx, ty, delay, duration, size, rotate, id: i };
  });
}

export function ShareConfetti({ active }: { active: boolean }) {
  const pieces = useMemo(() => createPieces(), []);

  if (!active) return null;

  return (
    <div
      className="share-confetti pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden
    >
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="share-confetti-piece"
          style={
            {
              "--tx": `${piece.tx}px`,
              "--ty": `${piece.ty}px`,
              "--confetti-delay": `${piece.delay}s`,
              "--confetti-duration": `${piece.duration}s`,
              "--confetti-size": `${piece.size}px`,
              "--confetti-rotate": `${piece.rotate}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
