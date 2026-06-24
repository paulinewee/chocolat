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
    <main className="flex flex-col sm:h-dvh sm:max-h-dvh sm:overflow-hidden">
      <div className="safe-pad-x mx-auto flex w-full max-w-[1400px] flex-col px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:h-full sm:min-h-0 sm:flex-1 sm:overflow-hidden md:px-8 md:py-6">
        <SiteHeader
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

        <div className="mt-2 grid grid-cols-1 grid-rows-[auto_auto] gap-1 sm:mt-4 sm:min-h-0 sm:flex-1 sm:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-3 sm:overflow-hidden lg:grid-cols-2 lg:grid-rows-1 lg:gap-8">
          {/* Box — top on mobile, right on desktop */}
          <div className="order-1 relative z-20 flex h-[38dvh] items-center justify-center overflow-visible px-1 sm:h-auto sm:min-h-0 lg:order-2">
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

          {/* Picker — bottom on mobile, left on desktop */}
          <div className="order-2 relative z-10 min-h-0 overflow-hidden px-1 sm:overflow-x-hidden sm:overflow-y-auto sm:overscroll-contain sm:px-6 lg:order-1 lg:px-10">
            <ChocolatePicker
              pending={pending}
              onSelect={(type, shapeId) => setPending({ type, shapeId })}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
