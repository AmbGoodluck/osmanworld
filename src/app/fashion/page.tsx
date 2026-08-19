export const revalidate = 60

import FashionTab from '../components/FashionTab'
import FashionGrid from '../components/FashionGrid'
import FashionTimeline from '../components/FashionTimeline'
import HorizontalGallery from '../components/HorizontalGallery'
import { safeFetch, getFashionProjects, getFashionPage, urlFor } from '../lib/sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-[#9CA3AF] leading-relaxed text-sm mb-2">{children}</p>
    ),
  },
}

const TYPE_LABEL: Record<string, string> = {
  editorial: 'Editorial', brand: 'Brand', photography: 'Photography',
  styling: 'Styling', design: 'Design', collaboration: 'Collaboration',
}

const FALLBACK_GALLERY = [
  { title: 'Editorial Direction',  description: 'Curating visual narratives that tell compelling stories through fashion.',     tag: 'Editorial', accent: 'gray'    },
  { title: 'Brand Identity',       description: 'Building cohesive brand languages across print, digital, and wearable.',       tag: 'Brand',     accent: 'crimson' },
  { title: 'Photography',          description: 'Capturing mood, texture, and identity through the lens.',                    tag: 'Photo',     accent: 'gray'    },
  { title: 'Styling',              description: 'Composing looks that communicate culture, confidence, and story.',            tag: 'Styling',   accent: 'blue'    },
  { title: 'Collaboration',        description: 'Working with creatives to produce work greater than the sum of its parts.',   tag: 'Collab',    accent: 'crimson' },
  { title: 'Visual Storytelling',  description: 'Every garment, frame, and composition intentionally crafted.',               tag: 'Design',    accent: 'gray'    },
]

export default async function Fashion() {
  const [projects, pageSettings] = await Promise.all([
    safeFetch(getFashionProjects),
    safeFetch(getFashionPage),
  ])

  const pageLabel       = pageSettings?.pageLabel       ?? 'Creative Direction'
  const pageTitle       = pageSettings?.pageTitle       ?? 'Fashion'
  const pageDescription = pageSettings?.pageDescription
    ?? (projects && (projects as any[]).length > 0
        ? `${(projects as any[]).length} project${(projects as any[]).length > 1 ? 's' : ''} - editorial, brand, and visual storytelling.`
        : 'Editorial. Brand. Visual storytelling. Fashion as a language.')

  const galleryItems = pageSettings?.galleryItems?.length
    ? pageSettings.galleryItems.map((item: any) => ({
        ...item,
        image: item.image?.asset ? urlFor(item.image).width(400).height(300).fit('crop').url() : undefined,
      }))
    : FALLBACK_GALLERY

  const galleryTitle = pageSettings?.galleryTitle ?? 'Creative Work'

  const editorialGrid = pageSettings?.editorialGrid?.length
    ? pageSettings.editorialGrid.map((slot: any) => ({
        src:   slot.image?.asset ? urlFor(slot.image).width(600).height(800).fit('crop').url() : undefined,
        alt:   slot.image?.alt  ?? slot.label ?? '',
        label: slot.label ?? '',
      }))
    : []

  const timeline = pageSettings?.fashionTimeline?.length
    ? pageSettings.fashionTimeline
    : undefined

  const timelineLabel = pageSettings?.timelineLabel ?? 'The Story'
  const timelineTitle = pageSettings?.timelineTitle ?? 'Fashion Journey'

  return (
    <main className="text-white pb-28">

      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-10 pt-8 px-4 md:px-8 pointer-events-none">
          <div className="max-w-3xl mx-auto p-8 bg-[#101624]/60 rounded-xl shadow-xl backdrop-blur-md border border-white/10">
            <p className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.22em] mb-3">
              {pageLabel}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif mb-3">{pageTitle}</h1>
            <p className="text-lg text-[#9CA3AF]">{pageDescription}</p>
          </div>
        </div>
        <FashionTab />
      </div>

      <div className="px-4 md:px-8">
        {/* @ts-ignore */}
        <HorizontalGallery items={galleryItems as any[]} title={galleryTitle} />
      </div>

      {/* @ts-ignore */}
      <FashionGrid images={editorialGrid as any[]} />

      <FashionTimeline
        milestones={timeline}
        sectionLabel={timelineLabel}
        sectionTitle={timelineTitle}
      />

      {projects && (projects as any[]).length > 0 && (
        <section className="max-w-5xl mx-auto mt-20 px-4 md:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1A3A8F]/60 to-transparent" />
            <p className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.22em]">Projects</p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1A3A8F]/60 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(projects as any[]).map((project: any) => (
              <article key={project._id}
                className="group bg-white/5 rounded-xl border border-white/10 backdrop-blur-md overflow-hidden hover:border-[#8B0000]/40 hover:shadow-[0_0_32px_rgba(139,0,0,0.12)] transition-all duration-300">

                {project.coverImage?.asset ? (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={urlFor(project.coverImage).width(700).height(394).fit('crop').url()}
                      alt={project.coverImage.alt ?? project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(16,22,36,0.6) 0%, transparent 60%)' }} />
                    {project.featured && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-[#8B0000]/80 text-white border border-[#8B0000]">Featured</span>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-[#1A3A8F]/30 to-[#8B0000]/20 flex items-center justify-center">
                    <span className="text-[#9CA3AF] text-sm font-mono opacity-40">No image</span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold text-lg leading-tight">{project.title}</h3>
                    {project.projectType && (
                      <span className="ml-2 flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs bg-[#87CEEB]/10 text-[#87CEEB] border border-[#87CEEB]/20">
                        {TYPE_LABEL[project.projectType] ?? project.projectType}
                      </span>
                    )}
                  </div>

                  {project.date && (
                    <p className="text-xs font-mono text-[#9CA3AF] mb-3">{project.date}</p>
                  )}

                  {project.description && project.description.length > 0 && (
                    <div className="mb-3 line-clamp-3">
                      <PortableText value={project.description} components={ptComponents} />
                    </div>
                  )}

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 border border-white/10 text-[#9CA3AF]">{tag}</span>
                      ))}
                    </div>
                  )}

                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#87CEEB] hover:text-white transition-colors duration-150">
                      View Project <span aria-hidden>-&gt;</span>
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
