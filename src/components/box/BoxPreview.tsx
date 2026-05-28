"use client";

import { messageHasContent } from "@/lib/message-utils";
import type { BoxShape, ChocolateMessage, PlacedChocolate } from "@/types";
import { BOX_SPOT_COUNTS } from "@/types";
import { ChocolatePiece } from "@/components/chocolate/ChocolatePiece";
import { BOX_CHOCOLATE_PX, BoxSlotLayer, BoxVisual } from "@/components/box/BoxVisual";

interface BoxPreviewProps {
  shape: BoxShape;
  color: string;
  chocolates?: PlacedChocolate[];
  messages?: ChocolateMessage[];
  showLid?: boolean;
  showRibbon?: boolean;
  interactive?: boolean;
  onChocolateClick?: (slotIndex: number) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  onLidClick?: () => void;
  lidLifted?: boolean;
  /** Rose dot on chocolates with messages (off on write-the-card preview). */
  showMessageIndicators?: boolean;
}

const SIZE_MAP = {
  sm: "picker" as const,
  md: "md" as const,
  lg: "lg" as const,
};

export function BoxPreview({
  shape,
  color,
  chocolates = [],
  messages = [],
  showLid = false,
  showRibbon = false,
  interactive = false,
  onChocolateClick,
  className = "",
  size = "md",
  onLidClick,
  lidLifted,
  showMessageIndicators = true,
}: BoxPreviewProps) {
  const boxSize = SIZE_MAP[size];
  const spotCount = BOX_SPOT_COUNTS[shape];
  const useRibbonLid = showRibbon || showLid;

  const getChocolate = (index: number) =>
    chocolates.find((c) => c.slotIndex === index);

  const getMessage = (index: number) =>
    messages.find((m) => m.slotIndex === index);

  const slotContent = (
    <BoxSlotLayer shape={shape} size={boxSize} spotCount={spotCount}>
      {(index) => {
        const choc = getChocolate(index);
        const msg = getMessage(index);
        if (!choc) return null;
        const chocPx =
          boxSize === "lg"
            ? BOX_CHOCOLATE_PX.lg
            : boxSize === "md"
              ? BOX_CHOCOLATE_PX.md
              : undefined;

        return (
          <ChocolatePiece
            type={choc.type}
            shapeId={choc.shapeId}
            size="slot"
            pixelSize={chocPx}
            hasMessage={showMessageIndicators && messageHasContent(msg)}
            interactive={interactive}
            onClick={
              interactive && onChocolateClick
                ? () => onChocolateClick(index)
                : undefined
            }
          />
        );
      }}
    </BoxSlotLayer>
  );

  if (useRibbonLid) {
    return (
      <div className={`relative mx-auto ${className}`}>
        <BoxVisual
          shape={shape}
          color={color}
          size={boxSize}
          stacked
          lidVariant={showRibbon ? "ribbon" : "top"}
          onLidClick={onLidClick}
          lidLifted={lidLifted}
        >
          {slotContent}
        </BoxVisual>
      </div>
    );
  }

  return (
    <div className={`relative mx-auto ${className}`}>
      <BoxVisual shape={shape} color={color} size={boxSize}>
        {slotContent}
      </BoxVisual>
    </div>
  );
}
