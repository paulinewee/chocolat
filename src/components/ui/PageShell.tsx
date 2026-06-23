import type { ReactNode } from "react";
import { SiteHeader } from "@/components/ui/SiteHeader";

interface PageShellProps {
  title: string;
  headerHint?: ReactNode;
  backHref?: string;
  navEnd?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export function PageShell({
  title,
  headerHint,
  backHref,
  navEnd,
  children,
  footer,
  wide,
}: PageShellProps) {
  return (
    <main className="flex min-h-dvh min-h-screen flex-col">
      <div
        className={`safe-pad-x mx-auto flex w-full flex-1 flex-col px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10 ${
          wide ? "max-w-7xl" : "max-w-4xl"
        }`}
      >
        <SiteHeader title={title} hint={headerHint} backHref={backHref} navEnd={navEnd} />
        <div className="flex flex-1 flex-col">{children}</div>
        {footer && <footer className="mt-auto pt-10 md:pt-12">{footer}</footer>}
      </div>
    </main>
  );
}
