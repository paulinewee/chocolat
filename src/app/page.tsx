import Link from "next/link";
import Image from "next/image";
import { SITE_TITLE } from "@/lib/brand";

export default function LandingPage() {
  return (
    <main className="safe-pad-x relative flex min-h-dvh min-h-screen flex-col items-center justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/chocolates-svg/heart-m.svg"
          alt=""
          width={120}
          height={120}
          className="mb-6 sm:mb-8"
          aria-hidden
          unoptimized
        />
        <Link
          href="/"
          className="transition-opacity hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
        >
          <h1 className="text-center text-2xl tracking-tight sm:text-3xl md:text-4xl">
            {SITE_TITLE}
          </h1>
        </Link>
        <Link
          href="/create/box"
          aria-label="Begin"
          className="mt-10 flex h-12 w-12 touch-manipulation items-center justify-center text-ink sm:mt-12 sm:h-14 sm:w-14 focus:outline-none"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
