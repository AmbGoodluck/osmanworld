export const revalidate = 60

import EntrepreneurshipTab from '../components/EntrepreneurshipTab'
import HorizontalGallery from '../components/HorizontalGallery'
import PhotoGallery from '../components/PhotoGallery'
import { safeFetch, getVentures, getEntrepreneurshipPage, urlFor } from '../lib/sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-[#9CA3AF] leading-relaxed text-sm mb-2">{children}</p>
    ),
  },
}

const STATUS_STYLES: Record<string, string> = {
  active:    'bg-[#87CEEB]/15 text-[#87CEEB]  border-[#87CEEB]/30',
  completed: 'bg-[#9CA3AF]/15 text-[#9CA3AF]  border-[#9CA3AF]/30',
  paused:    'bg-[#8B0000]/15 text-[#9CA3AF]  border-[#8B0000]/30',
  stealth:   'bg-white/5     text-[#9CA3AF]   border-white/10',
}

const FALLBACK_GALLERY = [
  { title: 'Product Vision',  description: 'Defining the problem, market, and the product that solves it.',               tag: 'Strategy',   accent: 'crimson' },
  { title: 'Go-to-Market',    description: 'Positioning, pricing, and launch execution that captures attention.',          tag: 'Growth',     accent: 'blue'    },
  { title: 'Team Building',   description: 'Recruiting and leading diverse teams with complementary strengths.',           tag: 'Leadership', accent: 'gray'    },
  { title: 'Fundraising',     description: 'Crafting the narrative and financials that move investors to yes.',            tag: 'Finance',    accent: 'crimson' },
  { title: 'Impact Metrics',  description: 'Measuring success beyond revenue — community, access, and change.',            tag: 'Impact',     accent: 'blue'    },
  { title: 'Scale & Systems', description: 'Building repeatable processes that grow without breaking.',                   tag: 'Ops',        accent: 'gray'    },
]

const FALLBACK_PHOTOS = [
  { src: '', title: 'Pitch Day'        },
  { src: '', title: 'Product Launch'   },
  { src: '', title: 'Team Offsite'     },
  { src: '', title: 'Investor Meeting' },
  { src: '', title: 'Prototype Demo'   },
  { src: '', title: 'Community Event'  },
]

export default async function Entrepreneurship() {
  const [ventures, pageSettings] = await Promise.all([
    safeFetch(getVentures),
    safeFetch(getEntrepreneurshipPage),
  ])

  const pageTitle       = pageSettings?.pageTitle ?? 'Entrepreneurship'
  const pageDescription = pageSettings?.pageDescription
    ?? (ventures && (ventures as any[]).length > 0
        ? `${(ventures as any[]).length} venture${(ventures as any[]).length > 1 ? 's' : ''} — growth, impact, and momentum.`
        : 'See the entrepreneurial journey, ventures, and growth mindset brought to life.')

  const galleryItems = pageSettings?.galleryItems?.length
    ? pageSettings.galleryItems.map((item: any) => ({
        ...item,
        image: item.image?.asset ? urlFor(item.image).width(400).height(300).fit('crop').url() : undefined,
      }))
    : FALLBACK_GALLERY

  const galleryTitle = pageSettings?.galleryTitle ?? 'Venture Focus Areas'

  const photos = pageSettings?.photos?.length
    ? pageSettings.photos.map((p: any) => ({
        src:   p.image?.asset ? urlFor(p.image).width(640).height(360).fit('crop').url() : '',
        alt:   p.image?.alt ?? p.title ?? '',
        title: p.title ?? '',
      }))
    : FALLBACK_PHOTOS

  const photosTitle = pageSettings?.photosTitle ?? 'Venture Moments'

  return (
    <main className="pt-8 px-4 md:px-8 text-white pb-20">

      {/* ── Header ── */}
      <div className="max-w-3xl mx-auto mb-8 p-8 bg-white/5 rounded-xl shadow-xl backdrop-blur-md border border-white/10">
        <h1 className="text-4xl font-serif mb-4">{pageTitle}</h1>
        <p className="text-lg text-[#9CA3AF]">{pageDescription}</p>
      </div>

      {/* ── 3D scene ── */}
      <EntrepreneurshipTab />

      {/* ── Card Gallery ── */}
      {/* @ts-ignore */}
      <HorizontalGallery items={galleryItems as any[]} title={galleryTitle} />

      {/* ── Photo Gallery ── */}
      {/* @ts-ignore */}
      <PhotoGallery images={photos as any[]} title={photosTitle} aspectRatio="16/9" />

      {/* ── Venture cards ── */}
      {ventures && (ventures as any[]).length > 0 && (
        <section className="max-w-5xl mx-auto mt-14">
          <h2 className="text-2xl font-serif mb-6 text-white">Ventures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(ventures as any[]).map((venture: any) => (
              <article key={venture._id}
                className="group bg-white/5 rounded-xl border border-white/10 backdrop-blur-md overflow-hidden
                           hover:border-[#8B0000]/40 transition-all duration-300">

                {venture.coverImage?.asset ? (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={urlFor(venture.coverImage).width(700).height(394).fit('crop').url()}
                      alt={venture.coverImage.alt ?? venture.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {venture.status && (
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border
                                        ${STATUS_STYLES[venture.status] ?? STATUS_STYLES.stealth}`}>
                        {venture.status.charAt(0).toUpperCase() + venture.status.slice(1)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-[#8B0000]/20 to-[#1A3A8F]/20 relative">
                    {venture.status && (
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border
                                        ${STATUS_STYLES[venture.status] ?? STATUS_STYLES.stealth}`}>
                        {venture.status.charAt(0).toUpperCase() + venture.status.slice(1)}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold text-lg">{venture.title}</h3>
                    {venture.date && (
                      <span className="text-xs font-mono text-[#9CA3AF] ml-2 flex-shrink-0">{venture.date}</span>
                    )}
                  </div>

                  {venture.description && venture.description.length > 0 && (
                    <div className="mb-4">
                      <PortableText value={venture.description} components={ptComponents} />
                    </div>
                  )}

                  {venture.metrics && venture.metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg bg-white/5 border border-white/5">
                      {venture.metrics.map((metric: any, i: number) => (
                        <div key={i} className="text-center">
                          <p className="text-white font-bold text-lg leading-tight">{metric.value}</p>
                          <p className="text-[#9CA3AF] text-xs leading-tight">{metric.unit}</p>
                          <p className="text-[#87CEEB] text-xs mt-0.5">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {venture.tags && venture.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {venture.tags.map((tag: string) => (
                        <span key={tag}
                          className="px-2 py-0.5 rounded-full text-xs bg-white/5 border border-white/10 text-[#9CA3AF]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {venture.website && (
                    <a href={venture.website} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#87CEEB] hover:text-white transition-colors">
                      Visit Venture <span aria-hidden>→</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
