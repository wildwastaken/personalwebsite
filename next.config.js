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
  // Small static apps built from their own repos into public/ (see scripts/sync-apps.sh).
  rewrites() {
    const staticApps = ['cooksplit', 'calledit'].map((app) => ({
      source: `/${app}`,
      destination: `/${app}/index.html`,
    }))
    // Hardcover Wrapped needs a server, so it's its own Vercel project (basePath /wrapped).
    const wrapped = 'https://hardcover-wrapped.vercel.app'
    return [
      ...staticApps,
      { source: '/wrapped', destination: `${wrapped}/wrapped` },
      { source: '/wrapped/:path*', destination: `${wrapped}/wrapped/:path*` },
    ]
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
