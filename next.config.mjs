// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@auth/prisma-adapter'], // necessário pro Auth.js v5
  experimental: {
    serverSourceMaps: false,  // ← Mata o erro vermelho para sempre em dev
  },
}

export default nextConfig