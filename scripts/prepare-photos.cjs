const fs = require('node:fs/promises')
const path = require('node:path')
const crypto = require('node:crypto')
const sharp = require('sharp')

const root = path.join(__dirname, '..')
const gallery = path.join(root, 'public/images/gallery')
const output = path.join(gallery, 'optimized')
const manifestFile = path.join(root, 'lib/generated/photo-assets.json')
const VERSION = 1
// These existing JPEGs have upright pixels but retained an old EXIF rotation tag.
const alreadyUpright = new Set(['jasper-rockies-fav.jpeg', 'lafayette-ridge-fav.jpeg', 'princeton-campus-fav.jpeg'])
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const digest = buffer => crypto.createHash('sha256').update(buffer).digest('hex')
const exists = async file => fs.access(file).then(() => true, () => false)

async function preparePhotos() {
  // Do expensive resizing before serving the site, with bounded native memory/CPU use.
  sharp.concurrency(1)
  sharp.cache({memory:32, files:0, items:32})
  await fs.mkdir(gallery, {recursive:true})
  await fs.mkdir(output, {recursive:true})
  const files = (await fs.readdir(gallery, {withFileTypes:true}))
    .filter(file => file.isFile() && imageExtensions.has(path.extname(file.name).toLowerCase()))
    .map(file => file.name).sort()
  const fileSet = new Set(files)
  const aliases = {}
  for (const filename of files) {
    const parsed = path.parse(filename)
    const match = parsed.name.match(/^(.*) \d+$/)
    if (!match) continue
    const canonical = `${match[1]}${parsed.ext}`
    if (!fileSet.has(canonical)) continue
    const archived = path.join(gallery, 'raw', canonical)
    const reference = await exists(archived) ? archived : path.join(gallery, canonical)
    const [copy, original] = await Promise.all([fs.readFile(path.join(gallery, filename)), fs.readFile(reference)])
    // A similarly named but different photograph must remain in the catalog.
    if (copy.equals(original)) aliases[filename] = canonical
  }
  let previous = {photos:{}}
  if (await exists(manifestFile)) previous = JSON.parse(await fs.readFile(manifestFile, 'utf8'))
  const photos = {}
  let generated = 0
  for (const filename of files.filter(file => !aliases[file])) {
    const archived = path.join(gallery, 'raw', filename)
    const useArchive = await exists(archived)
    const input = await fs.readFile(path.join(gallery, filename))
    const upright = alreadyUpright.has(filename)
    const fingerprint = digest(Buffer.concat([Buffer.from(`gallery-${VERSION}-320-640-960-1600-2560-q76-83${upright ? '-upright' : ''}`), input]))
    const cached = previous.photos[filename]
    if (cached?.fingerprint === fingerprint && (await Promise.all(cached.variants.map(v => exists(path.join(root, 'public', v.src))))).every(Boolean)) {
      photos[filename] = cached
      continue
    }
    const metadata = await sharp(input).metadata()
    const rotated = !upright && metadata.orientation >= 5 && metadata.orientation <= 8
    const width = rotated ? metadata.height : metadata.width
    const height = rotated ? metadata.width : metadata.height
    const slug = path.parse(filename).name.replace(/[^a-zA-Z0-9_-]/g, '-')
    const variants = []
    const usedWidths = new Set()
    for (const target of [320,640,960,1600,2560]) {
      const longEdge = target <= 960 ? undefined : 2560
      const scale = Math.min(1, target / width, longEdge ? longEdge / height : 1)
      const expectedWidth = Math.round(width * scale)
      if (usedWidths.has(expectedWidth)) continue
      usedWidths.add(expectedWidth)
      const name = `${slug}-${fingerprint.slice(0,12)}-${target}.webp`
      const image = upright ? sharp(input) : sharp(input).rotate()
      const info = await image
        .resize({width:target, height:longEdge, fit:'inside', withoutEnlargement:true})
        .webp({quality:target <= 960 ? 76 : 83, effort:4})
        .toFile(path.join(output, name))
      variants.push({src:`/images/gallery/optimized/${name}`, width:info.width, height:info.height, bytes:info.size})
    }
    const preview = upright ? sharp(input) : sharp(input).rotate()
    const {data} = await preview.resize(1,1).removeAlpha().raw().toBuffer({resolveWithObject:true})
    photos[filename] = {
      fingerprint, width, height,
      originalSrc:`/images/gallery/${useArchive ? 'raw/' : ''}${encodeURIComponent(filename)}`,
      placeholder:`#${[...data].slice(0,3).map(channel => channel.toString(16).padStart(2,'0')).join('')}`,
      variants,
    }
    generated++
  }
  const manifest = `${JSON.stringify({version:VERSION, photos, aliases},null,2)}\n`
  await fs.mkdir(path.dirname(manifestFile), {recursive:true})
  // Avoid unnecessary dev recompilation when all sources are unchanged.
  if (!await exists(manifestFile) || await fs.readFile(manifestFile,'utf8') !== manifest) {
    await fs.writeFile(`${manifestFile}.tmp`, manifest)
    await fs.rename(`${manifestFile}.tmp`, manifestFile)
  }
  const thumbs = Object.values(photos).reduce((sum, photo) => sum + (photo.variants.find(v => v.width >= 640) || photo.variants[photo.variants.length - 1]).bytes, 0)
  console.log(`Photo assets: ${Object.keys(photos).length} unique photos, ${Object.keys(aliases).length} verified backup copies excluded, ${generated} regenerated. 640px previews total ${(thumbs/1024/1024).toFixed(2)} MB.`)
}
preparePhotos().catch(error => {console.error(error); process.exitCode=1})
