"use client";

import { useParams } from "next/navigation";
import { ShareExperience } from "@/components/share/ShareExperience";
import { useSharedBox } from "@/context/BoxBuilderContext";
import { isValidBoxId } from "@/lib/box-validation";
import Link from "next/link";

export default function SharedBoxPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const idValid = isValidBoxId(id);
  const { box, loading, error } = useSharedBox(idValid ? id : "");

  if (!idValid) {
    return (
      <main className="safe-pad-x flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center sm:px-6">
        <p className="font-script text-2xl italic">Invalid link</p>
        <p className="mt-2 font-serif text-sm text-muted">
          This URL does not look like a valid box link.
        </p>
        <Link href="/" className="mt-8 font-serif text-sm tracking-[0.04em] text-muted underline">
          Make a new box
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <span className="font-serif text-sm text-muted">Loading…</span>
      </main>
    );
  }

  if (!box) {
    return (
      <main className="safe-pad-x flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center sm:px-6">
        <p className="font-script text-2xl italic">This box could not be found</p>
        <p className="mt-2 max-w-sm font-serif text-sm text-muted">
          {error
            ? "Something went wrong loading this box. Please try again in a moment."
            : "The link may be wrong, or the box may have been removed."}
        </p>
        <Link href="/" className="mt-8 font-serif text-sm tracking-[0.04em] text-muted underline">
          Make a new box
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <ShareExperience box={box} />
      <div className="pb-12 text-center">
        <Link
          href="/"
          className="font-serif text-sm tracking-[0.04em] text-muted hover:text-ink"
        >
          Create your own
        </Link>
      </div>
    </main>
  );
}
