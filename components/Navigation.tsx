'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useState } from 'react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Hikes', href: '/hikes' },
  { name: 'Photos', href: '/photos' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  const handleRipple = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const link = e.currentTarget
    const ripple = document.createElement('span')
    const rect = link.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`

    ripple.classList.add('ripple')
    link.appendChild(ripple)

    ripple.addEventListener('animationend', () => {
      ripple.remove()
    })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-glass border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" onClick={handleLinkClick}>
            Allen
          </Link>

          <div className="hidden md:flex items-center space-x-2 liquid-glass">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  handleLinkClick()
                  handleRipple(e)
                }}
                className={clsx(
                  'relative overflow-hidden text-sm transition-colors px-4 py-2 rounded-lg',
                  pathname === item.href
                    ? 'text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className='flex items-center space-x-4'>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={clsx(
                    'text-base transition-colors py-2 px-4 rounded-lg',
                    pathname === item.href
                      ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
