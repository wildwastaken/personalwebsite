import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photos',
  description: 'Photos from Peru, the Canadian Rockies, Iceland, and New England.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
