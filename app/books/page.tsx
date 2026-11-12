'use client'

import { useEffect, useState } from 'react'
import YearInBooksView, { type BooksResponse } from './YearInBooksView'

export default function Books() {
  const [year, setYear] = useState<number | null>(null)
  const [data, setData] = useState<BooksResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(year ? `/api/books?year=${year}` : '/api/books')
      .then(res => res.json())
      .then((next: BooksResponse) => { if (!cancelled) setData(next) })
      .catch(() => { if (!cancelled) setData({ unavailable: true }) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [year])

  const shown = data && 'year' in data ? data.year : null
  return (
    <YearInBooksView
      data={data}
      loading={loading}
      isCurrentYear={shown === new Date().getFullYear()}
      onYear={setYear}
    />
  )
}
