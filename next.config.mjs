/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Published as static files on GitHub Pages (www.nubisdigital.com).
  output: 'export',
  // Static hosting has no Next image optimizer.
  images: { unoptimized: true },
};

export default nextConfig;
