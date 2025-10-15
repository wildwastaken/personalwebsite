import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Allen Liu',
  description: 'Junior at Princeton University. Book worm, nature enthusiast, and chess fanatic.',
  keywords: ['Allen Liu', 'Princeton University', 'Developer', 'Student'],
  authors: [{ name: 'Allen Liu' }],
  openGraph: {
    title: 'Allen Liu',
    description: 'Junior at Princeton University. Book worm, nature enthusiast, and chess fanatic.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors`}>
        <ThemeProvider>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}