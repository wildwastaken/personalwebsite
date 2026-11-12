'use client'

import { useState } from 'react'
import type { BookEntry, YearStats } from '@/lib/books'

export type BooksResponse = (YearStats & { sample?: boolean; unavailable?: undefined }) | { unavailable: true }

const SHELF_URL = 'https://hardcover.app/@allenliu/'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const muted = 'text-[#6F6E69] dark:text-[#878580]'
const strong = 'text-[#100F0F] dark:text-[#CECDC3]'
const label = `font-mono text-[11px] uppercase tracking-widest ${muted}`
const cardBase = 'rounded-sm border border-[#E6E4D9] dark:border-[#282726] bg-[#FFFCF0] dark:bg-[#161615] p-5 sm:p-7'
const card = `${cardBase} space-y-4`

const number = (n: number) => n.toLocaleString('en-US')
const plural = (n: number, word: string) => `${number(n)} ${word}${n === 1 ? '' : 's'}`
const shortDate = (date: string) => `${MONTHS[Number(date.slice(5, 7)) - 1]} ${Number(date.slice(8, 10))}`
const stars = (rating: number) => (Number.isInteger(rating) ? `${rating}` : rating.toFixed(1))

function ShelfLink({ children = 'My shelf on Hardcover ↗' }: { children?: React.ReactNode }) {
  return (
    <a href={SHELF_URL} target="_blank" rel="noopener noreferrer" className={`font-mono text-xs ${strong} hover:underline underline-offset-4`}>
      {children}
    </a>
  )
}

function Title({ book }: { book: BookEntry }) {
  return book.url ? (
    <a href={book.url} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline underline-offset-4">
      {book.title}
    </a>
  ) : (
    <>{book.title}</>
  )
}

function Cover({ book, className = '', compact = false }: { book: BookEntry; className?: string; compact?: boolean }) {
  const [failed, setFailed] = useState(false)
  const showImage = book.cover && !failed
  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-sm border border-[#E6E4D9] dark:border-[#282726] bg-[#E6E4D9] dark:bg-[#282726] ${className}`}
      style={book.color ? { backgroundColor: book.color } : undefined}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={book.cover} alt={`Cover of ${book.title}`} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : compact ? null : (
        <div className={`flex h-full w-full items-end p-2 font-serif text-xs leading-snug ${book.color ? 'text-[#FFFCF0]' : strong}`}>{book.title}</div>
      )}
    </div>
  )
}

function MonthChart({ months }: { months: number[] }) {
  const max = Math.max(1, ...months)
  return (
    <div className="grid grid-cols-12 items-end gap-1.5 sm:gap-2" role="img" aria-label={months.map((n, i) => `${MONTHS[i]}: ${n}`).join(', ')}>
      {months.map((count, i) => (
        <div key={MONTHS[i]} className="flex flex-col items-center gap-1.5" title={`${MONTH_NAMES[i]}: ${plural(count, 'book')}`}>
          <span className={`font-mono text-[10px] ${count ? muted : 'text-transparent'}`}>{count}</span>
          <div className="flex h-24 w-full items-end justify-center">
            <div
              className={`w-full max-w-[14px] rounded-[2px] ${count ? 'bg-[#6F6E69] dark:bg-[#878580]' : 'bg-[#E6E4D9] dark:bg-[#282726]'}`}
              style={{ height: count ? `${Math.max(8, (count / max) * 100)}%` : '2px' }}
            />
          </div>
          <span className={`font-mono text-[10px] ${muted}`}>{MONTHS[i].charAt(0)}</span>
        </div>
      ))}
    </div>
  )
}

function Ranked({ items, unit }: { items: { name: string; count: number }[]; unit: string }) {
  const max = Math.max(1, ...items.map(item => item.count))
  return (
    <ol className="space-y-2.5">
      {items.map((item, i) => (
        <li key={item.name} className="grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-baseline gap-3">
          <span className={`font-mono text-[11px] ${muted}`}>{i + 1}</span>
          <div className="min-w-0 space-y-1">
            <p className={`font-serif text-base truncate ${strong}`}>{item.name}</p>
            <div className="h-px bg-[#E6E4D9] dark:bg-[#282726]">
              <div className="h-px bg-[#6F6E69] dark:bg-[#878580]" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
          </div>
          <span className={`font-mono text-[11px] ${muted}`}>{plural(item.count, unit)}</span>
        </li>
      ))}
    </ol>
  )
}

