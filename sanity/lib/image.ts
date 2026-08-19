import imageUrlBuilder from '@sanity/image-url'
import { createClient } from 'next-sanity'
import { client } from './client'

// imageUrlBuilder requires a non-null client.
// When Sanity env vars are missing (e.g. Cloudflare preview builds),
// fall back to a minimal stub client so the module loads without crashing.
// urlFor() will simply return broken image URLs in that case, which is fine.
const safeClient = client ?? createClient({
  projectId: 'preview',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const builder = imageUrlBuilder(safeClient)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}
