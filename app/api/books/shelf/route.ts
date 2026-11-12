import { NextResponse } from 'next/server'

// Allen's read shelf in the raw Hardcover shape that Hardcover Wrapped expects
// (https://github.com/wildwastaken/hardcover-wrapped). Wrapped calls this for its
// "try it with mine" button, so the token stays here on the site's server.
// Read-only: only books already shown on /books. Keep the query in sync with
// lib/hardcover.ts in that repo.

export const revalidate = 3600

const QUERY = `
  query Wrapped {
    me {
      username
      user_books(
        where: { _or: [{ status_id: { _eq: 3 } }, { user_book_reads: { finished_at: { _is_null: false } } }] }
        order_by: { last_read_date: desc_nulls_last }
      ) {
        status_id
        rating
        last_read_date
        user_book_reads(order_by: { finished_at: asc_nulls_last }) {
          finished_at
        }
        edition {
          pages
          image {
            url
          }
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

export async function GET() {
  const token = process.env.HARDCOVER_TOKEN?.trim().replace(/^Bearer\s+/i, '')
  if (!token) return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  try {
    const res = await fetch('https://api.hardcover.app/v1/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query: QUERY }),
      next: { revalidate: 3600 },
    })
    const body = await res.json()
    if (!res.ok || body?.errors || !body?.data?.me) {
      console.error('Hardcover shelf request failed', res.status)
      return NextResponse.json({ error: 'unavailable' }, { status: 502 })
    }
    return NextResponse.json(body)
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 })
  }
}
