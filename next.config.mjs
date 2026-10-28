/**
 * Static export for GitHub Pages. The site is a project page at
 * https://vanomarb.github.io/lowband/, so every route and asset lives under /lowband.
 * next/link, next/font and the _next/ assets pick up basePath on their own.
 */
const basePath = "/lowband";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  // Pages serves /app/ as app/index.html.
  trailingSlash: true,
  // No image optimizer in a static export; artwork comes sized from the Apple CDN anyway.
  images: { unoptimized: true },
};

export default nextConfig;
