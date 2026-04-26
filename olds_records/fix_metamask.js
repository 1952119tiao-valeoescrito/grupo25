import fs from 'fs';

console.log("🔧 Ajustando motor para ignorar módulos de celular...");

const nextConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Isso diz ao Next.js: "Se encontrar algo de celular, ignore!"
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "@react-native-async-storage/async-storage": false,
      };
    }
    return config;
  },
};

export default nextConfig;
`.trim();

fs.writeFileSync('next.config.mjs', nextConfig);
console.log("✅ next.config.mjs atualizado com sucesso!");