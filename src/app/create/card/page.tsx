"use client";

import { useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { NextButton } from "@/components/ui/NextButton";
import { PageShell } from "@/components/ui/PageShell";
import { useBoxBuilder } from "@/context/BoxBuilderContext";
import { useRequireCardReady } from "@/hooks/useCreateFlowGuard";
import { getBoxAssetName, getBoxColorFolder } from "@/lib/assets";
import { getBoxShareUrl } from "@/lib/site-url";

export default function WriteCardPage() {
 const { draft, pickComplete, setCardText, finalizeAndSave } = useBoxBuilder();
 const ready = useRequireCardReady();
 const [saveError, setSaveError] = useState(false);
 const [saving, setSaving] = useState(false);
 const ribbon1Src = `/boxes/${getBoxColorFolder(draft.boxColor)}/${getBoxAssetName(draft.boxShape)}-ribbon-1.svg`;
 const ribbonFallbackSrc = `/boxes/${getBoxColorFolder(draft.boxColor)}/${getBoxAssetName(draft.boxShape)}-ribbon.svg`;
 const [failedRibbonSrc, setFailedRibbonSrc] = useState<string | null>(null);
 const cardBgSrc =
  failedRibbonSrc === ribbon1Src ? ribbonFallbackSrc : ribbon1Src;

 const handleNext = async () => {
  setSaveError(false);
  setSaving(true);
  const id = await finalizeAndSave();
  setSaving(false);
  if (!id) {
   setSaveError(true);
   return;
  }
  window.open(getBoxShareUrl(id), "_blank", "noopener,noreferrer");
 };

 if (!ready) {
  return (
   <main className="flex min-h-screen items-center justify-center">
    <span className="font-mono text-xs tracking-widest text-muted">loading…</span>
   </main>
  );
 }

 const canFinish = draft.cardText.trim().length > 0 && pickComplete;

 return (
  <PageShell
   title="write the card"
   backHref="/create/message"
   navEnd={
    <NextButton
     onClick={() => void handleNext()}
     disabled={!canFinish || saving}
     label={saving ? "saving…" : "finish"}
    />
   }
  >
   <div className="relative flex w-full flex-1 flex-col items-center overflow-visible">
    {/* Card — upper area, large */}
    <div className="relative z-10 mx-auto mt-2 w-[min(86%,380px)] sm:mt-4">
     <div className="border-2 border-ink bg-cream px-4 py-4 shadow-sm sm:px-6 sm:py-5">
      <textarea
       value={draft.cardText}
       onChange={(e) => setCardText(e.target.value)}
       placeholder="Dear you, ..."
       rows={7}
       className="min-h-[160px] w-full resize-none bg-transparent p-1 text-center text-lg leading-relaxed text-ink placeholder:text-ink/45 focus:outline-none sm:min-h-[190px] sm:text-xl"
      />
     </div>
    </div>

    {/* Box image — large, sits below the card and naturally overflows the page */}
    <div className="pointer-events-none absolute top-[10%] left-1/2 w-[min(160%,980px)] -translate-x-1/2 hidden sm:block">
     <AssetImage
      key={ribbon1Src}
      src={cardBgSrc}
      alt=""
      width={900}
      height={900}
      className="h-auto w-full object-contain"
      onError={() => setFailedRibbonSrc(ribbon1Src)}
     />
    </div>

    {saveError && (
     <p className="text-sm text-rose-700" role="alert">
      Could not save your box. Check your connection and try again.
     </p>
    )}
   </div>
  </PageShell>
 );
}
