"use client";

import { useRouter } from "next/navigation";
import { AssetImage } from "@/components/ui/AssetImage";
import { NextButton } from "@/components/ui/NextButton";
import { PageShell } from "@/components/ui/PageShell";
import { useBoxBuilder } from "@/context/BoxBuilderContext";
import { BOX_COLORS, BOX_SHAPES } from "@/lib/data";
import { BOX_IMAGE_SIZES, getBoxImageSrc } from "@/lib/assets";
import type { BoxShape } from "@/types";

function BoxOption({
  box,
  selected,
  color,
  onSelect,
}: {
  box: (typeof BOX_SHAPES)[number];
  selected: boolean;
  color: string;
  onSelect: (shape: BoxShape) => void;
}) {
  return (
    <div className={`box-picker-cell ${selected ? "relative z-20" : "relative z-0"}`}>
      <button
        type="button"
        onClick={() => onSelect(box.id as BoxShape)}
        aria-label={box.label}
        aria-pressed={selected}
        className={`box-picker-btn ${selected ? "box-picker-btn--selected" : ""}`}
      >
        <span className="box-picker-halo" aria-hidden />
        <AssetImage
          src={getBoxImageSrc(box.id as BoxShape, "full", color)}
          alt=""
          width={BOX_IMAGE_SIZES.picker.w}
          height={BOX_IMAGE_SIZES.picker.h}
          className="relative z-[1] mx-auto h-auto w-full max-h-[min(32vh,220px)] object-contain sm:max-h-[min(34vh,245px)] md:max-h-[265px]"
        />
      </button>
    </div>
  );
}

function BoxShapeGrid({
  selected,
  color,
  onSelect,
}: {
  selected: BoxShape;
  color: string;
  onSelect: (shape: BoxShape) => void;
}) {
  const topRow = BOX_SHAPES.slice(0, 3);
  const bottomRow = BOX_SHAPES.slice(3);

  return (
    <div className="flex w-full flex-col items-center gap-10 py-4 md:gap-14 md:py-6">
      <div className="grid w-full max-w-3xl grid-cols-3 items-end gap-8 md:max-w-4xl md:gap-12">
        {topRow.map((box) => (
          <BoxOption
            key={box.id}
            box={box}
            selected={selected === box.id}
            color={color}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="flex w-full max-w-lg items-end justify-center gap-12 md:max-w-2xl md:gap-20">
        {bottomRow.map((box) => (
          <BoxOption
            key={box.id}
            box={box}
            selected={selected === box.id}
            color={color}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default function PickBoxPage() {
  const router = useRouter();
  const { draft, setBoxShape, setBoxColor } = useBoxBuilder();
  const boxChosen = !!draft.boxShapeChosen;

  return (
    <PageShell
      wide
      title="pick a box"
      backHref="/"
      navEnd={
        <NextButton
          disabled={!boxChosen}
          onClick={() => router.push("/create/pick")}
        />
      }
    >
      <div className="mb-8 flex justify-center gap-3 md:mb-10">
        {BOX_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setBoxColor(c.value)}
            aria-label={c.label}
            className={`h-7 w-7 rounded-full border-2 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              draft.boxColor === c.value
                ? "scale-110 border-ink"
                : "border-ink/20"
            }`}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>

      <div className="my-4 md:my-8">
        <BoxShapeGrid
          selected={draft.boxShape}
          color={draft.boxColor}
          onSelect={setBoxShape}
        />
      </div>
    </PageShell>
  );
}
