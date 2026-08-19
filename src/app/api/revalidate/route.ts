import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Sanity webhook → POST /api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
// Set SANITY_REVALIDATE_SECRET in .env.local and in Sanity project webhook config.

const PATHS_BY_TYPE: Record<string, string[]> = {
  about:            ['/about',            '/'],
  academics:        ['/academics'],
  fashion:          ['/fashion'],
  tech:             ['/tech'],
  entrepreneurship: ['/entrepreneurship'],
  contact:          ['/contact'],
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const expected = process.env.SANITY_REVALIDATE_SECRET

  if (expected && secret !== expected) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let body: { _type?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const paths = body._type ? (PATHS_BY_TYPE[body._type] ?? ['/']) : ['/']

  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: true, paths })
}
