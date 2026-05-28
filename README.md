# Chocolat

A minimalist Next.js app for building and sharing a digital box of chocolates.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Flow

1. **Landing** — “chocolates for you”
2. **Pick a box** — circle (7), square (9), flower (6), heart (8), or butterfly (9) + 6 color swatches
3. **Pick chocolates** — split view: 3×5 grid per WHITE / MILK / DARK tab, drag into box slots; NEXT when full
4. **Add a message** — click chocolates to attach notes (rich text, Maps, Spotify, image URL)
5. **Write the card** — box with lid & ribbon; write card text → shareable link
6. **Recipient view** — read card → lift lid → click chocolates (3 bites) to reveal messages

## Assets

Placeholder emoji shapes stand in for illustrated chocolates and boxes. Drop real assets into `public/` and wire them in `ChocolatePiece` and box components.

## Storage

Boxes are saved to `localStorage` (demo). Share links work in the same browser. Add Supabase or similar for production sharing.
