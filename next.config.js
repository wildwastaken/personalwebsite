/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  headers() {
    return [{
      source: '/images/gallery/optimized/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    }]
  },
  redirects() {
    return [
      {
        source: "/justin",
        destination: "https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8?si=629f135ebd334022",
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
