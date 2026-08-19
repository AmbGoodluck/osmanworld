/**
 * upload-media.mjs
 *
 * Reads images from media/ subfolders, converts each one to portrait JPEG
 * using sharp, then uploads to Sanity and patches the "about" document.
 *
 * Folder structure expected:
 *   media/profile/   ← single profile photo (any file, first one wins)
 *   media/moments/   ← personal photos → about.photos[]
 *   media/gallery/   ← highlight card images → about.galleryItems[]
 *                       edit media/gallery/items.json to set titles/tags
 *
 * Run:  node scripts/upload-media.mjs
 *
 * Requires sharp:
 *   npm install --save-dev sharp
 */

import { createClient }            from '@sanity/client'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, dirname, extname, basename }   from 'path'
import { fileURLToPath }           from 'url'

// ── dynamic import sharp ───────────────────────────────────────────────────
let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('\n✗  sharp is not installed.')
  console.error('   Run:  npm install --save-dev sharp\n')
  process.exit(1)
}

// ── dynamic import heic-convert (optional — only needed for HEIC files) ────
let heicConvert
try {
  heicConvert = (await import('heic-convert')).default
} catch { /* heic-convert not installed — HEIC files will be skipped */ }

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = resolve(__dirname, '..')

// ── Read .env.local ──────────────────────────────────────────────────────────
const envPath = resolve(ROOT, '.env.local')
if (!existsSync(envPath)) {
  console.error('✗  .env.local not found. Add NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.')
  process.exit(1)
}
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const client = createClient({
  projectId:  env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:    env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn:     false,
  token:      env.SANITY_API_TOKEN,
})

// ── Config: portrait dimensions per section ──────────────────────────────────
const DIMENSIONS = {
  profile: { width: 600,  height: 750  },   // 4:5  portrait
  moments: { width: 600,  height: 800  },   // 3:4  portrait
  gallery: { width: 480,  height: 640  },   // 3:4  portrait
}

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff', '.bmp', '.gif'])

// ── Helpers ──────────────────────────────────────────────────────────────────
function listImages(folder) {
  if (!existsSync(folder)) return []
  return readdirSync(folder)
    .filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
    .sort()
}

function nanoid() {
  return Math.random().toString(36).slice(2, 12)
}

/**
 * Converts an image file to portrait JPEG buffer via sharp.
 * HEIC files are pre-decoded with heic-convert before sharp processes them.
 * Uses 'cover' strategy: crops to fill the target dimensions centred.
 */
async function toPortraitJpeg(filePath, width, height) {
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
    .rotate()                  // auto-rotate from EXIF
    .resize(width, height, {
      fit:      'cover',
      position: 'centre',
    })
    .jpeg({ quality: 88, progressive: true })
    .toBuffer()
}

/** Uploads a Buffer to Sanity and returns the asset _ref string */
async function uploadBuffer(buffer, filename) {
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg',
  })
  return asset._id   // e.g. "image-abc123-800x600-jpg"
}

function imageRef(assetId) {
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log('\n📁  OsmanWorld — Media Upload\n')

  const patch = {}   // accumulates fields to patch on the about document

  // ── 1. Profile Image ───────────────────────────────────────────────────────
  const profileDir    = resolve(ROOT, 'media', 'profile')
  const profileImages = listImages(profileDir)

  if (profileImages.length > 0) {
    const file = profileImages[0]
    if (profileImages.length > 1) {
      console.log(`⚠  Multiple files in media/profile/ — using "${file}"`)
    }
    console.log(`⬆  Profile  →  ${file}`)
    const buf = await toPortraitJpeg(resolve(profileDir, file), DIMENSIONS.profile.width, DIMENSIONS.profile.height)
    if (buf) {
      const assetId = await uploadBuffer(buf, `profile-${basename(file, extname(file))}.jpg`)
      console.log(`   ✓ uploaded: ${assetId}`)
      patch.profileImage = { ...imageRef(assetId), alt: 'Osman Amadu Jalloh' }
    }
  } else {
    console.log('—  media/profile/ is empty, skipping profile image.')
  }

  // ── 2. Moments (photo gallery) ────────────────────────────────────────────
  const momentsDir    = resolve(ROOT, 'media', 'moments')
  const momentFiles   = listImages(momentsDir)

  if (momentFiles.length > 0) {
    console.log(`\n⬆  Moments  (${momentFiles.length} photo${momentFiles.length > 1 ? 's' : ''})`)
    const photos = []
    for (const file of momentFiles) {
      const caption = basename(file, extname(file))
        .replace(/^\d+-/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
      console.log(`   ${file}  →  "${caption}"`)
      const buf = await toPortraitJpeg(resolve(momentsDir, file), DIMENSIONS.moments.width, DIMENSIONS.moments.height)
      if (!buf) continue
      const assetId = await uploadBuffer(buf, `moment-${basename(file, extname(file))}.jpg`)
      console.log(`   ✓ ${assetId}`)
      photos.push({
        _key:  nanoid(),
        image: { ...imageRef(assetId), alt: caption },
        title: caption,
      })
    }
    patch.photos      = photos
    patch.photosTitle = 'Moments'
  } else {
    console.log('\n—  media/moments/ is empty, skipping Moments gallery.')
  }

  // ── 3. Gallery Cards ─────────────────────────────────────────────────────
  const galleryDir   = resolve(ROOT, 'media', 'gallery')
  const galleryFiles = listImages(galleryDir)
  const metaPath     = resolve(galleryDir, 'items.json')
  const metaList     = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : []

  if (galleryFiles.length > 0) {
    console.log(`\n⬆  Gallery  (${galleryFiles.length} image${galleryFiles.length > 1 ? 's' : ''})`)
    const galleryItems = []
    for (const file of galleryFiles) {
      const meta = metaList.find(m => m.filename === file) ?? {
        title:       basename(file, extname(file)).replace(/^\d+-/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        description: '',
        tag:         '',
        accent:      'blue',
      }
      console.log(`   ${file}  →  "${meta.title}"`)
      const buf = await toPortraitJpeg(resolve(galleryDir, file), DIMENSIONS.gallery.width, DIMENSIONS.gallery.height)
      if (!buf) continue
      const assetId = await uploadBuffer(buf, `gallery-${basename(file, extname(file))}.jpg`)
      console.log(`   ✓ ${assetId}`)
      galleryItems.push({
        _key:        nanoid(),
        title:       meta.title,
        description: meta.description ?? '',
        tag:         meta.tag         ?? '',
        accent:      meta.accent      ?? 'blue',
        image:       { ...imageRef(assetId), alt: meta.title },
      })
    }
    patch.galleryItems = galleryItems
    patch.galleryTitle = 'Highlights'
  } else {
    console.log('\n—  media/gallery/ is empty (images only), skipping Gallery Cards.')
  }

  // ── 4. Patch the about document ───────────────────────────────────────────
  if (Object.keys(patch).length === 0) {
    console.log('\n✓  Nothing to upload — all media folders are empty.\n')
    return
  }

  console.log('\n📝  Patching Sanity "about" document…')
  await client.patch('about').set(patch).commit()
  console.log('✓  about document updated.\n')
  console.log('🎉  Done! Open Sanity Studio (/studio) to review and edit your images.\n')
}

run().catch(err => {
  console.error('\n✗  Error:', err.message)
  if (err.message?.includes('Unauthorized') || err.message?.includes('token')) {
    console.error('   You need a write token:')
    console.error('   sanity.io/manage → your project → API → Tokens → Add API token (Editor role)')
    console.error('   Then add SANITY_API_TOKEN=<token> to .env.local and re-run.\n')
  }
  process.exit(1)
})
