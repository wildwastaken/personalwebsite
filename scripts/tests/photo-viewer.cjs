const assert = require('node:assert/strict')
const {load, find, harness} = require('./react-harness.cjs')

for (const title of ['Peru', 'Salkantay Alpine Pass Trek']) {
  const h = harness(), listeners = new Map()
  const opener = {isConnected: true, focused: false, focus() {this.focused = true}}
  const doc = {activeElement: opener, body: {style: {overflow: 'auto'}}}
  const controls = Array.from({length: 3}, () => ({focus() {doc.activeElement = this}}))
  const Viewer = load('components/PhotoViewer.tsx', {
    react: h.hooks, './GalleryImage': 'image',
  }, {
    document: doc,
    window: {
      addEventListener: (event, fn, capture) => listeners.set(event, {fn, capture}),
      removeEventListener: event => listeners.delete(event),
    },
  }).default
  let index = 0, closed = false
  const props = {
    title, photos: [{src: 'a.webp', alt: 'A'}, {src: 'b.webp', alt: 'B'}],
    onClose: () => {closed = true}, onIndexChange: value => {index = value},
  }
  const render = () => h.render(Viewer, {...props, index}, tree => {
    tree.ref.current = {querySelectorAll: () => controls}
    find(tree, node => node.props?.title === 'Close (Escape)').ref.current = controls[2]
  })
  const key = (value, shiftKey = false) => {
    let prevented = false, stopped = false
    listeners.get('keydown').fn({key: value, shiftKey, preventDefault() {prevented = true}, stopPropagation() {stopped = true}})
    return {prevented, stopped}
  }
  let tree = render()
  assert.equal(tree.props.role, 'dialog')
  assert.equal(doc.body.style.overflow, 'hidden')
  assert.equal(doc.activeElement, controls[2], 'Opening the viewer focuses Close')
  assert.equal(listeners.get('keydown').capture, true, 'Keys are captured before Mapbox or focused controls')
  assert.deepEqual(key('ArrowLeft'), {prevented: true, stopped: true})
  assert.equal(index, 1, 'Left wraps from the first photo to the last')
  render()
  key('ArrowRight')
  assert.equal(index, 0)
  tree = render()
  key('Tab')
  assert.equal(doc.activeElement, controls[0], 'Tab wraps within the dialog')
  key('Tab', true)
  assert.equal(doc.activeElement, controls[2])
  assert.deepEqual(key('Escape'), {prevented: true, stopped: true})
  assert.ok(closed, `${title}: Escape invokes the page's close handler`)
  h.unmount()
  assert.equal(doc.body.style.overflow, 'auto')
  assert.ok(opener.focused, 'Closing restores focus to the photo opener')
  assert.equal(listeners.size, 0, 'Closing removes keyboard listeners')
}
console.log('Both photo viewers: Escape, arrow navigation, capture priority, focus containment, scroll locking, and cleanup passed.')
