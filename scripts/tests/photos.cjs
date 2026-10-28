const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const sharp = require('sharp')
const React = require('react')
const {renderToStaticMarkup} = require('react-dom/server')
const manifest = require('../../lib/generated/photo-assets.json')

function load(file, dependencies = {}, globals = {}) {
  const exports = {}
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true},
  }).outputText
  vm.runInNewContext(code, {exports, require: name => dependencies[name] || require(name), ...globals})
  return exports
}

async function main() {
  for (const [filename, asset] of Object.entries(manifest.photos)) {
    assert.ok(fs.existsSync(`public${decodeURIComponent(asset.originalSrc)}`), `${filename}: original download exists`)
    let previous = 0
    for (const variant of asset.variants) {
      const file = `public${variant.src}`
      const metadata = await sharp(file).metadata()
      assert.equal(metadata.format, 'webp')
      assert.equal(metadata.width, variant.width)
      assert.equal(metadata.height, variant.height)
      assert.equal(fs.statSync(file).size, variant.bytes)
      assert.ok(variant.width > previous && variant.width <= asset.width)
      assert.ok(Math.abs(variant.width / variant.height - asset.width / asset.height) < .01)
      previous = variant.width
    }
  }
  const sources = load('lib/photoAssets.ts', {'./generated/photo-assets.json': manifest})
  const {getPhotos} = load('lib/getPhotos.ts', {'./photoAssets': sources})
  const GalleryImage = load('components/GalleryImage.tsx', {'@/lib/photoAssets': sources}).default
  const photos = getPhotos()
  for (const filename of ['jasper-rockies-fav.jpeg', 'lafayette-ridge-fav.jpeg', 'princeton-campus-fav.jpeg']) {
    const asset = manifest.photos[filename]
    assert.ok(asset.height > asset.width, `${filename}: stale EXIF tags do not turn upright portraits sideways`)
  }
  assert.equal(photos.length, Object.keys(manifest.photos).length)
  for (const [alias, canonical] of Object.entries(manifest.aliases)) {
    assert.ok(!photos.some(photo => photo.filename === alias))
    assert.equal(sources.getPhotoAsset(`/images/gallery/${encodeURIComponent(alias)}`), manifest.photos[canonical])
  }
  const markup = renderToStaticMarkup(React.createElement(GalleryImage, {src: photos[0].src, alt: 'test', sizes: '300px'}))
  assert.match(markup, /loading="lazy"/)
  assert.match(markup, /decoding="async"/)
  assert.match(markup, /srcSet="[^\"]+320w/)
  assert.ok(!markup.includes('/_next/image'))

  // Opening and closing the shared viewer keeps category filtering intact.
  const {harness, find} = require('./react-harness.cjs')
  const h = harness()
  const Gallery = load('app/photos/PhotoGallery.tsx', {
    react: h.hooks, '@/components/GalleryImage': {default: GalleryImage, __esModule: true},
    '@/components/PhotoViewer': 'viewer',
  }).default
  const render = () => h.render(Gallery, {photos})
  let tree = render()
  find(tree, node => node.type === 'button' && node.key === photos[0].filename).props.onClick()
  tree = render()
  let viewer = find(tree, node => node.type === 'viewer')
  assert.equal(viewer.props.index, 0)
  viewer.props.onIndexChange(1)
  viewer = find(render(), node => node.type === 'viewer')
  assert.equal(viewer.props.index, 1)
  viewer.props.onClose()
  tree = render()
  assert.ok(!find(tree, node => node.type === 'viewer'))
  find(tree, node => node.type === 'button' && node.key === 'peru').props.onClick()
  tree = render()
  const filtered = photos.filter(photo => photo.category === 'peru')
  assert.ok(find(tree, node => node.type === 'button' && node.key === filtered[0].filename))
  assert.ok(!find(tree, node => node.type === 'button' && node.key === photos.find(photo => photo.category !== 'peru').filename))
  console.log(`Photos: ${photos.length} catalog entries validated; responsive assets, original downloads, backup aliases, lazy images, filtering, and viewer integration passed.`)
}
main().catch(error => {console.error(error); process.exitCode = 1})
