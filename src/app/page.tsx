import Link from "next/link";
import { flowButtonClass } from "@/components/ui/buttonStyles";
import { SITE_TITLE } from "@/lib/brand";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <Link
        href="/"
        className="transition-opacity hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
      >
        <h1 className="font-script text-5xl italic tracking-tight md:text-6xl">
          {SITE_TITLE}
        </h1>
      </Link>
      <Link
        href="/create/box"
        className={`mt-12 ${flowButtonClass} bg-ink text-cream shadow-sm transition-colors hover:bg-ink/88`}
      >
        Begin
      </Link>
    </main>
  );
}
