import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expeditions',
  description: 'Hikes through Peru, the Canadian Rockies, Iceland, and the White Mountains.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
