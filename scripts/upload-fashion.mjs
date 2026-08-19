/**
 * upload-fashion.mjs
 *
 * Reads images from media/fashion/ subfolders, converts each to the correct
 * crop/format using sharp, uploads to Sanity, and patches/creates documents.
 *
 * Folder structure:
 *   media/fashion/gallery/
 *     items.json              ← metadata for each gallery strip card
 *     01-editorial.jpg        ← images (any format)
 *     ...
 *
 *   media/fashion/editorial-grid/
 *     slots.json              ← label for each of the 8 grid slots (in order)
 *     01-cover-story.jpg
 *     ...
 *
 *   media/fashion/projects/<folder-name>/
 *     meta.json               ← { title, projectType, date, tags, featured, link }
 *     cover.jpg               ← becomes coverImage (first image named "cover.*")
 *     01-shot.jpg             ← remaining images become images[] gallery
 *     02-detail.jpg
 *     ...
 *
 * Run:  node scripts/upload-fashion.mjs
 *
 * Requires sharp:  npm install --save-dev sharp
 */

import { createClient }                        from '@sanity/client'
import { readFileSync, readdirSync, existsSync, statSync } from 'fs'
import { resolve, dirname, extname, basename } from 'path'
import { fileURLToPath }                       from 'url'

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('\n✗  sharp is not installed.  Run: npm install --save-dev sharp\n')
  process.exit(1)
}

let heicConvert
try {
  heicConvert = (await import('heic-convert')).default
} catch { /* optional — only needed for HEIC files */ }

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = resolve(__dirname, '..')

// ── .env.local ───────────────────────────────────────────────────────────────
const envPath = resolve(ROOT, '.env.local')
if (!existsSync(envPath)) {
  console.error('✗  .env.local not found.')
  process.exit(1)
}
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const client = createClient({
  projectId:  env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:    env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn:     false,
  token:      env.SANITY_API_TOKEN,
})

// ── Dimensions ───────────────────────────────────────────────────────────────
const DIM = {
  gallery:       { w: 480,  h: 640  },  // 3:4 portrait  — gallery strip cards
  editorialGrid: { w: 600,  h: 800  },  // 3:4 portrait  — masonry editorial slots
  projectCover:  { w: 700,  h: 394  },  // 16:9 landscape — project card thumbnail
  projectGallery:{ w: 600,  h: 800  },  // 3:4 portrait  — in-project photo gallery
}

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff', '.bmp'])

// ── Helpers ───────────────────────────────────────────────────────────────────
function listImages(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
    .sort()
}

function nanoid() {
  return Math.random().toString(36).slice(2, 12)
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function toJpeg(filePath, w, h) {
  const ext = extname(filePath).toLowerCase()
  let input = filePath

  if (ext === '.heic' || ext === '.heif') {
    if (!heicConvert) {
      console.warn(`   ⚠  Skipping ${basename(filePath)} — run: npm install --save-dev heic-convert`)
      return null
    }
    const raw = readFileSync(filePath)
    const jpegBuf = await heicConvert({ buffer: raw, format: 'JPEG', quality: 1 })
    input = Buffer.from(jpegBuf)
  }

  return sharp(input)
    .rotate()
    .resize(w, h, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 88, progressive: true })
    .toBuffer()
}

async function upload(buffer, filename) {
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg',
  })
  return asset._id
}

function imageRef(assetId, alt = '') {
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt }
}

