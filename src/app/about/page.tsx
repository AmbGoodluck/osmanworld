export const revalidate = 60

import AboutTab from '../components/AboutTab'
import HorizontalGallery from '../components/HorizontalGallery'
import PhotoGallery from '../components/PhotoGallery'
import { safeFetch, getAbout, urlFor } from '../lib/sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-[#9CA3AF] leading-relaxed mb-4">{children}</p>
    ),
  },
}

// Fallback gallery + photos shown when Sanity has no content yet
const FALLBACK_GALLERY = [
  { title: 'African Leadership Academy', description: 'Pan-African leadership and design thinking in Johannesburg, South Africa.', tag: '2021', accent: 'blue'    },
  { title: 'Berea College',              description: 'Computer Science studies combining technical rigor with entrepreneurial vision.',tag: '2023', accent: 'blue'    },
  { title: 'Founder & Designer',         description: 'Building ventures at the intersection of technology, fashion, and community.',  tag: '2024', accent: 'crimson' },
  { title: 'Leadership',                 description: 'Developing leaders who drive change across Africa and beyond.',                 tag: 'Value', accent: 'gray'   },
  { title: 'Innovation',                 description: 'Solving real problems with creative technology solutions.',                     tag: 'Value', accent: 'blue'   },
  { title: 'Design Thinking',            description: 'Human-centered approach to every product and experience.',                     tag: 'Value', accent: 'gray'   },
  { title: 'Community',                  description: 'Building networks that uplift and create lasting impact.',                      tag: 'Value', accent: 'crimson'},
]

const FALLBACK_PHOTOS = [
  { src: '', title: 'At African Leadership Academy' },
  { src: '', title: 'Berea College Campus' },
  { src: '', title: 'Leadership Summit' },
  { src: '', title: 'Design Workshop' },
  { src: '', title: 'Community Event' },
  { src: '', title: 'Team Collaboration' },
]

export default async function About() {
  const data = await safeFetch(getAbout)

  // Build gallery items from Sanity data (with image URLs) or fallback
  const galleryItems = data?.galleryItems?.length
    ? data.galleryItems.map((item: any) => ({
        ...item,
        image: item.image?.asset ? urlFor(item.image).width(400).height(300).fit('crop').url() : undefined,
      }))
    : FALLBACK_GALLERY

  const galleryTitle = data?.galleryTitle ?? 'Highlights'

  // Build photo items from Sanity data or fallback
  const photos = data?.photos?.length
    ? data.photos.map((p: any) => ({
        src:   p.image?.asset ? urlFor(p.image).width(400).height(533).fit('crop').url() : '',
        alt:   p.image?.alt ?? p.title ?? '',
        title: p.title ?? '',
      }))
    : FALLBACK_PHOTOS

  const photosTitle = data?.photosTitle ?? 'Moments'

  return (
    <main className="text-white pb-20">

      {/* ══════════ HERO — bio LEFT · 3D RIGHT ══════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[72vh] pt-8 px-4 md:px-8 gap-6 items-stretch">

        {/* ── Left: bio ── */}
        <div className="flex flex-col justify-center py-6">
          <div className="p-8 bg-white/5 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 h-full flex flex-col justify-center">
            {data ? (
              <>
                {data.profileImage?.asset && (
                  <div className="mb-5">
                    <Image
                      src={urlFor(data.profileImage).width(100).height(100).fit('crop').url()}
                      alt={data.profileImage.alt ?? 'Profile'}
                      width={100}
                      height={100}
                      className="rounded-full object-cover border-2 border-[#87CEEB]/40"
                    />
                  </div>
                )}
                <p className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.22em] mb-2">About</p>
                <h1 className="text-4xl font-serif mb-2">{data.title}</h1>
                {data.tagline && (
                  <p className="text-[#87CEEB] text-lg mb-4">{data.tagline}</p>
                )}
                {data.bio && data.bio.length > 0 && (
                  <div className="mb-4">
                    <PortableText value={data.bio} components={ptComponents} />
                  </div>
                )}
                <div className="flex flex-wrap gap-3 mt-auto text-sm text-[#9CA3AF]">
                  {data.location && <span>📍 {data.location}</span>}
                  {data.email   && <span>✉️ {data.email}</span>}
                </div>
              </>
            ) : (
              <>
                <p className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.22em] mb-3">About</p>
                <h1 className="text-4xl font-serif mb-4">Osman Amadu Jalloh</h1>
                <p className="text-[#87CEEB] text-lg mb-4">
                  Computer Science Major | Founder | Designer | Leader
                </p>
                <p className="text-[#9CA3AF] leading-relaxed mb-3">
                  Sophomore Computer Science student at Berea College with a passion for building
                  products that solve real problems. My journey started at African Leadership Academy
                  in South Africa, where I learned that technology and design thinking can drive
                  meaningful change.
                </p>
                <p className="text-[#9CA3AF] leading-relaxed">
                  Today, I blend technical skills with entrepreneurial ambition and creative expression
                  through fashion design. Every project, every design, every decision should create impact.
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Right: 3D scene ── */}
        <div className="rounded-xl overflow-hidden min-h-[400px] lg:min-h-0">
          <AboutTab />
        </div>

      </section>

      {/* ══════════ HIGHLIGHTS GALLERY ══════════ */}
      <div className="px-4 md:px-8">
        {/* @ts-ignore */}
        <HorizontalGallery items={galleryItems as any[]} title={galleryTitle} />
      </div>

      {/* ══════════ JOURNEY MILESTONES ══════════ */}
      {data?.journeyMilestones && data.journeyMilestones.length > 0 && (
        <section className="max-w-3xl mx-auto mt-14 px-4 md:px-8">
          <h2 className="text-2xl font-serif mb-6 text-white">Journey</h2>
          <div className="relative pl-6 border-l border-[#1A3A8F]/60">
            {data.journeyMilestones.map((m: any, i: number) => (
              <div key={i} className="mb-8 relative">
                <span className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full bg-[#87CEEB] border-2 border-[#101624] block" />
                <span className="text-[#87CEEB] text-xs font-mono tracking-widest uppercase mb-1 block">
                  {m.year}
                </span>
                <h3 className="text-white font-semibold mb-1">{m.title}</h3>
                {m.description && (
                  <p className="text-[#9CA3AF] text-sm leading-relaxed">{m.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ SOCIAL LINKS ══════════ */}
      {data?.socialLinks && data.socialLinks.length > 0 && (
        <section className="max-w-3xl mx-auto mt-12 px-4 md:px-8">
          <h2 className="text-2xl font-serif mb-6 text-white">Connect</h2>
          <div className="flex flex-wrap gap-3">
            {data.socialLinks.map((s: any, i: number) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-full text-sm font-medium bg-[#1A3A8F]/40 border border-[#87CEEB]/30
                           text-[#87CEEB] hover:bg-[#1A3A8F]/70 hover:border-[#87CEEB]/60 transition-all duration-200"
              >
                {s.platform}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ TAGS ══════════ */}
      {data?.tags && data.tags.length > 0 && (
        <div className="max-w-3xl mx-auto mt-8 px-4 md:px-8 flex flex-wrap gap-2">
          {data.tags.map((tag: string) => (
            <span key={tag}
              className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-[#9CA3AF]">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ══════════ MOMENTS ══════════ */}
      <div className="mt-16 px-4 md:px-8">
        {/* @ts-ignore */}
        <PhotoGallery images={photos as any[]} title={photosTitle} aspectRatio="3/4" />
      </div>

    </main>
  )
}
