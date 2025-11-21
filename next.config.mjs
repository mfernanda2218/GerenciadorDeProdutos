// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@auth/prisma-adapter'], // necessário pro Auth.js v5
}

export default nextConfig