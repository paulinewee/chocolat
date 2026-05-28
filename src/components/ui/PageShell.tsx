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
    <main className="flex min-h-screen flex-col bg-cream">
      <div
        className={`mx-auto flex w-full flex-1 flex-col px-6 py-10 ${
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
