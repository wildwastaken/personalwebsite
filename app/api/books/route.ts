import { NextResponse, type NextRequest } from 'next/server'
import { computeYearStats } from '@/lib/books'
import sample from '@/scripts/tests/fixtures/hardcover-read-books.json'

// Hardcover's settings page copies the token with a "Bearer " prefix, so accept either form.
const HARDCOVER_TOKEN = process.env.HARDCOVER_TOKEN?.trim().replace(/^Bearer\s+/i, '')

// Fixture data is only for looking at the page locally: `next dev`, or `BOOKS_SAMPLE=1 next start`.
// Never on Vercel, so production without a token says unavailable instead of showing fake books.
const SAMPLE_ALLOWED = !process.env.VERCEL && (process.env.NODE_ENV !== 'production' || process.env.BOOKS_SAMPLE === '1')

const QUERY = `
  query YearInBooks {
    me {
      user_books(
        where: { status_id: { _eq: 3 } }
        order_by: { last_read_date: desc_nulls_last }
      ) {
        rating
        last_read_date
        user_book_reads(order_by: { finished_at: asc_nulls_last }) {
          finished_at
        }
        edition {
          pages
        }
        book {
          title
          slug
          pages
          cached_tags
          image {
            url
            color
          }
          contributions {
            contribution
            author {
              name
            }
          }
        }
      }
    }
  }
`

async function fetchReadBooks() {
  const response = await fetch('https://api.hardcover.app/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HARDCOVER_TOKEN}`,
    },
    body: JSON.stringify({ query: QUERY }),
    next: { revalidate: 3600 },
  })
  if (!response.ok) throw new Error(`Hardcover responded with status ${response.status}`)
  const body = await response.json()
  if (body.errors) throw new Error(`Hardcover GraphQL errors: ${JSON.stringify(body.errors).slice(0, 300)}`)
  return body
}

function stats(raw: any, requested: string | null) {
  const current = new Date().getFullYear()
  const asked = requested && /^\d{4}$/.test(requested) ? Number(requested) : null
  let result = computeYearStats(raw, asked ?? current)
  // Early January (or a quiet year): with no explicit year, show the latest year that has books.
  if (asked === null && result.booksFinished === 0 && result.availableYears.length) {
    result = computeYearStats(raw, result.availableYears[0])
  }
  return result
}

export async function GET(request: NextRequest) {
  const year = request.nextUrl.searchParams.get('year')

  if (!HARDCOVER_TOKEN) {
    if (SAMPLE_ALLOWED) return NextResponse.json({ ...stats(sample, year), sample: true })
    return NextResponse.json({ unavailable: true })
  }

  try {
    return NextResponse.json(stats(await fetchReadBooks(), year))
  } catch (error) {
    console.error('Error fetching Hardcover year in books:', error instanceof Error ? error.message : error)
    return NextResponse.json({ unavailable: true })
  }
}
