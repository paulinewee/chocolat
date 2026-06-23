/** Convert a user-pasted URL into an embeddable iframe src */

export function toSpotifyEmbed(url: string): string {
  if (!url) return "";
  // https://open.spotify.com/track/ID → https://open.spotify.com/embed/track/ID
  // handles track, album, playlist, episode, artist
  return url
    .replace("open.spotify.com/", "open.spotify.com/embed/")
    .split("?")[0];
}

export function toMapEmbed(url: string): string {
  if (!url) return "";
  // Already an embed URL
  if (url.includes("/embed")) return url;
  // Extract coordinates: @lat,lng
  const coord = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coord) {
    return `https://maps.google.com/maps?q=${coord[1]},${coord[2]}&z=15&output=embed`;
  }
  // Extract place name
  const place = url.match(/place\/([^/@?]+)/);
  if (place) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(decodeURIComponent(place[1].replace(/\+/g, " ")))}&output=embed`;
  }
  // Generic fallback
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}output=embed`;
}

export function hasEmbed(mapUrl?: string, spotifyUrl?: string, imageUrl?: string) {
  return !!(mapUrl || spotifyUrl || imageUrl);
}
