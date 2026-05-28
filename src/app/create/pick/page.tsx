"use client";

import { useRouter } from "next/navigation";
import { ChocolatePicker } from "@/components/chocolate/ChocolatePicker";
import { DroppableBox } from "@/components/box/DroppableBox";
import { NextButton } from "@/components/ui/NextButton";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { useBoxBuilder } from "@/context/BoxBuilderContext";

export default function PickChocolatesPage() {
  const router = useRouter();
  const { draft, spotCount, pickComplete, setChocolates } = useBoxBuilder();
  const filledCount = draft.chocolates.length;

  return (
    <main className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-cream">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1400px] flex-col overflow-hidden px-4 py-4 md:px-8 md:py-6">
        <SiteHeader
          className="mb-4 shrink-0 md:mb-5"
          title={`drag ${spotCount} chocolates into the box`}
          hint={`${filledCount} / ${spotCount}`}
          backHref="/create/box"
          navEnd={
            <NextButton
              disabled={!pickComplete}
              onClick={() => pickComplete && router.push("/create/message")}
            />
          }
        />

        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-4 overflow-hidden lg:grid-cols-2 lg:grid-rows-1 lg:gap-8">
          <div className="min-h-0 overflow-hidden">
            <ChocolatePicker />
          </div>

          <div className="flex h-full min-h-0 flex-col items-center overflow-hidden">
            <DroppableBox
              className="h-full"
              shape={draft.boxShape}
              color={draft.boxColor}
              chocolates={draft.chocolates}
              onChange={setChocolates}
              spotCount={spotCount}
              size="fit"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
