"use client";
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

/* ─────────────────────────── types ─────────────────────────── */
interface PageData {
  heroHeading?: string;
  heroSubheading?: string;
  timelineTitle?: string;
  skillsTitle?: string;
  projectsTitle?: string;
  certificationsTitle?: string;
}

interface WorkExp {
  _id: string;
  company: string;
  role: string;
  employmentType?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  logoUrl?: string | null;
  achievements?: string[];
  techStack?: string[];
}

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency?: string;
}

interface Cert {
  _id: string;
  name: string;
  issuer?: string;
  date?: string;
  badgeUrl?: string | null;
  credentialUrl?: string;
  description?: string;
}

interface FeaturedProject {
  _id: string;
  title: string;
  coverImageUrl?: string | null;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  date?: string;
  tags?: string[];
}

/* ─────────────────────────── fallback data ─────────────────────────── */
const FALLBACK_EXPERIENCES: WorkExp[] = [
  {
    _id: 'f1',
    company: 'African Leadership Academy',
    role: 'Student Leader & Programme Participant',
    employmentType: 'Full-time',
    location: 'Johannesburg, South Africa',
    startDate: '2021-01',
    endDate: '2022-12',
    current: false,
    achievements: [
      'Selected among top 100 young African leaders from 40+ countries',
      'Led cross-cultural design thinking projects addressing Pan-African challenges',
      'Developed entrepreneurship and leadership frameworks applied to real ventures',
      'Built lasting networks across Africa that continue to fuel collaborative work',
    ],
    techStack: ['Design Thinking', 'Leadership', 'Entrepreneurship', 'Public Speaking'],
  },
  {
    _id: 'f2',
    company: 'Berea College',
    role: 'Computer Science Student & Developer',
    employmentType: 'Part-time',
    location: 'Berea, KY — Remote',
    startDate: '2023-08',
    current: true,
    achievements: [
      'Pursuing Bachelor of Science in Computer Science with focus on systems and web',
      'Built full-stack portfolio platform with Next.js, Sanity CMS, and Three.js',
      'Developed AI-integrated tools using LLM APIs for productivity and automation',
      'Contributed to open-source projects and led peer coding workshops',
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Python', 'Three.js'],
  },
  {
    _id: 'f3',
    company: 'Independent / Freelance',
    role: 'Full-Stack Developer & Creative Technologist',
    employmentType: 'Freelance',
    location: 'Remote',
    startDate: '2022-06',
    current: true,
    achievements: [
      'Designed and shipped multiple client websites from concept to deployment',
      'Built custom e-commerce solutions with React and headless CMS architectures',
      'Produced brand identities and visual systems for early-stage startups',
      'Delivered 3D interactive experiences using WebGL and React Three Fiber',
    ],
    techStack: ['Next.js', 'Sanity', 'Figma', 'Three.js', 'Node.js'],
  },
]

const FALLBACK_SKILLS: Skill[] = [
  // Programming Languages
  { _id: 's1',  name: 'Python',        category: 'Programming Languages',  proficiency: 'Advanced'     },
  { _id: 's2',  name: 'JavaScript',    category: 'Programming Languages',  proficiency: 'Expert'       },
  { _id: 's3',  name: 'TypeScript',    category: 'Programming Languages',  proficiency: 'Advanced'     },
  { _id: 's4',  name: 'Java',          category: 'Programming Languages',  proficiency: 'Intermediate' },
  { _id: 's5',  name: 'C++',           category: 'Programming Languages',  proficiency: 'Intermediate' },
  { _id: 's6',  name: 'SQL',           category: 'Programming Languages',  proficiency: 'Intermediate' },
  // Frameworks
  { _id: 's7',  name: 'React',         category: 'Frameworks & Libraries', proficiency: 'Expert'       },
  { _id: 's8',  name: 'Next.js',       category: 'Frameworks & Libraries', proficiency: 'Expert'       },
  { _id: 's9',  name: 'Node.js',       category: 'Frameworks & Libraries', proficiency: 'Advanced'     },
  { _id: 's10', name: 'Three.js',      category: 'Frameworks & Libraries', proficiency: 'Advanced'     },
  { _id: 's11', name: 'Framer Motion', category: 'Frameworks & Libraries', proficiency: 'Advanced'     },
  { _id: 's12', name: 'TailwindCSS',   category: 'Frameworks & Libraries', proficiency: 'Expert'       },
  // Tools
  { _id: 's13', name: 'Git & GitHub',  category: 'Tools & Platforms',      proficiency: 'Expert'       },
  { _id: 's14', name: 'Figma',         category: 'Tools & Platforms',      proficiency: 'Advanced'     },
  { _id: 's15', name: 'Sanity CMS',    category: 'Tools & Platforms',      proficiency: 'Expert'       },
  { _id: 's16', name: 'Vercel',        category: 'Tools & Platforms',      proficiency: 'Advanced'     },
  { _id: 's17', name: 'Docker',        category: 'Tools & Platforms',      proficiency: 'Intermediate' },
  { _id: 's18', name: 'AWS',           category: 'Tools & Platforms',      proficiency: 'Beginner'     },
  // Soft Skills
  { _id: 's19', name: 'Leadership',         category: 'Soft Skills', proficiency: 'Expert'       },
  { _id: 's20', name: 'Design Thinking',    category: 'Soft Skills', proficiency: 'Expert'       },
  { _id: 's21', name: 'Communication',      category: 'Soft Skills', proficiency: 'Expert'       },
  { _id: 's22', name: 'Problem Solving',    category: 'Soft Skills', proficiency: 'Expert'       },
  { _id: 's23', name: 'Project Management', category: 'Soft Skills', proficiency: 'Advanced'     },
  { _id: 's24', name: 'Public Speaking',    category: 'Soft Skills', proficiency: 'Advanced'     },
]

const FALLBACK_CERTS: Cert[] = [
  {
    _id: 'c1',
    name: 'African Leadership Academy Certificate',
    issuer: 'African Leadership Academy',
    date: '2022-12',
    description: 'Pan-African entrepreneurship and leadership programme for top emerging leaders.',
  },
  {
    _id: 'c2',
    name: 'Full-Stack Web Development',
    issuer: 'freeCodeCamp',
    date: '2023-06',
    description: 'Responsive design, JavaScript, React, Node.js, and database management.',
  },
  {
    _id: 'c3',
    name: 'Google UX Design Certificate',
    issuer: 'Google / Coursera',
    date: '2023-09',
    description: 'User research, wireframing, prototyping, and usability testing.',
  },
  {
    _id: 'c4',
    name: 'Dean\'s List Academic Excellence',
    issuer: 'Berea College',
    date: '2024-05',
    description: 'Recognition for academic achievement in Computer Science programme.',
  },
]

/* ─────────────────────────── helpers ─────────────────────────── */
function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  // Sanity dates come as YYYY-MM-DD, we only need YYYY-MM
  const parts = dateStr.split('-')
  const year = parseInt(parts[0])
  const month = parseInt(parts[1]) - 1
  if (isNaN(year)) return dateStr
  const d = new Date(year, month, 1)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function getDuration(start?: string, end?: string, current?: boolean): string {
  const s = formatDate(start)
  const e = current ? 'Present' : (end ? formatDate(end) : '')
  if (!s) return ''
  return e ? `${s} – ${e}` : s
}

const PROFICIENCY_COLOR: Record<string, string> = {
  Expert:       'bg-[#87CEEB]/20 border-[#87CEEB]/40 text-[#87CEEB]',
  Advanced:     'bg-[#1A3A8F]/30 border-[#1A3A8F]/50 text-[#87CEEB]/80',
  Intermediate: 'bg-white/5 border-white/15 text-[#9CA3AF]',
  Beginner:     'bg-white/5 border-white/10 text-[#9CA3AF]/70',
}

const CATEGORY_ICON: Record<string, string> = {
  'Programming Languages':  '{ }',
  'Frameworks & Libraries': '⚡',
  'Tools & Platforms':      '⚙',
  'Soft Skills':            '◈',
}

/* ─────────────────────────── Hero ─────────────────────────── */
type Particle = { id: number; left: string; top: string; size: number; dur: number; delay: number; op: number }

function HeroSection({ heading, subheading }: { heading: string; subheading: string }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 48 }, (_, i) => ({
        id:    i,
        left:  `${(i * 7.3 + 3) % 97}%`,
        top:   `${(i * 13.1 + 7) % 90}%`,
        size:  1 + (i % 3),
        dur:   6 + (i % 8),
        delay: (i % 11) * 0.45,
        op:    0.06 + (i % 6) * 0.05,
      }))
    )
  }, [])

  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Particle field */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ opacity: [p.op, p.op * 4, p.op], y: [0, -20, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {/* Brand colour accent dots */}
        {[
          { l: '12%', t: '25%', c: '#87CEEB', s: 3, d: 9  },
          { l: '88%', t: '20%', c: '#8B0000', s: 2, d: 7  },
          { l: '75%', t: '65%', c: '#87CEEB', s: 2, d: 11 },
          { l: '20%', t: '70%', c: '#8B0000', s: 3, d: 8  },
          { l: '50%', t: '85%', c: '#1A3A8F', s: 4, d: 10 },
        ].map((p, i) => (
          <motion.div key={`a${i}`} className="absolute rounded-full"
            style={{ left: p.l, top: p.t, width: p.s, height: p.s, backgroundColor: p.c }}
            animate={{ opacity: [0.3, 0.9, 0.3], y: [0, -24, 0] }}
            transition={{ duration: p.d, delay: i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Laser accent lines */}
      <div className="pointer-events-none absolute inset-0">
        {/* Top horizontal laser */}
        <motion.div
          className="absolute top-[28%] left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(135,206,235,0.15) 20%, rgba(139,0,0,0.25) 50%, rgba(135,206,235,0.15) 80%, transparent)' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Bottom horizontal laser */}
        <motion.div
          className="absolute bottom-[22%] left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(139,0,0,0.2) 30%, rgba(135,206,235,0.3) 50%, rgba(139,0,0,0.2) 70%, transparent)' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Left vertical accent */}
        <motion.div
          className="absolute left-[15%] top-0 bottom-0 w-px hidden md:block"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(26,58,143,0.3) 30%, rgba(135,206,235,0.2) 60%, transparent)' }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.5 }}
        />
        {/* Right vertical accent */}
        <motion.div
          className="absolute right-[15%] top-0 bottom-0 w-px hidden md:block"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(139,0,0,0.3) 30%, rgba(26,58,143,0.2) 60%, transparent)' }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.8 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.28em' }}
          transition={{ duration: 1 }}
          className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.28em] mb-6"
        >
          Portfolio · Osman Amadu Jalloh
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif leading-none text-white mb-6 select-none"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '0.04em' }}
        >
          {heading.split(' ').map((word, i) => (
            <span key={i}>
              {i > 0 && ' '}
              {word === 'Experience' || word === '&' ? (
                <span className="text-[#8B0000]">{word}</span>
              ) : word}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-[#9CA3AF] text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-8"
        >
          {subheading}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[#8B0000] to-transparent"
          style={{ transformOrigin: 'center' }}
        />
      </div>
    </section>
  )
}

/* ─────────────────────────── Timeline Entry ─────────────────────────── */
function TimelineEntry({ exp, index }: { exp: WorkExp; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [expanded, setExpanded] = useState(false)

  const duration = getDuration(exp.startDate, exp.endDate, exp.current)
  const achievements = exp.achievements ?? []
  const showAll = expanded || achievements.length <= 3

  return (
    <div ref={ref} className="relative pl-10 md:pl-14 pb-14 last:pb-0">
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 flex items-center justify-center">
        {/* Outer pulse ring */}
        {exp.current && (
          <motion.div
            className="absolute w-7 h-7 rounded-full"
            style={{ border: '1px solid rgba(139,0,0,0.5)' }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {/* Dot */}
        <motion.div
          className="relative w-4 h-4 rounded-full border-2 flex items-center justify-center z-10"
          style={{
            backgroundColor: '#101624',
            borderColor: exp.current ? '#8B0000' : '#1A3A8F',
            boxShadow: exp.current ? '0 0 14px rgba(139,0,0,0.6)' : '0 0 10px rgba(26,58,143,0.5)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: exp.current ? '#8B0000' : '#87CEEB' }}
          />
        </motion.div>
      </div>

      {/* Entry card */}
      <motion.div
        initial={{ opacity: 0, x: 32 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08 + 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-xl p-5 md:p-6
                   hover:border-[#87CEEB]/20 hover:bg-white/[0.06] transition-all duration-300"
      >
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            {exp.logoUrl ? (
              <Image
                src={exp.logoUrl}
                alt={exp.company}
                width={44}
                height={44}
                className="rounded-lg object-cover border border-white/10"
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#1A3A8F]/50 to-[#8B0000]/30
                              flex items-center justify-center border border-white/10 flex-shrink-0">
                <span className="text-white font-serif text-base font-bold">
                  {exp.company[0]}
                </span>
              </div>
            )}
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-1">
              <h3 className="text-white font-semibold text-lg leading-snug">{exp.role}</h3>
              {exp.current && (
                <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium
                                 bg-[#8B0000]/25 text-[#ff8080] border border-[#8B0000]/40">
                  Current
                </span>
              )}
              {exp.employmentType && (
                <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs
                                 bg-[#1A3A8F]/30 text-[#87CEEB] border border-[#87CEEB]/20">
                  {exp.employmentType}
                </span>
              )}
            </div>
            <p className="text-[#87CEEB] font-medium text-base">{exp.company}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-[#9CA3AF] font-mono">
              {duration && <span>{duration}</span>}
              {exp.location && (
                <>
                  <span className="text-[#9CA3AF]/40">·</span>
                  <span>📍 {exp.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-2">
              {(showAll ? achievements : achievements.slice(0, 3)).map((a, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.08 + 0.25 + i * 0.06 }}
                  className="flex items-start gap-2.5 text-sm text-[#9CA3AF] leading-relaxed"
                >
                  <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[#8B0000] flex-shrink-0" />
                  {a}
                </motion.li>
              ))}
            </ul>
            {achievements.length > 3 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-xs text-[#87CEEB] hover:text-white transition-colors font-mono tracking-wide"
              >
                {expanded ? '↑ Show less' : `+ ${achievements.length - 3} more`}
              </button>
            )}
          </div>
        )}

        {/* Tech stack */}
        {exp.techStack && exp.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
            {exp.techStack.map((tech) => (
              <span key={tech}
                className="px-2.5 py-0.5 rounded-full text-xs font-mono
                           bg-[#1A3A8F]/30 border border-[#87CEEB]/15 text-[#87CEEB]/80">
                {tech}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

/* ─────────────────────────── Timeline Section ─────────────────────────── */
function TimelineSection({ title, experiences }: { title: string; experiences: WorkExp[] }) {
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-8 mb-24">
      <SectionHeader title={title} />
      <div className="relative">
        {/* Glowing vertical line */}
        <div
          className="absolute left-[7px] md:left-[7px] top-0 bottom-0 w-px"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(26,58,143,0.8) 10%, rgba(135,206,235,0.4) 50%, rgba(26,58,143,0.8) 90%, transparent 100%)',
          }}
        />
        <div className="space-y-0">
          {experiences.map((exp, i) => (
            <TimelineEntry key={exp._id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Skills Section ─────────────────────────── */
function SkillChip({ skill, delay }: { skill: Skill; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const colorClass = PROFICIENCY_COLOR[skill.proficiency ?? 'Intermediate'] ?? PROFICIENCY_COLOR.Intermediate

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, scale: 1.05 }}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-default
                  transition-shadow duration-200 hover:shadow-[0_0_14px_rgba(135,206,235,0.15)] ${colorClass}`}
    >
      {skill.name}
    </motion.div>
  )
}

function SkillsSection({ title, skills }: { title: string; skills: Skill[] }) {
  const categories = ['Programming Languages', 'Frameworks & Libraries', 'Tools & Platforms', 'Soft Skills']

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-8 mb-24">
      <SectionHeader title={title} />
      <div className="space-y-10">
        {categories.map((cat) => {
          const catSkills = skills.filter((s) => s.category === cat)
          if (!catSkills.length) return null
          return (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm text-[#8B0000]">{CATEGORY_ICON[cat] ?? '·'}</span>
                <h3 className="text-white font-medium text-sm tracking-wide">{cat}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-[#8B0000]/30 to-transparent" />
              </div>
              <div className="flex flex-wrap gap-2">
                {catSkills.map((skill, i) => (
                  <SkillChip key={skill._id} skill={skill} delay={i * 0.04} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ─────────────────────────── Featured Projects ─────────────────────────── */
function ProjectCard({ project, index }: { project: FeaturedProject; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-xl overflow-hidden
                 hover:border-[#87CEEB]/30 hover:shadow-[0_0_32px_rgba(135,206,235,0.08)] transition-all duration-300"
    >
      {project.coverImageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(16,22,36,0.8) 0%, transparent 50%)' }} />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-[#1A3A8F]/40 to-[#101624]
                        flex items-center justify-center">
          <span className="font-mono text-[#87CEEB] text-3xl opacity-30">{'</>'}</span>
        </div>
      )}

      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
        {project.date && (
          <p className="text-xs font-mono text-[#9CA3AF] mb-3">{project.date}</p>
        )}

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 5).map((tech) => (
              <span key={tech}
                className="px-2 py-0.5 rounded-full text-xs font-mono
                           bg-[#1A3A8F]/30 border border-[#87CEEB]/15 text-[#87CEEB]/80">
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-3">
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
    </motion.article>
  )
}

function ProjectsSection({ title, projects }: { title: string; projects: FeaturedProject[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 mb-24">
      <SectionHeader title={title} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p, i) => (
          <ProjectCard key={p._id} project={p} index={i} />
        ))}
      </div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <Link
          href="/tech"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium
                     border border-[#87CEEB]/30 text-[#87CEEB] hover:bg-[#87CEEB]/10 transition-all duration-200"
        >
          View all projects →
        </Link>
      </motion.div>
    </section>
  )
}

/* ─────────────────────────── Certifications ─────────────────────────── */
function CertCard({ cert, index }: { cert: Cert; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      className="group flex gap-4 p-5 bg-white/[0.04] border border-white/10 backdrop-blur-md
                 rounded-xl hover:border-[#8B0000]/30 hover:shadow-[0_0_24px_rgba(139,0,0,0.1)]
                 transition-all duration-300"
    >
      {/* Badge area */}
      <div className="flex-shrink-0">
        {cert.badgeUrl ? (
          <Image
            src={cert.badgeUrl}
            alt={cert.name}
            width={52}
            height={52}
            className="rounded-lg object-cover border border-white/10"
          />
        ) : (
          <div className="w-[52px] h-[52px] rounded-lg bg-gradient-to-br from-[#8B0000]/30 to-[#1A3A8F]/30
                          flex items-center justify-center border border-[#8B0000]/20">
            <svg className="w-6 h-6 text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-sm leading-snug mb-0.5 line-clamp-2">{cert.name}</h3>
        {cert.issuer && (
          <p className="text-[#87CEEB] text-xs mb-1">{cert.issuer}</p>
        )}
        {cert.description && (
          <p className="text-[#9CA3AF] text-xs leading-relaxed line-clamp-2 mb-1.5">{cert.description}</p>
        )}
        <div className="flex items-center justify-between gap-2 mt-auto">
          {cert.date && (
            <span className="text-xs font-mono text-[#9CA3AF]">{formatDate(cert.date)}</span>
          )}
          {cert.credentialUrl && (
            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-[#87CEEB] hover:text-white transition-colors flex-shrink-0">
              Verify →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function CertsSection({ title, certs }: { title: string; certs: Cert[] }) {
  return (
    <section className="max-w-4xl mx-auto px-4 md:px-8 mb-24">
      <SectionHeader title={title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certs.map((cert, i) => (
          <CertCard key={cert._id} cert={cert} index={i} />
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────── Section Header ─────────────────────────── */
function SectionHeader({ title }: { title: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1A3A8F]/60 to-transparent" />
        <h2 className="font-serif text-2xl md:text-3xl text-white whitespace-nowrap">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1A3A8F]/60 to-transparent" />
      </div>
      <div className="mt-3 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-[#8B0000] to-transparent" />
    </motion.div>
  )
}

/* ─────────────────────────── Main component ─────────────────────────── */
export default function ExperienceClient({
  pageData,
  experiences,
  skills,
  certifications,
  featuredProjects,
}: {
  pageData: PageData | null
  experiences: WorkExp[] | null
  skills: Skill[] | null
  certifications: Cert[] | null
  featuredProjects: FeaturedProject[] | null
}) {
  const heroHeading        = pageData?.heroHeading        ?? 'Work & Experience'
  const heroSubheading     = pageData?.heroSubheading     ?? 'A journey of impact, innovation and growth.'
  const timelineTitle      = pageData?.timelineTitle      ?? 'Experience'
  const skillsTitle        = pageData?.skillsTitle        ?? 'Skills & Technologies'
  const projectsTitle      = pageData?.projectsTitle      ?? 'Featured Projects'
  const certificationsTitle = pageData?.certificationsTitle ?? 'Certifications & Awards'

  const expList   = experiences?.length  ? experiences  : FALLBACK_EXPERIENCES
  const skillList = skills?.length       ? skills       : FALLBACK_SKILLS
  const certList  = certifications?.length ? certifications : FALLBACK_CERTS

  return (
    <main className="relative text-white pb-20 overflow-x-hidden">

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,0.5) 1px,transparent 1px,transparent 60px),' +
            'repeating-linear-gradient(90deg,rgba(255,255,255,0.5),rgba(255,255,255,0.5) 1px,transparent 1px,transparent 60px)',
        }}
      />

      {/* ── Hero ── */}
      <HeroSection heading={heroHeading} subheading={heroSubheading} />

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mb-20">
        <div className="h-px bg-gradient-to-r from-transparent via-[#8B0000]/40 to-transparent" />
      </div>

      {/* ── Timeline ── */}
      <TimelineSection title={timelineTitle} experiences={expList} />

      {/* ── Skills ── */}
      <SkillsSection title={skillsTitle} skills={skillList} />

      {/* ── Featured Projects (only when data exists) ── */}
      {featuredProjects && featuredProjects.length > 0 && (
        <ProjectsSection title={projectsTitle} projects={featuredProjects} />
      )}

      {/* ── Certifications ── */}
      <CertsSection title={certificationsTitle} certs={certList} />

    </main>
  )
}
