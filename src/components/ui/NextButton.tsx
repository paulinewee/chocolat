"use client";

import Link from "next/link";
import { flowButtonClass } from "@/components/ui/buttonStyles";

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
  label = "Next",
  className = "",
}: NextButtonProps) {
  const enabled =
    "bg-ink text-cream shadow-sm transition-[background-color,transform] hover:bg-ink/88 active:scale-[0.98]";
  const inactive =
    "cursor-not-allowed border border-ink/12 bg-button-disabled-bg text-button-disabled-text";

  const base = `${flowButtonClass} ${disabled ? inactive : enabled}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={`${base} ${className}`}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className}`}
    >
      {label}
    </button>
  );
}
