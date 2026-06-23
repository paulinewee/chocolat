import type { PaperTextureProps } from "@paper-design/shaders-react";

/** Full-viewport paper grain ([Paper Texture](https://shaders.paper.design/paper-texture)) */
export const PAGE_PAPER_TEXTURE_PROPS = {
  colorBack: "#f5efe2",
  colorFront: "#c4b090",
  contrast: 0.28,
  roughness: 0.52,
  fiber: 0.32,
  fiberSize: 0.18,
  crumples: 0.42,
  crumpleSize: 0.38,
  folds: 0.22,
  foldCount: 4,
  drops: 0.12,
  fade: 0,
  seed: 5.8,
  scale: 0.7,
  fit: "cover",
  speed: 0,
  frame: 0,
} satisfies Partial<PaperTextureProps>;
