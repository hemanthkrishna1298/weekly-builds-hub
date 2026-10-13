import type { NextConfig } from "next";

// Fully static export, served from Cloudflare Workers static assets.
// No server code: every route (including /feed.xml and the OG images) is
// rendered to a file in ./out at build time.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