function BookLine({ caption, book, note }: { caption: string; book: BookEntry; note?: string }) {
  return (
    <div className="flex gap-4">
      <Cover book={book} className="w-14 shrink-0" compact />
      <div className="min-w-0 space-y-1">
        <p className={label}>{caption}</p>
        <p className={`font-serif text-lg leading-snug ${strong}`}>
          <Title book={book} />
        </p>
        <p className={`text-xs ${muted}`}>
          {[book.author, note].filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  )
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <section className={card}>
      <p className={`font-serif text-lg ${strong}`}>{children}</p>
      <ShelfLink />
    </section>
  )
}

export default function YearInBooksView({
  data,
  loading = false,
  isCurrentYear = false,
  onYear,
}: {
  data: BooksResponse | null
  loading?: boolean
  isCurrentYear?: boolean
  onYear?: (year: number) => void
}) {
  const header = (
    <div className="border-b border-[#E6E4D9] dark:border-[#282726] pb-4 space-y-2">
      <h1 className="font-serif text-3xl font-bold tracking-tight">Year in Books</h1>
      <p className={`text-sm leading-relaxed ${muted}`}>
        What I finished reading{data && 'year' in data ? ` in ${data.year}` : ''}, pulled from my Hardcover shelf.
      </p>
    </div>
  )

  if (!data) {
    return (
      <div className="w-full space-y-8">
        {header}
        <p className={`text-sm ${muted}`}>{loading ? 'Pulling books off the shelf…' : ''}</p>
      </div>
    )
  }

  if (!('year' in data)) {
    return (
      <div className="w-full space-y-8">
        {header}
        <Notice>My reading log isn’t reachable right now. The full shelf lives on Hardcover.</Notice>
      </div>
    )
  }

  const stats = data as YearStats & { sample?: boolean }
  const peak = Math.max(...stats.months)
  const peakMonths = stats.months.map((n, i) => (n === peak ? MONTHS[i] : '')).filter(Boolean)
  // Only call out a busiest month when it actually stands out.
  const busiest = peak > 1 && peakMonths.length <= 3 ? peakMonths.join(', ') : ''
  const pagesPerBook = stats.booksFinished && stats.totalPages ? Math.round(stats.totalPages / stats.books.filter(b => b.pages).length) : 0
  const lastCaption = isCurrentYear ? 'Most recent' : 'Ended the year with'

  return (
    <div className="w-full space-y-8">
      {header}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" aria-label="Choose a year">
          {stats.availableYears.map(year => (
            <button
              key={year}
              type="button"
              aria-pressed={year === stats.year}
              disabled={loading}
              onClick={() => onYear?.(year)}
              className={`rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors ${year === stats.year ? 'bg-[#E6E4D9] text-[#100F0F] dark:bg-[#343B34] dark:text-[#CECDC3]' : `${muted} hover:bg-[#F2F0E5] dark:hover:bg-[#282726]`}`}
            >
              {year}
            </button>
          ))}
        </div>
        {stats.sample && (
          <span className={`font-mono text-[11px] ${muted}`}>sample data · no Hardcover token here</span>
        )}
      </div>

      {stats.booksFinished === 0 ? (
        <Notice>No finished books logged for {stats.year}{isCurrentYear ? ' yet' : ''}.</Notice>
      ) : (
        <div className={`space-y-4 transition-opacity ${loading ? 'opacity-50' : ''}`}>
          <section className={card}>
            <p className={label}>{stats.year}</p>
            <div>
              <p className={`font-serif text-7xl sm:text-8xl font-bold tracking-tight leading-none ${strong}`}>{stats.booksFinished}</p>
              <p className={`mt-2 font-serif text-lg ${strong}`}>{stats.booksFinished === 1 ? 'book' : 'books'} finished{isCurrentYear ? ' so far' : ''}</p>
            </div>
            <dl className="grid grid-cols-3 gap-4 border-t border-[#E6E4D9] dark:border-[#282726] pt-4">
              <div>
                <dt className={label}>Pages</dt>
                <dd className={`font-serif text-2xl ${strong}`}>{stats.totalPages ? number(stats.totalPages) : '—'}</dd>
              </div>
              <div>
                <dt className={label}>Per book</dt>
                <dd className={`font-serif text-2xl ${strong}`}>{pagesPerBook ? number(pagesPerBook) : '—'}</dd>
              </div>
              <div>
                <dt className={label}>Avg rating</dt>
                <dd className={`font-serif text-2xl ${strong}`}>{stats.avgRating !== null ? stats.avgRating.toFixed(1) : '—'}</dd>
              </div>
            </dl>
          </section>

          <section className={card}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className={label}>Month by month</p>
              {busiest && <p className={`font-mono text-[11px] ${muted}`}>busiest: {busiest}</p>}
            </div>
            <MonthChart months={stats.months} />
          </section>

          {stats.fiveStar.length > 0 && (
            <section className={card}>
              <p className={label}>Five stars</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {stats.fiveStar.map(book => (
                  <div key={`${book.title}-${book.finishedOn}`} className="min-w-0 space-y-1.5">
                    {book.url ? (
                      <a href={book.url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-85">
                        <Cover book={book} />
                      </a>
                    ) : (
                      <Cover book={book} />
                    )}
                    <p className={`font-serif text-xs leading-snug ${strong}`}>{book.title}</p>
                    {book.author && <p className={`text-[11px] leading-snug ${muted}`}>{book.author}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.topAuthors.length > 0 && (
              <section className={card}>
                <p className={label}>{stats.topAuthors[0].count > 1 ? 'Most-read authors' : 'Authors'}</p>
                <Ranked items={stats.topAuthors.slice(0, 5)} unit="book" />
              </section>
            )}
            {stats.topGenres.length > 0 && (
              <section className={card}>
                <p className={label}>Genres</p>
                <Ranked items={stats.topGenres.slice(0, 5)} unit="book" />
              </section>
            )}
          </div>

          {(stats.longest || stats.first) && (
            <section className={`${cardBase} grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8`}>
              {stats.longest && <BookLine caption="Longest" book={stats.longest} note={plural(stats.longest.pages, 'page')} />}
              {stats.shortest && <BookLine caption="Shortest" book={stats.shortest} note={plural(stats.shortest.pages, 'page')} />}
              {stats.first && <BookLine caption="Started the year with" book={stats.first} note={shortDate(stats.first.finishedOn)} />}
              {stats.last && stats.last !== stats.first && stats.booksFinished > 1 && (
                <BookLine caption={lastCaption} book={stats.last} note={shortDate(stats.last.finishedOn)} />
              )}
            </section>
          )}

          <section className={card}>
            <details className="group">
              <summary className={`cursor-pointer list-none ${label} hover:text-[#100F0F] dark:hover:text-[#CECDC3]`}>
                Every book, in order <span className="group-open:hidden">+</span><span className="hidden group-open:inline">−</span>
              </summary>
              <ol className="mt-4 divide-y divide-[#E6E4D9] dark:divide-[#282726]">
                {stats.books.map(book => (
                  <li key={`${book.title}-${book.finishedOn}`} className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-baseline gap-3 py-2">
                    <span className={`font-mono text-[11px] ${muted}`}>{shortDate(book.finishedOn)}</span>
                    <span className="min-w-0">
                      <span className={`font-serif text-sm ${strong}`}><Title book={book} /></span>
                      {book.author && <span className={`text-xs ${muted}`}> · {book.author}</span>}
                    </span>
                    <span className={`font-mono text-[11px] ${muted}`}>{book.rating !== null ? `${stars(book.rating)}★` : ''}</span>
                  </li>
                ))}
              </ol>
            </details>
          </section>
        </div>
      )}

      <p className={`font-mono text-[11px] ${muted}`}>
        Data from Hardcover, refreshed hourly · <ShelfLink>full shelf ↗</ShelfLink>
      </p>
    </div>
  )
}
