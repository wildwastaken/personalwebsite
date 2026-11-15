'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

const navLinks = [
  { name: 'About', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Expeditions', href: '/hikes' },
  { name: 'Photos', href: '/photos' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-[#E6E4D9] dark:border-[#282726] pt-3 sm:pt-4 pb-3 mb-5 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
        <div className="relative inline-block">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-tight no-underline text-[#100F0F] dark:text-[#CECDC3] hover:text-[#403C34] dark:hover:text-[#E6E4D9] transition-colors"
          >
            Allen Liu
          </Link>
        </div>

        {/* Clean Nav Links */}
        <nav className="flex flex-wrap items-center gap-x-3.5 sm:gap-x-5 gap-y-2 font-mono text-xs">
          {navLinks.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`no-underline hover:underline transition-colors ${
                  isActive
                    ? 'font-bold text-[#100F0F] dark:text-[#CECDC3] underline underline-offset-4 decoration-[#100F0F] dark:decoration-[#CECDC3]'
                    : 'text-[#6F6E69] dark:text-[#878580] hover:text-[#100F0F] dark:hover:text-[#CECDC3]'
                }`}
              >
                {item.name}
              </Link>
            )
          })}

          <button
            onClick={toggleTheme}
            suppressHydrationWarning
            className="text-[#6F6E69] dark:text-[#878580] hover:text-[#100F0F] dark:hover:text-[#CECDC3] font-mono text-xs cursor-pointer bg-transparent border-0 p-0"
            aria-label="Toggle paper theme"
            title="Toggle theme"
          >
            [{theme === 'dark' ? 'paper' : 'dark'}]
          </button>
        </nav>
      </div>
    </header>
  )
}
