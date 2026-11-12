const assert = require('node:assert/strict')
const React = require('react')
const {renderToStaticMarkup} = require('react-dom/server')
const {load, find} = require('./react-harness.cjs')
const fixture = require('./fixtures/hardcover-read-books.json')

const books = load('lib/books.ts')
const {availableYears, genresOf, userBooksFrom} = books
// Plain JSON copies: the stats are built in a vm context, whose arrays fail strict deepEqual.
const computeYearStats = (raw, year) => JSON.parse(JSON.stringify(books.computeYearStats(raw, year)))

// Accepts the full GraphQL body, `data`, or the bare user_books array.
assert.equal(userBooksFrom(fixture).length, 19)
assert.equal(userBooksFrom(fixture.data).length, 19)
assert.equal(userBooksFrom(fixture.data.me[0].user_books).length, 19)
assert.equal(userBooksFrom({data: {me: []}}).length, 0)
assert.equal(userBooksFrom(null).length, 0)

assert.deepEqual([...availableYears(fixture)], [2026, 2025, 2024])

const s = computeYearStats(fixture, 2026)
assert.equal(s.year, 2026)
assert.equal(s.booksFinished, 13, 'unfinished entries are skipped; last_read_date stands in for missing reads')
assert.equal(s.totalPages, 5090, 'edition pages fill in for a book without a page count')
assert.equal(s.ratedCount, 12)
assert.equal(s.avgRating, 4.33)
assert.deepEqual([...s.months], [2, 1, 1, 1, 1, 2, 1, 2, 0, 1, 1, 0])
assert.equal(s.months.reduce((a, b) => a + b, 0), s.booksFinished)
assert.deepEqual(JSON.parse(JSON.stringify(s.topAuthors[0])), {name: 'Kazuo Ishiguro', count: 3})
assert.ok(s.topAuthors.some(a => a.name === 'Fyodor Dostoevsky'))
assert.ok(!s.topAuthors.some(a => a.name === 'Richard Pevear' || a.name === 'Gregory Hays'), 'translators are not credited as authors')
assert.equal(s.longest.title, 'The Brothers Karamazov')
assert.equal(s.longest.pages, 796)
assert.equal(s.shortest.title, 'The Old Man and the Sea')
assert.equal(s.first.title, 'Piranesi')
assert.equal(s.first.finishedOn, '2026-01-09')
assert.equal(s.first.url, 'https://hardcover.app/books/piranesi')
assert.equal(s.last.title, 'Tomorrow, and Tomorrow, and Tomorrow')
assert.equal(s.last.rating, 4, 'string ratings are coerced')
assert.equal(s.last.cover, '')
assert.deepEqual(s.fiveStar.map(b => b.title), ['Piranesi', 'The Brothers Karamazov', 'Meditations', 'The Dispossessed'])
assert.deepEqual(JSON.parse(JSON.stringify(s.topGenres[0])), {name: 'Fiction', count: 8})
assert.ok(!s.topGenres.some(g => g.name === 'reflective'), 'only the Genre category counts as genres')
assert.deepEqual(s.books.map(b => b.finishedOn), [...s.books.map(b => b.finishedOn)].sort())

// A reread lands in each year it was finished.
const last = computeYearStats(fixture, 2025)
assert.equal(last.booksFinished, 5)
assert.equal(last.first.title, 'Meditations')
assert.equal(last.last.title, 'Stoner')

const one = computeYearStats(fixture, 2024)
assert.equal(one.booksFinished, 1)
assert.equal(one.longest.title, 'The Hobbit')
assert.equal(one.shortest, null, 'a single book is not both longest and shortest')

const empty = computeYearStats(fixture, 1999)
assert.equal(empty.booksFinished, 0)
assert.equal(empty.totalPages, 0)
assert.equal(empty.avgRating, null)
assert.equal(empty.longest, null)
assert.equal(empty.first, null)
assert.deepEqual([...empty.fiveStar], [])
assert.deepEqual([...empty.availableYears], [2026, 2025, 2024])

const bare = computeYearStats({data: {me: [{user_books: [{user_book_reads: [{finished_at: '2026-03-01'}], book: {}}]}]}}, 2026)
assert.equal(bare.booksFinished, 1, 'missing optional fields do not throw')
assert.equal(bare.books[0].title, 'Untitled')
assert.equal(bare.totalPages, 0)
assert.deepEqual([...bare.topAuthors], [])

assert.deepEqual([...genresOf({cached_tags: ['Poetry', {tag: 'Essays'}, '', null]})], ['Poetry', 'Essays'])
assert.deepEqual([...genresOf({cached_tags: null})], [])

// The view renders every state without throwing.
const View = load('app/books/YearInBooksView.tsx', {react: React}).default
const view = data => renderToStaticMarkup(React.createElement(View, {data}))
const full = view({...s, sample: true})
assert.match(full, /Year in Books/)
assert.match(full, />13</)
assert.match(full, /5,090/)
assert.match(full, /Kazuo Ishiguro/)
assert.match(full, /The Brothers Karamazov/)
assert.match(full, /sample data/)
assert.doesNotMatch(view(s), /sample data/)
assert.match(view({unavailable: true}), /hardcover\.app\/@allenliu\//)
assert.match(view(empty), /No finished books logged for 1999/)
assert.match(view(one), /The Hobbit/)

// The homepage links to the page from "On my desk".
const Home = load('app/page.tsx', {
  react: {...React, useState: initial => [initial, () => {}], useEffect: () => {}},
  'next/image': 'image', 'next/link': 'link', '@/components/PixelScape': 'landscape', '@/lib/photoAssets': {getPhotoSources: src => ({src})},
}).default
assert.ok(find(Home(), node => node.props?.href === '/books'), 'homepage links to /books')

console.log(`Books: ${s.booksFinished} books in 2026 from the fixture; stats, rereads, missing fields, view states, and homepage link passed.`)
