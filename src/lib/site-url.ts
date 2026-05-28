/** Public site origin for share links (set on Vercel: chocolates-for-you.vercel.app). */
export function getPublicSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function getBoxShareUrl(boxId: string): string {
  const base = getPublicSiteUrl();
  return base ? `${base}/box/${boxId}` : `/box/${boxId}`;
}
