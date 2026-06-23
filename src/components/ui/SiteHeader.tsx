import type { ReactNode } from "react";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";

interface SiteHeaderProps {
 title: ReactNode;
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
  <header className={`relative mb-3 pt-1 text-center sm:mb-4 sm:pt-2 md:mb-6 md:pt-3 ${className}`}>
   {backHref && (
    <div className="absolute left-0 top-1 sm:top-2 md:top-2.5">
     <BackButton href={backHref} />
    </div>
   )}

   {navEnd && (
    <div className="absolute right-0 top-1 sm:top-2 md:top-2.5">{navEnd}</div>
   )}

   <h1 className="mx-auto max-w-[min(100%,14rem)] px-[4.75rem] text-[18px] leading-tight tracking-tight sm:max-w-none sm:px-20 sm:text-[22px] md:text-[26px] lg:text-[30px]">
    {title}
   </h1>

   {hint && (
    <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-muted sm:mt-4 sm:text-xs sm:tracking-[0.2em]">
     {hint}
    </p>
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
    <h1 className="text-3xl tracking-tight md:text-4xl">
     chocolates for you
    </h1>
   </Link>
  </header>
 );
}
