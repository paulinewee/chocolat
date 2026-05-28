"use client";

import { useState } from "react";
import { BoxPreview } from "@/components/box/BoxPreview";
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
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <span className="font-mono text-xs tracking-widest text-muted">LOADING…</span>
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
          label={saving ? "Saving…" : "Finish"}
        />
      }
    >
      <div className="flex flex-1 flex-col items-center gap-6 sm:gap-10">
        <div className="relative">
          <BoxPreview
            shape={draft.boxShape}
            color={draft.boxColor}
            chocolates={draft.chocolates}
            messages={draft.messages}
            showRibbon
            showMessageIndicators={false}
            size="lg"
          />
        </div>

        <div className="relative w-full max-w-xl">
          <AssetImage
            key={ribbon1Src}
            src={cardBgSrc}
            alt=""
            width={900}
            height={540}
            className="h-auto w-full object-contain"
            onError={() => setFailedRibbonSrc(ribbon1Src)}
          />
          <div className="absolute inset-x-0 bottom-[5%] flex justify-center px-[9%] sm:bottom-[6%] sm:px-[11%]">
            <div className="w-full max-w-[280px] border-2 border-black bg-cream px-4 py-4 sm:max-w-[300px]">
              <textarea
                value={draft.cardText}
                onChange={(e) => setCardText(e.target.value)}
                placeholder="Dear you, ..."
                rows={7}
                className="min-h-[150px] w-full resize-none bg-transparent p-1 text-center font-script text-lg leading-relaxed text-ink placeholder:text-ink/45 focus:outline-none sm:min-h-[170px] sm:text-xl"
              />
            </div>
          </div>
        </div>

        {saveError && (
          <p className="font-serif text-sm text-rose-700" role="alert">
            Could not save your box. Check your connection and try again.
          </p>
        )}
      </div>
    </PageShell>
  );
}