// ── 1. Gallery Strip ─────────────────────────────────────────────────────────
async function uploadGallery() {
  const dir   = resolve(ROOT, 'media', 'fashion', 'gallery')
  const files = listImages(dir)
  if (!files.length) { console.log('—  fashion/gallery/ empty, skipping.'); return null }

  const metaPath = resolve(dir, 'items.json')
  const metaList = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : []

  console.log(`\n⬆  Fashion Gallery Strip  (${files.length} images)`)
  const items = []
  for (const file of files) {
    const meta = metaList.find(m => m.filename === file) ?? {
      title:       basename(file, extname(file)).replace(/^\d+-/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: '',
      tag:         '',
      accent:      'gray',
    }
    console.log(`   ${file}  →  "${meta.title}"`)
    const buf = await toJpeg(resolve(dir, file), DIM.gallery.w, DIM.gallery.h)
    if (!buf) continue
    const id  = await upload(buf, `fashion-gallery-${basename(file, extname(file))}.jpg`)
    console.log(`   ✓ ${id}`)
    items.push({
      _key:        nanoid(),
      title:       meta.title,
      description: meta.description ?? '',
      tag:         meta.tag         ?? '',
      accent:      meta.accent      ?? 'gray',
      image:       imageRef(id, meta.title),
    })
  }
  return items
}

// ── 2. Editorial Grid (8 slots) ──────────────────────────────────────────────
async function uploadEditorialGrid() {
  const dir   = resolve(ROOT, 'media', 'fashion', 'editorial-grid')
  const files = listImages(dir)
  if (!files.length) { console.log('—  fashion/editorial-grid/ empty, skipping.'); return null }

  const slotsPath = resolve(dir, 'slots.json')
  const slots     = existsSync(slotsPath) ? JSON.parse(readFileSync(slotsPath, 'utf8')) : []

  if (files.length > 8) {
    console.log(`⚠  editorial-grid/ has ${files.length} images — only first 8 will be used.`)
  }

  console.log(`\n⬆  Editorial Grid  (${Math.min(files.length, 8)} / 8 slots)`)
  const grid = []
  for (const file of files.slice(0, 8)) {
    const slot  = slots.find(s => s.filename === file)
    const label = slot?.label ?? basename(file, extname(file)).replace(/^\d+-/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    console.log(`   ${file}  →  "${label}"`)
    const buf = await toJpeg(resolve(dir, file), DIM.editorialGrid.w, DIM.editorialGrid.h)
    if (!buf) continue
    const id  = await upload(buf, `fashion-grid-${basename(file, extname(file))}.jpg`)
    console.log(`   ✓ ${id}`)
    grid.push({
      _key:  nanoid(),
      image: imageRef(id, label),
      label,
    })
  }
  return grid
}

// ── 3. Project Documents ─────────────────────────────────────────────────────
async function uploadProjects() {
  const projectsRoot = resolve(ROOT, 'media', 'fashion', 'projects')
  if (!existsSync(projectsRoot)) return

  const folders = readdirSync(projectsRoot)
    .filter(f => statSync(resolve(projectsRoot, f)).isDirectory())
    .sort()

  if (!folders.length) { console.log('—  fashion/projects/ empty, skipping.'); return }

  console.log(`\n⬆  Fashion Projects  (${folders.length} folder${folders.length > 1 ? 's' : ''})`)

  for (const folder of folders) {
    const dir      = resolve(projectsRoot, folder)
    const metaPath = resolve(dir, 'meta.json')
    const meta     = existsSync(metaPath)
      ? JSON.parse(readFileSync(metaPath, 'utf8'))
      : { title: folder.replace(/^\d+-/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

    const title = meta.title ?? folder
    console.log(`\n   📁  ${folder}  →  "${title}"`)

    const allImages = listImages(dir)
    if (!allImages.length) { console.log('      (no images, skipping)'); continue }

    // Separate cover from gallery images
    const coverFile   = allImages.find(f => /^cover\./i.test(f)) ?? allImages[0]
    const galleryFiles = allImages.filter(f => f !== coverFile)

    // Upload cover
    console.log(`      cover: ${coverFile}`)
    const coverBuf = await toJpeg(resolve(dir, coverFile), DIM.projectCover.w, DIM.projectCover.h)
    if (!coverBuf) { console.log('      ⚠  cover skipped (unsupported format)'); continue }
    const coverId  = await upload(coverBuf, `fashion-cover-${slugify(title)}.jpg`)
    console.log(`      ✓ cover ${coverId}`)

    // Upload gallery images
    const galleryRefs = []
    for (const gf of galleryFiles) {
      console.log(`      image: ${gf}`)
      const buf = await toJpeg(resolve(dir, gf), DIM.projectGallery.w, DIM.projectGallery.h)
      if (!buf) continue
      const id  = await upload(buf, `fashion-img-${slugify(title)}-${basename(gf, extname(gf))}.jpg`)
      console.log(`      ✓ ${id}`)
      const caption = basename(gf, extname(gf)).replace(/^\d+-/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      galleryRefs.push({
        _type:   'image',
        _key:    nanoid(),
        asset:   { _type: 'reference', _ref: id },
        alt:     caption,
        caption,
      })
    }

    // Build Sanity document
    const docId = `fashion-${slugify(title)}`
    const doc = {
      _id:         docId,
      _type:       'fashion',
      title,
      slug:        { _type: 'slug', current: slugify(title) },
      projectType: meta.projectType ?? 'editorial',
      date:        meta.date        ?? null,
      tags:        meta.tags        ?? [],
      featured:    meta.featured    ?? false,
      ...(meta.link ? { link: meta.link } : {}),
      coverImage:  { ...imageRef(coverId, title) },
      images:      galleryRefs,
    }

    await client.createOrReplace(doc)
    console.log(`      ✓ Sanity document created: ${docId}`)
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('\n👗  OsmanWorld — Fashion Media Upload\n')

  const [galleryItems, editorialGrid] = await Promise.all([
    uploadGallery(),
    uploadEditorialGrid(),
  ])

  // Patch the fashionPage singleton
  const patch = {}
  if (galleryItems)  { patch.galleryItems  = galleryItems;  patch.galleryTitle  = 'Creative Work' }
  if (editorialGrid) { patch.editorialGrid = editorialGrid }

  if (Object.keys(patch).length > 0) {
    console.log('\n📝  Patching fashionPage document…')
    // createIfNotExists first so the document exists before patching
    await client
      .transaction()
      .createIfNotExists({ _id: 'fashionPage', _type: 'fashionPage' })
      .patch('fashionPage', p => p.set(patch))
      .commit()
    console.log('✓  fashionPage document updated.')
  }

  // Upload individual project documents
  await uploadProjects()

  console.log('\n🎉  Done! Open Sanity Studio (/studio) to review and edit.\n')
}

run().catch(err => {
  console.error('\n✗  Error:', err.message)
  if (err.message?.includes('Unauthorized') || err.message?.includes('token')) {
    console.error('   Add SANITY_API_TOKEN=<editor-token> to .env.local\n')
  }
  process.exit(1)
})
