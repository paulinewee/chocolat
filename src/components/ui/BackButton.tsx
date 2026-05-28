import Link from "next/link";
import { flowButtonClass } from "@/components/ui/buttonStyles";

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = "Back", className = "" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={
        `${flowButtonClass} border border-ink/20 bg-white text-ink transition-colors hover:border-ink/40 hover:bg-cream ` +
        className
      }
    >
      {label}
    </Link>
  );
}
