const assert = require('node:assert/strict')
const React = require('react')
const {renderToStaticMarkup} = require('react-dom/server')
const {load, find, harness} = require('./react-harness.cjs')
const data = load('lib/hikes.ts')

const Home = load('app/page.tsx', {
  react: {...React, useState: initial => [initial, () => {}], useEffect: () => {}},
  'next/image': 'image', 'next/link': 'link', '@/components/PixelScape': 'landscape',
}).default
const home = Home()
const cards = ['STA-02', 'STA-03'].map(id => find(home, node => node.props?.href === `/hikes?trip=${id}`))
assert.ok(cards.every(Boolean), 'Both recent-trip cards retain destination links')

function mapHarness() {
  const h = harness(), timers = new Map(), flights = []
  let timerId = 0
  const MapPanel = load('components/ExpeditionMap.tsx', {
    react: h.hooks, 'mapbox-gl/dist/mapbox-gl.css': {},
    '@vis.gl/react-mapbox': {__esModule: true, default: 'map', Marker: 'marker', Popup: 'popup', NavigationControl: 'controls'},
  }, {
    process: {env: {}},
    window: {setTimeout: (fn, ms) => {assert.equal(ms, 12000); timers.set(++timerId, fn); return timerId}, clearTimeout: id => timers.delete(id)},
  }).default
  return {
    flights,
    timeout: () => [...timers.values()].forEach(fn => fn()),
    render: props => h.render(MapPanel, props, tree => {
      const map = find(tree, node => node.type === 'map')
      if (map) map.ref.current = {flyTo: options => flights.push(options)}
    }),
  }
}

for (const card of cards) {
  const h = harness()
  let query = new URL(card.props.href, 'http://localhost').searchParams
  const Hikes = load('app/hikes/page.tsx', {
    react: h.hooks, 'next/dynamic': () => 'map-panel',
    'next/navigation': {useSearchParams: () => query},
    '@/lib/hikes': data, '@/components/GalleryImage': 'photo', '@/components/PhotoViewer': 'viewer',
  }).default
  const render = () => h.render(Hikes)
  const selectLink = tree => {
    const selection = find(tree, node => typeof node.type === 'function')
    h.render(selection.type, selection.props)
  }
  let tree = render()
  const initialMarkup = renderToStaticMarkup(tree)
  assert.equal((initialMarkup.match(/<article/g) || []).length, data.hikes.length, 'Hikes render while the map is loading')
  assert.ok(!initialMarkup.includes('STA-') && !initialMarkup.includes('field plates'))
  selectLink(tree)
  tree = render()
  const panel = find(tree, node => node.type === 'map-panel')
  const expected = query.get('trip') === 'STA-02' ? [-72.5731, -13.3869] : [-116.1847, 51.3297]
  const m = mapHarness()
  let mapTree = m.render(panel.props)
  let map = find(mapTree, node => node.type === 'map')
  assert.equal(map.props.projection.name, 'globe')
  assert.equal(map.props.onMove, undefined, 'Camera frames do not rerender the whole page')
  assert.equal(map.props.reuseMaps, undefined, 'Navigation does not reuse an incompletely loaded map')
  assert.equal(m.flights.length, 0)
  map.props.onLoad()
  mapTree = m.render(panel.props)
  assert.equal(m.flights.length, 1)
  assert.equal(JSON.stringify(m.flights[0].center), JSON.stringify(expected))
  assert.equal(m.flights[0].duration, 4200)
  m.render(panel.props)
  assert.equal(m.flights.length, 1, 'Rerenders do not restart flyovers')
  find(tree, node => node.type === 'button' && node.key === 'all').props.onClick()
  tree = render()
  selectLink(tree)
  const reset = find(render(), node => node.type === 'map-panel')
  assert.equal(reset.props.selectedHike, null, 'Region reset does not snap back to the trip URL')
  query = new URLSearchParams('trip=not-a-station')
  selectLink(tree)
  assert.equal(find(render(), node => node.type === 'map-panel').props.selectedHike, null)
  find(tree, node => node.type === 'button' && node.props['aria-label']?.startsWith('Open photo:')).props.onClick()
  tree = render()
  const viewer = find(tree, node => node.type === 'viewer')
  assert.ok(viewer && viewer.props.photos.length)
  viewer.props.onClose()
  assert.ok(!find(render(), node => node.type === 'viewer'), 'Expedition viewer close handler removes the modal')
}

const first = data.hikes[0], latest = data.hikes[2]
const base = {hikes: data.hikes, selectedHike: first, destination: {lat:first.lat, lng:first.lng, zoom:8.5, requestId:1}, onSelect() {}, onPhotos() {}}
for (const failure of ['timeout', 'error']) {
  const m = mapHarness()
  let tree = m.render(base)
  if (failure === 'timeout') m.timeout()
  else find(tree, node => node.type === 'map').props.onError()
  tree = m.render(base)
  assert.ok(!find(tree, node => node.type === 'map'), `${failure}: failed map is released`)
  const retry = find(tree, node => node.type === 'button' && node.props.children === 'Try again')
  assert.ok(retry, `${failure}: a retry replaces the endless loader`)
  retry.props.onClick()
  const pending = {...base, selectedHike: latest, destination: {lat:latest.lat, lng:latest.lng, zoom:8.5, requestId:2}}
  tree = m.render(pending)
  const map = find(tree, node => node.type === 'map')
  assert.equal(map.key, '1', 'Retry mounts a fresh map')
  assert.equal(m.flights.length, 0)
  map.props.onLoad()
  m.timeout() // A stale timeout must not override an already-ready map.
  tree = m.render(pending)
  assert.equal(m.flights.length, 1)
  assert.equal(JSON.stringify(m.flights[0].center), JSON.stringify([latest.lng, latest.lat]), 'Retry flies to the latest requested destination')
  assert.ok(find(tree, node => node.type === 'popup'))
}
console.log('Expeditions: recent-trip links, immediate hike content, queued slow flyovers, timeout/error recovery, retries, resets, internal-only IDs, and photo closing passed.')
