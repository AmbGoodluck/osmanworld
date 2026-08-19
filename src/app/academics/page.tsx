export const revalidate = 60

import AcademicsTab from '../components/AcademicsTab'
import HorizontalGallery from '../components/HorizontalGallery'
import PhotoGallery from '../components/PhotoGallery'
import { safeFetch, getAcademics, getAcademicsPage, urlFor } from '../lib/sanity'
import { PortableText } from '@portabletext/react'

const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-[#9CA3AF] leading-relaxed text-sm mb-2">{children}</p>
    ),
  },
}

const STATUS_COLORS: Record<string, string> = {
  active:    'bg-[#87CEEB]/15 text-[#87CEEB] border-[#87CEEB]/30',
  completed: 'bg-[#9CA3AF]/15 text-[#9CA3AF] border-[#9CA3AF]/30',
}

const FALLBACK_GALLERY = [
  { title: 'Computer Science',          description: 'Core CS fundamentals, algorithms, and systems programming.',          tag: 'Major',    accent: 'blue'    },
  { title: 'Data Structures',           description: 'Deep dive into efficient data organisation and algorithm complexity.', tag: 'Course',   accent: 'blue'    },
  { title: 'Calculus & Linear Algebra', description: 'Mathematical foundations powering machine learning and graphics.',    tag: 'Course',   accent: 'gray'    },
  { title: 'Software Engineering',      description: 'Agile, system design, and collaborative development practices.',       tag: 'Course',   accent: 'blue'    },
  { title: 'Entrepreneurship',          description: 'Business model design, lean startup, and venture creation.',           tag: 'Elective', accent: 'crimson' },
  { title: 'Design Thinking',           description: 'Human-centered problem solving from research to prototype.',           tag: 'Elective', accent: 'gray'    },
]

const FALLBACK_PHOTOS = [
  { src: '', title: 'Berea College Library'  },
  { src: '', title: 'CS Lab Sessions'        },
  { src: '', title: 'Research Project'       },
  { src: '', title: 'Hackathon 2024'         },
  { src: '', title: 'Study Group'            },
  { src: '', title: 'Graduation Ceremony'    },
]

export default async function Academics() {
  const [data, pageSettings] = await Promise.all([
    safeFetch(getAcademics),
    safeFetch(getAcademicsPage),
  ])

  const pageTitle       = pageSettings?.pageTitle ?? 'Academics'
  const pageDescription = pageSettings?.pageDescription
    ?? (data && (data as any[]).length > 0
        ? `${(data as any[]).length} academic record${(data as any[]).length > 1 ? 's' : ''} — courses, certifications, and skills.`
        : 'Explore the intellectual foundations — courses, skills, and knowledge structures built over years of study.')

  const galleryItems = pageSettings?.galleryItems?.length
    ? pageSettings.galleryItems.map((item: any) => ({
        ...item,
        image: item.image?.asset ? urlFor(item.image).width(400).height(300).fit('crop').url() : undefined,
      }))
    : FALLBACK_GALLERY

  const galleryTitle = pageSettings?.galleryTitle ?? 'Coursework & Skills'

  const photos = pageSettings?.photos?.length
    ? pageSettings.photos.map((p: any) => ({
        src:   p.image?.asset ? urlFor(p.image).width(400).height(400).fit('crop').url() : '',
        alt:   p.image?.alt ?? p.title ?? '',
        title: p.title ?? '',
      }))
    : FALLBACK_PHOTOS

  const photosTitle = pageSettings?.photosTitle ?? 'Campus Life'

  return (
    <main className="pt-8 px-4 md:px-8 text-white pb-20">

      {/* ── Header ── */}
      <div className="max-w-3xl mx-auto mb-8 p-8 bg-white/5 rounded-xl shadow-xl backdrop-blur-md border border-white/10">
        <h1 className="text-4xl font-serif mb-4">{pageTitle}</h1>
        <p className="text-lg text-[#9CA3AF]">{pageDescription}</p>
      </div>

      {/* ── 3D scene ── */}
      <AcademicsTab />

      {/* ── Card Gallery ── */}
      {/* @ts-ignore */}
      <HorizontalGallery items={galleryItems as any[]} title={galleryTitle} />

      {/* ── Photo Gallery ── */}
      {/* @ts-ignore */}
      <PhotoGallery images={photos as any[]} title={photosTitle} aspectRatio="1/1" />

      {/* ── Degree / Institution cards ── */}
      {data && (data as any[]).length > 0 && (
        <section className="max-w-4xl mx-auto mt-14">
          <h2 className="text-2xl font-serif mb-6 text-white">Education</h2>
          <div className="flex flex-col gap-6">
            {(data as any[]).map((entry: any) => (
              <div key={entry._id}
                className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-white text-xl font-semibold">{entry.title}</h3>
                    <p className="text-[#87CEEB] text-sm mt-0.5">{entry.institution}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-1 text-xs text-[#9CA3AF] font-mono">
                    {entry.startDate && (
                      <span>{entry.startDate} — {entry.current ? 'Present' : (entry.endDate ?? '')}</span>
                    )}
                    {entry.current && (
                      <span className={`px-2 py-0.5 rounded-full border text-xs ${STATUS_COLORS.active}`}>
                        Current
                      </span>
                    )}
                  </div>
                </div>

                {entry.description && entry.description.length > 0 && (
                  <div className="mb-4">
                    <PortableText value={entry.description} components={ptComponents} />
                  </div>
                )}

                {/* Skills */}
                {entry.skills && entry.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-mono text-[#87CEEB] tracking-widest uppercase mb-2">Skills</p>
                    <div className="flex flex-col gap-2">
                      {entry.skills.map((skill: any, i: number) => (
                        <div key={i}>
                          <span className="text-xs text-[#9CA3AF] mr-2">{skill.category}:</span>
                          <div className="inline-flex flex-wrap gap-1.5 mt-1">
                            {skill.items?.map((item: string) => (
                              <span key={item}
                                className="px-2.5 py-0.5 rounded-full text-xs bg-[#1A3A8F]/40 border border-[#87CEEB]/20 text-[#87CEEB]">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Courses */}
                {entry.courses && entry.courses.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-mono text-[#87CEEB] tracking-widest uppercase mb-2">Courses</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {entry.courses.map((course: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-2.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-sm text-white">{course.name}</span>
                          {course.grade && (
                            <span className="text-xs font-mono text-[#9CA3AF] ml-2">{course.grade}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {entry.certifications && entry.certifications.length > 0 && (
                  <div>
                    <p className="text-xs font-mono text-[#87CEEB] tracking-widest uppercase mb-2">Certifications</p>
                    <div className="flex flex-col gap-2">
                      {entry.certifications.map((cert: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-2.5 rounded-lg bg-[#8B0000]/10 border border-[#8B0000]/20">
                          <div>
                            <span className="text-sm text-white">{cert.name}</span>
                            {cert.issuer && <span className="text-xs text-[#9CA3AF] ml-2">· {cert.issuer}</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            {cert.date && <span className="text-xs font-mono text-[#9CA3AF]">{cert.date}</span>}
                            {cert.url && (
                              <a href={cert.url} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-[#87CEEB] hover:underline">View →</a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                    {entry.tags.map((tag: string) => (
                      <span key={tag}
                        className="px-2.5 py-0.5 rounded-full text-xs bg-white/5 border border-white/10 text-[#9CA3AF]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
