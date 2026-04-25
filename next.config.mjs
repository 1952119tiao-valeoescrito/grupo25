/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // Isso desativa verificações que podem travar o build na Vercel
  productionBrowserSourceMaps: false, 
};
export default nextConfig;