import { NextResponse } from 'next/server'

const HARDCOVER_TOKEN = process.env.HARDCOVER_TOKEN

export async function GET() {
  if (!HARDCOVER_TOKEN) {
    return NextResponse.json(
      { error: 'Hardcover token not configured' },
      { status: 500 }
    )
  }

  const query = `
    query GetCurrentlyReading {
      me {
        user_books(
          where: { status_id: { _eq: 2 } }
          order_by: { updated_at: desc }
          limit: 1
        ) {
          book {
            title
            slug
            image {
              url
              color
            }
            contributions {
              author {
                name
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch('https://api.hardcover.app/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HARDCOVER_TOKEN}`,
      },
      body: JSON.stringify({ query }),
      // Add cache revalidation
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Hardcover API responded with status: ${response.status}`)
    }

    const { data, errors } = await response.json()

    if (errors) {
      console.error('❌ Hardcover API errors:', errors)
      throw new Error('GraphQL query failed')
    }

    // Handle me being an array (Hardcover API returns me as an array)
    const books = data?.me?.[0]?.user_books ?? []

    if (books.length === 0) {
      return NextResponse.json({
        isReading: false,
        title: 'Nothing currently',
        author: '',
        bookUrl: '',
        coverImage: ''
      })
    }

    const book = books[0].book
    
    // Extract author name - try multiple possible structures
    let author = 'Unknown Author'
    if (book.contributions && book.contributions.length > 0) {
      author = book.contributions[0]?.author?.name || 'Unknown Author'
    } else if (book.cached_contributors) {
      // Fallback to cached_contributors if it exists
      if (Array.isArray(book.cached_contributors)) {
        author = book.cached_contributors[0]?.name || 'Unknown Author'
      } else if (typeof book.cached_contributors === 'string') {
        author = book.cached_contributors
      }
    }

    return NextResponse.json({
      isReading: true,
      title: book.title || 'Untitled',
      author,
      bookUrl: book.slug ? `https://hardcover.app/books/${book.slug}` : '',
      coverImage: book.image?.url || ''
    })
    
  } catch (error) {
    console.error('Error fetching Hardcover data:', error)
    
    // Return a user-friendly error response
    return NextResponse.json({
      isReading: false,
      title: 'Unable to load',
      author: '',
      bookUrl: '',
      coverImage: ''
    })
  }
}