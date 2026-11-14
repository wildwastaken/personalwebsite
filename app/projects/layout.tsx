import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Software tools, hackathon prototypes, and side projects.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
