import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Single pattern, no `search: ''` — allows local images with or without query strings
    localPatterns: [{ pathname: "/**" }],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
