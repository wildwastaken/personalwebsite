import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photos',
  description: 'Photos from the Andes, the Canadian Rockies, Iceland, and the White Mountains.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
