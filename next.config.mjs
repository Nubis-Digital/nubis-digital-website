/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare Pages serves images without the Next image optimizer.
  images: { unoptimized: true },
  // Legacy browsers/crawlers probe /favicon.ico by default; point it at the SVG mark
  // so it resolves instead of 404-ing. The modern icon link comes from src/app/icon.svg.
  async redirects() {
    return [
      { source: '/favicon.ico', destination: '/icon.svg', permanent: true },
    ];
  },
};

export default nextConfig;
