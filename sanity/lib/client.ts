import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

// Only create the client when projectId is present.
// During Cloudflare Pages / CI builds without Sanity env vars, the app
// gracefully falls back to hardcoded defaults via safeFetch in sanity.ts.
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null
