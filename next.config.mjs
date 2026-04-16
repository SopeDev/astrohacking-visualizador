/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined

const nextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  ...(basePath
    ? { basePath, assetPrefix: `${basePath}/` }
    : {}),
}

export default nextConfig
