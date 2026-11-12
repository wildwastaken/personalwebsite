// Turns a raw Hardcover `me { user_books { ... } }` response into "year in books" stats.
// Pure: no fetching, no Date.now(), so it can be tested against a saved fixture.

export interface BookEntry {
  title: string
  author: string
  url: string
  cover: string
  color: string
  pages: number | null
  rating: number | null
  finishedOn: string // YYYY-MM-DD
}

export interface Count {
  name: string
  count: number
}

export interface YearStats {
  year: number
  availableYears: number[]
  booksFinished: number
  totalPages: number
  avgRating: number | null
  ratedCount: number
  topAuthors: Count[]
  topGenres: Count[]
  months: number[]
  longest: BookEntry | null
  shortest: BookEntry | null
  first: BookEntry | null
  last: BookEntry | null
  fiveStar: BookEntry[]
  books: BookEntry[]
}

const DATE = /^(\d{4})-(\d{2})-(\d{2})/

// Hardcover dates are plain `date` strings; slicing avoids timezone shifts from new Date().
function day(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const match = value.match(DATE)
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null
}

function positive(value: unknown): number | null {
  const n = typeof value === 'string' ? Number(value) : value
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : null
}

// Accepts the whole GraphQL body, its `data`, or the user_books array itself.
export function userBooksFrom(raw: any): any[] {
  if (Array.isArray(raw)) return raw
  const data = raw?.data ?? raw
  const me = Array.isArray(data?.me) ? data.me[0] : data?.me
  return Array.isArray(me?.user_books) ? me.user_books : []
}

function authorOf(book: any): string {
  const contributions = Array.isArray(book?.contributions) ? book.contributions : []
  // A null contribution role means the primary author; skip translators, illustrators, etc.
  const primary = contributions.find((c: any) => c?.author?.name && (!c.contribution || /^author$/i.test(c.contribution)))
  const any = contributions.find((c: any) => c?.author?.name)
  const name = (primary || any)?.author?.name
  if (name) return name
  const cached = book?.cached_contributors
  if (Array.isArray(cached)) return cached[0]?.author?.name || cached[0]?.name || ''
  return typeof cached === 'string' ? cached : ''
}

// cached_tags is untyped jsonb. Observed shape: { Genre: [{ tag: 'Fantasy', ... }], Mood: [...] }.
// Also tolerate a flat array of strings or { tag } objects.
export function genresOf(book: any): string[] {
  const tags = book?.cached_tags
  if (!tags || typeof tags !== 'object') return []
  const list = Array.isArray(tags) ? tags : tags.Genre ?? tags.genre ?? tags.Genres ?? tags.genres ?? []
  if (!Array.isArray(list)) return []
  const names = list
    .map((t: any) => (typeof t === 'string' ? t : t?.tag ?? t?.name))
    .filter((t: any): t is string => typeof t === 'string' && t.trim().length > 0)
    .map(t => t.trim())
  return Array.from(new Set(names))
}

// Every finish date for a user_book: each user_book_reads.finished_at, else last_read_date.
function finishDates(userBook: any): string[] {
  const reads = Array.isArray(userBook?.user_book_reads) ? userBook.user_book_reads : []
  const dates = reads.map((r: any) => day(r?.finished_at)).filter(Boolean) as string[]
  if (dates.length === 0) {
    const fallback = day(userBook?.last_read_date)
    if (fallback) dates.push(fallback)
  }
  return Array.from(new Set(dates)).sort()
}

function entry(userBook: any, finishedOn: string): BookEntry {
  const book = userBook?.book ?? {}
  const rating = positive(userBook?.rating)
  return {
    title: typeof book.title === 'string' && book.title.trim() ? book.title.trim() : 'Untitled',
    author: authorOf(book),
    url: book.slug ? `https://hardcover.app/books/${book.slug}` : '',
    cover: book.image?.url || userBook?.edition?.image?.url || '',
    color: book.image?.color || '',
    pages: positive(userBook?.edition?.pages) ?? positive(book.pages),
    rating: rating === null ? null : Math.min(rating, 5),
    finishedOn,
  }
}

function tally(names: string[], limit: number): Count[] {
  const counts = new Map<string, number>()
  for (const name of names) counts.set(name, (counts.get(name) || 0) + 1)
  return Array.from(counts, ([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit)
}

export function availableYears(raw: any): number[] {
  const years = new Set<number>()
  for (const ub of userBooksFrom(raw)) for (const d of finishDates(ub)) years.add(Number(d.slice(0, 4)))
  return Array.from(years).sort((a, b) => b - a)
}

export function computeYearStats(raw: any, year: number): YearStats {
  const prefix = `${year}-`
  const pairs: { ub: any; book: BookEntry }[] = []
  for (const ub of userBooksFrom(raw)) {
    // A reread within the same year counts once, dated by its last finish that year.
    const inYear = finishDates(ub).filter(d => d.startsWith(prefix))
    if (inYear.length) pairs.push({ ub, book: entry(ub, inYear[inYear.length - 1]) })
  }
  pairs.sort((a, b) => a.book.finishedOn.localeCompare(b.book.finishedOn) || a.book.title.localeCompare(b.book.title))
  const books = pairs.map(p => p.book)

  const months = new Array(12).fill(0)
  for (const b of books) months[Number(b.finishedOn.slice(5, 7)) - 1]++

  const rated = books.filter(b => b.rating !== null)
  const avgRating = rated.length ? Math.round((rated.reduce((sum, b) => sum + b.rating, 0) / rated.length) * 100) / 100 : null

  const withPages = books.filter(b => b.pages !== null)
  const byPages = [...withPages].sort((a, b) => a.pages - b.pages || a.title.localeCompare(b.title))

  return {
    year,
    availableYears: availableYears(raw),
    booksFinished: books.length,
    totalPages: withPages.reduce((sum, b) => sum + b.pages, 0),
    avgRating,
    ratedCount: rated.length,
    topAuthors: tally(books.map(b => b.author).filter(Boolean), 5),
    topGenres: tally(pairs.flatMap(p => genresOf(p.ub.book)), 5),
    months,
    longest: byPages.length ? byPages[byPages.length - 1] : null,
    shortest: byPages.length > 1 ? byPages[0] : null,
    first: books[0] ?? null,
    last: books.length ? books[books.length - 1] : null,
    fiveStar: books.filter(b => b.rating !== null && b.rating >= 5).slice(0, 6),
    books,
  }
}
