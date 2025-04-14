/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['shiki'],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/editor",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
