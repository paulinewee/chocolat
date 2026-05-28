"use client";

/** Read-only card on the closed ribbon box (first tap in share flow). */
export function ShareBoxCardOverlay({ cardText }: { cardText: string }) {
  return (
    <div
      className="message-reveal pointer-events-none absolute inset-0 z-[4] flex translate-y-[60px] items-center justify-center pt-[12%]"
      aria-hidden
    >
      <div className="aspect-square w-[40%] min-w-[128px] max-w-[240px] border-2 border-black bg-cream px-3 py-3 sm:px-4 sm:py-4">
        <p className="flex h-full items-center justify-center text-center font-script text-base leading-relaxed whitespace-pre-wrap text-ink sm:text-lg">
          {cardText}
        </p>
      </div>
    </div>
  );
}
