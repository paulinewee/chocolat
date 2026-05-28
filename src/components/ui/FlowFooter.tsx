import type { ReactNode } from "react";
import { BackButton } from "@/components/ui/BackButton";

interface FlowFooterProps {
  backHref?: string;
  children: ReactNode;
  className?: string;
  /** Center children only (no back button row). */
  centered?: boolean;
}

export function FlowFooter({
  backHref,
  children,
  className = "",
  centered = false,
}: FlowFooterProps) {
  if (centered) {
    return (
      <div className={`flex justify-center ${className}`}>{children}</div>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 ${className}`}
    >
      {backHref ? <BackButton href={backHref} /> : <span aria-hidden className="w-px" />}
      <div className="ml-auto flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}
