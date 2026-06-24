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
  <header className={`mb-3 sm:mb-4 md:mb-6 ${className}`}>
   <div className="flex items-center gap-2">
    <div className="flex w-11 shrink-0 justify-start">
     {backHref && <BackButton href={backHref} />}
    </div>

    <h1 className="min-w-0 flex-1 whitespace-nowrap text-center text-[18px] leading-tight tracking-tight sm:whitespace-normal sm:text-[22px] md:text-[26px] lg:text-[30px]">
     {title}
    </h1>

    <div className="flex w-11 shrink-0 justify-end">
     {navEnd}
    </div>
   </div>

   {hint && (
    <p className="mt-3 hidden font-mono text-[10px] tracking-[0.18em] text-muted sm:mt-4 sm:block sm:text-xs sm:tracking-[0.2em]">
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
