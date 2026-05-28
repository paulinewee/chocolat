"use client";

/** Read-only card on the closed ribbon box (first tap in share flow). */
export function ShareBoxCardOverlay({ cardText }: { cardText: string }) {
  return (
    <div
      className="message-reveal pointer-events-none absolute inset-0 z-[4] flex translate-y-10 items-center justify-center pt-[14%] sm:translate-y-[60px] sm:pt-[12%]"
      aria-hidden
    >
      <div className="aspect-square w-[44%] min-w-[112px] max-w-[200px] border-2 border-black bg-cream px-2.5 py-2.5 sm:w-[40%] sm:min-w-[128px] sm:max-w-[240px] sm:px-4 sm:py-4">
        <p className="flex h-full items-center justify-center text-center font-script text-sm leading-relaxed whitespace-pre-wrap text-ink sm:text-lg">
          {cardText}
        </p>
      </div>
    </div>
  );
}
