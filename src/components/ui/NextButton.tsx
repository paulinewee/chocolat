"use client";

import Link from "next/link";
import { BrushNavArrow, navControlClass } from "@/components/ui/BrushNavArrow";

interface NextButtonProps {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function NextButton({
  href,
  onClick,
  disabled,
  label = "next",
  className = "",
}: NextButtonProps) {
  const controlClass = `${navControlClass} ${className}`;

  const arrow = <BrushNavArrow direction="right" />;

  if (href && !disabled) {
    return (
      <Link href={href} aria-label={label} className={controlClass}>
        {arrow}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={controlClass}
    >
      {arrow}
    </button>
  );
}
