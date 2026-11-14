import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TopoPixel',
  description: 'Turn photos into dithered pixel art in the browser.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
