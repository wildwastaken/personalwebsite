import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Year in Books',
  description: 'What Allen Liu finished reading this year: books, pages, favorites, and authors, from Hardcover.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
