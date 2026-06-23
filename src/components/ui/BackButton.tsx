import Link from "next/link";
import { BrushNavArrow, navControlClass } from "@/components/ui/BrushNavArrow";

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = "back", className = "" }: BackButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${navControlClass} ${className}`}
    >
      <BrushNavArrow direction="left" />
    </Link>
  );
}
