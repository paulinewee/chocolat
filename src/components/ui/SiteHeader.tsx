import type { ReactNode } from "react";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";

interface SiteHeaderProps {
  title: string;
  hint?: ReactNode;
  backHref?: string;
  /** Right-side nav action (e.g. NEXT) aligned with BACK */
  navEnd?: ReactNode;
  className?: string;
}

export function SiteHeader({
  title,
  hint,
  backHref,
  navEnd,
  className = "",
}: SiteHeaderProps) {
  return (
    <header className={`relative mb-6 pt-2 text-center md:mb-8 md:pt-4 ${className}`}>
      {backHref && (
        <div className="absolute left-0 top-2 md:top-2.5">
          <BackButton href={backHref} />
        </div>
      )}

      {navEnd && (
        <div className="absolute right-0 top-2 md:top-2.5">{navEnd}</div>
      )}

      <h1 className="font-script text-[32px] italic tracking-tight md:text-[38px] lg:text-[44px]">
        {title}
      </h1>

      {hint && (
        <p className="mt-4 font-mono text-xs tracking-[0.2em] text-muted">{hint}</p>
      )}
    </header>
  );
}

/** Home / landing — brand title links to root */
export function SiteBrandHeader({ className = "" }: { className?: string }) {
  return (
    <header className={`text-center ${className}`}>
      <Link
        href="/"
        className="inline-block transition-opacity hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
      >
        <h1 className="font-script text-5xl italic tracking-tight md:text-6xl">
          chocolates for you
        </h1>
      </Link>
    </header>
  );
}
