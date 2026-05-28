import Link from "next/link";
import { LandingChocolateScatter } from "@/components/landing/LandingChocolateScatter";
import { flowButtonClass } from "@/components/ui/buttonStyles";
import { SITE_TITLE } from "@/lib/brand";

export default function LandingPage() {
  return (
    <main className="safe-pad-x relative flex min-h-dvh min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <LandingChocolateScatter />

      <div className="relative z-10 flex flex-col items-center">
        <Link
          href="/"
          className="transition-opacity hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
        >
          <h1 className="text-center font-script text-4xl italic tracking-tight sm:text-5xl md:text-6xl">
            {SITE_TITLE}
          </h1>
        </Link>
        <Link
          href="/create/box"
          className={`mt-10 min-h-11 touch-manipulation sm:mt-12 ${flowButtonClass} bg-ink text-cream shadow-sm transition-colors hover:bg-ink/88`}
        >
          Begin
        </Link>
      </div>
    </main>
  );
}
