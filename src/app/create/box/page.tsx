"use client";

import { useRouter } from "next/navigation";
import { FadingAssetImage } from "@/components/ui/FadingAssetImage";
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
        <FadingAssetImage
          src={getBoxImageSrc(box.id as BoxShape, "full", color)}
          alt=""
          width={BOX_IMAGE_SIZES.picker.w}
          height={BOX_IMAGE_SIZES.picker.h}
          containerClassName="relative z-[1] mx-auto aspect-square w-full max-h-[min(26vh,175px)] sm:max-h-[min(32vh,220px)] md:max-h-[265px]"
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
  const row1 = BOX_SHAPES.slice(0, 2);
  const row2 = BOX_SHAPES.slice(2, 4);
  const row3 = BOX_SHAPES.slice(4);

  const rowClass = "grid w-full max-w-sm grid-cols-2 items-end gap-3 overflow-visible sm:max-w-lg sm:gap-8";

  return (
    <div className="flex w-full flex-col items-center gap-1 sm:gap-2 md:gap-3">
      <div className={rowClass}>
        {row1.map((box) => (
          <BoxOption key={box.id} box={box} selected={selected === box.id} color={color} onSelect={onSelect} />
        ))}
      </div>
      <div className={rowClass}>
        {row2.map((box) => (
          <BoxOption key={box.id} box={box} selected={selected === box.id} color={color} onSelect={onSelect} />
        ))}
      </div>
      {row3.length > 0 && (
        <div className="flex w-full max-w-sm items-end justify-center gap-3 overflow-visible sm:max-w-lg sm:gap-8">
          {row3.map((box) => (
            <div key={box.id} className="w-1/2">
              <BoxOption box={box} selected={selected === box.id} color={color} onSelect={onSelect} />
            </div>
          ))}
        </div>
      )}
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
      <div className="mb-6 flex justify-center gap-3 sm:mb-8 md:mb-10">
        {BOX_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setBoxColor(c.value)}
            aria-label={c.label}
            className={`h-7 w-7 touch-manipulation rounded-full border-2 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-7 sm:w-7 md:h-6 md:w-6 ${
              draft.boxColor === c.value
                ? "scale-110 border-ink"
                : "border-ink/20"
            }`}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>

      <div className="overflow-visible px-1 sm:px-0">
        <BoxShapeGrid
          selected={draft.boxShape}
          color={draft.boxColor}
          onSelect={setBoxShape}
        />
      </div>
    </PageShell>
  );
}
