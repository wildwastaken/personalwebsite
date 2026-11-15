import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Things I’ve built for friends, classes, and hackathons.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
