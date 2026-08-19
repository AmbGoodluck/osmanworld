export const revalidate = 60

import TechTab from '../components/TechTab'
import HorizontalGallery from '../components/HorizontalGallery'
import PhotoGallery from '../components/PhotoGallery'
import { safeFetch, getTechProjects, getTechPage, urlFor } from '../lib/sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-[#9CA3AF] leading-relaxed text-sm mb-2">{children}</p>
    ),
  },
}

const FALLBACK_GALLERY = [
  { title: 'Full-Stack Development', description: 'End-to-end product engineering from database to UI.',                  tag: 'Web',      accent: 'blue'    },
  { title: 'React & Next.js',        description: 'Modern component-driven frontends with server-side rendering.',         tag: 'Frontend', accent: 'blue'    },
  { title: 'Node & APIs',            description: 'RESTful and GraphQL APIs powering scalable backends.',                 tag: 'Backend',  accent: 'gray'    },
  { title: '3D & WebGL',             description: 'Immersive experiences with Three.js and React Three Fiber.',           tag: 'Creative', accent: 'crimson' },
  { title: 'AI & ML',                description: 'Building intelligent systems with Python, TensorFlow, and LLM APIs.',  tag: 'AI',       accent: 'blue'    },
  { title: 'Open Source',            description: 'Contributing to and building tools the community depends on.',         tag: 'OSS',      accent: 'gray'    },
]

const FALLBACK_PHOTOS = [
  { src: '', title: "Osman's World Portfolio"  },
  { src: '', title: 'Dashboard App'            },
  { src: '', title: 'Mobile Build'             },
  { src: '', title: 'API Architecture'         },
  { src: '', title: '3D Web Experience'        },
  { src: '', title: 'Open Source Contribution' },
]

export default async function Tech() {
  const [projects, pageSettings] = await Promise.all([
    safeFetch(getTechProjects),
    safeFetch(getTechPage),
  ])

  const pageTitle       = pageSettings?.pageTitle ?? 'Tech'
  const pageDescription = pageSettings?.pageDescription
    ?? (projects && (projects as any[]).length > 0
        ? `${(projects as any[]).length} project${(projects as any[]).length > 1 ? 's' : ''} — full-stack, systems, and interactive builds.`
        : 'Dive into the technology stack, projects, and interactive experiences.')

  const galleryItems = pageSettings?.galleryItems?.length
    ? pageSettings.galleryItems.map((item: any) => ({
        ...item,
        image: item.image?.asset ? urlFor(item.image).width(400).height(300).fit('crop').url() : undefined,
      }))
    : FALLBACK_GALLERY

  const galleryTitle = pageSettings?.galleryTitle ?? 'Stack & Skills'

  const photos = pageSettings?.photos?.length
    ? pageSettings.photos.map((p: any) => ({
        src:   p.image?.asset ? urlFor(p.image).width(640).height(360).fit('crop').url() : '',
        alt:   p.image?.alt ?? p.title ?? '',
        title: p.title ?? '',
      }))
    : FALLBACK_PHOTOS

  const photosTitle = pageSettings?.photosTitle ?? 'Projects'

  return (
    <main className="pt-8 px-4 md:px-8 text-white pb-20">

      {/* ── Header ── */}
      <div className="max-w-3xl mx-auto mb-8 p-8 bg-white/5 rounded-xl shadow-xl backdrop-blur-md border border-white/10">
        <h1 className="text-4xl font-serif mb-4">{pageTitle}</h1>
        <p className="text-lg text-[#9CA3AF]">{pageDescription}</p>
      </div>

      {/* ── 3D scene ── */}
      <TechTab />

      {/* ── Card Gallery ── */}
      {/* @ts-ignore */}
      <HorizontalGallery items={galleryItems as any[]} title={galleryTitle} />

      {/* ── Photo Gallery ── */}
      {/* @ts-ignore */}
      <PhotoGallery images={photos as any[]} title={photosTitle} aspectRatio="16/9" />

      {/* ── Project cards ── */}
      {projects && (projects as any[]).length > 0 && (
        <section className="max-w-5xl mx-auto mt-14">
          <h2 className="text-2xl font-serif mb-6 text-white">Projects</h2>
          <div className="flex flex-col gap-8">
            {(projects as any[]).map((project: any) => (
              <article key={project._id}
                className="group bg-white/5 rounded-xl border border-white/10 backdrop-blur-md overflow-hidden
                           hover:border-[#87CEEB]/30 transition-all duration-300">

                <div className="flex flex-col md:flex-row">
                  {project.coverImage?.asset ? (
                    <div className="relative md:w-72 flex-shrink-0 aspect-video md:aspect-auto overflow-hidden">
                      <Image
                        src={urlFor(project.coverImage).width(576).height(324).fit('crop').url()}
                        alt={project.coverImage.alt ?? project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="md:w-72 flex-shrink-0 aspect-video md:aspect-auto min-h-[160px]
                                    bg-gradient-to-br from-[#1A3A8F]/40 to-[#101624]
                                    flex items-center justify-center">
                      <span className="font-mono text-[#87CEEB] text-2xl opacity-40">{'</>'}</span>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-semibold text-xl">{project.title}</h3>
                      {project.featured && (
                        <span className="ml-2 flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs
                                         bg-[#8B0000]/20 text-[#9CA3AF] border border-[#8B0000]/30">
                          Featured
                        </span>
                      )}
                    </div>

                    {project.date && (
                      <p className="text-xs font-mono text-[#9CA3AF] mb-3">{project.date}</p>
                    )}

                    {project.description && project.description.length > 0 && (
                      <div className="mb-4">
                        <PortableText value={project.description} components={ptComponents} />
                      </div>
                    )}

                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techStack.map((tech: string) => (
                          <span key={tech}
                            className="px-2.5 py-0.5 rounded-full text-xs font-mono
                                       bg-[#1A3A8F]/40 border border-[#87CEEB]/20 text-[#87CEEB]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.map((tag: string) => (
                          <span key={tag}
                            className="px-2 py-0.5 rounded-full text-xs bg-white/5 border border-white/10 text-[#9CA3AF]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-4 mt-auto pt-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-[#87CEEB] hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {project.codeSnippets && project.codeSnippets.length > 0 && (
                  <div className="border-t border-white/5 px-6 py-4">
                    {project.codeSnippets.map((snippet: any, i: number) => (
                      <div key={i} className="mb-3 last:mb-0">
                        {snippet.caption && (
                          <p className="text-xs text-[#9CA3AF] mb-1.5">
                            {snippet.caption}
                            {snippet.language && (
                              <span className="ml-2 px-1.5 py-0.5 rounded bg-[#1A3A8F]/40 font-mono text-[#87CEEB]">
                                {snippet.language}
                              </span>
                            )}
                          </p>
                        )}
                        <pre className="bg-[#0a1020] rounded-lg p-4 text-xs font-mono text-[#9CA3AF] overflow-x-auto
                                        border border-white/5 leading-relaxed">
                          <code>{snippet.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
