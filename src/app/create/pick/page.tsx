"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChocolatePicker, type PendingChocolate } from "@/components/chocolate/ChocolatePicker";
import { DroppableBox } from "@/components/box/DroppableBox";
import { NextButton } from "@/components/ui/NextButton";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { useBoxBuilder } from "@/context/BoxBuilderContext";
import { useResponsiveBoxSize } from "@/hooks/useResponsiveBoxSize";

export default function PickChocolatesPage() {
  const router = useRouter();
  const { draft, spotCount, pickComplete, setChocolates } = useBoxBuilder();
  const [pending, setPending] = useState<PendingChocolate | null>(null);
  const boxSize = useResponsiveBoxSize("fit");
  const filledCount = draft.chocolates.length;

  return (
    <main className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-cream">
      <div className="safe-pad-x mx-auto flex h-full min-h-0 w-full max-w-[1400px] flex-col overflow-hidden px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-8 md:py-6">
        <SiteHeader
          className="mb-3 shrink-0 md:mb-5"
          title={
            <>
              <span className="sm:hidden">fill your box</span>
              <span className="hidden sm:inline">drag {spotCount} chocolates into the box</span>
            </>
          }
          hint={`${filledCount} / ${spotCount}`}
          backHref="/create/box"
          navEnd={
            <NextButton
              disabled={!pickComplete}
              onClick={() => pickComplete && router.push("/create/message")}
            />
          }
        />

        <p className="mb-2 shrink-0 text-center font-serif text-[11px] tracking-[0.04em] text-muted sm:hidden">
          Tap a chocolate, then tap a slot — or drag on desktop
        </p>

        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3 overflow-hidden sm:grid-rows-[minmax(0,1.05fr)_minmax(0,0.95fr)] sm:gap-4 lg:grid-cols-2 lg:grid-rows-1 lg:gap-8">
          <div className="min-h-0 overflow-hidden">
            <ChocolatePicker
              pending={pending}
              onSelect={(type, shapeId) => setPending({ type, shapeId })}
            />
          </div>

          <div className="flex h-full min-h-0 flex-col items-center overflow-hidden">
            <DroppableBox
              className="h-full"
              shape={draft.boxShape}
              color={draft.boxColor}
              chocolates={draft.chocolates}
              onChange={setChocolates}
              spotCount={spotCount}
              size={boxSize}
              pending={pending}
              onPendingPlaced={() => setPending(null)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
