import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Allen Liu',
  description: 'Projects, hikes, and photos. Senior at Princeton University.',
  keywords: ['Allen Liu', 'Princeton University', 'Projects', 'Hikes', 'Photos', 'Software'],
  authors: [{ name: 'Allen Liu' }],
  openGraph: {
    title: 'Allen Liu',
    description: 'Projects, hikes, and photos. Senior at Princeton University.',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=new URLSearchParams(window.location.search);var q=p.get('theme');var t=q||localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-[#FFFCF0] dark:bg-[#161615] text-[#100F0F] dark:text-[#CECDC3] min-h-screen selection:bg-[#E6E4D9] dark:selection:bg-[#282726] selection:text-[#100F0F] dark:selection:text-[#CECDC3]">
        <ThemeProvider>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-5 sm:py-7 min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
