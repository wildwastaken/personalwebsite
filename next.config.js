/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
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