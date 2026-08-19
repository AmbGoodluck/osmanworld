"use client";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const DEFAULT_MILESTONES = [
  {
    year: '2019',
    title: 'The Seed',
    description: "First exposure to fashion as a language — at 15, learning that what you wear tells the world who you are before you say a word. Style became a form of self-authorship.",
  },
  {
    year: '2021',
    title: 'African Leadership Academy',
    description: "At ALA in Johannesburg, surrounded by 100 young Africans from 40+ countries, I discovered that fashion could carry culture. Every outfit became a conversation about identity, heritage, and belonging.",
  },
  {
    year: '2022',
    title: 'The Visual Turn',
    description: "Started fashion photography — learning to see light, composition, and story in a single frame. The intersection of technology and aesthetics became my creative obsession.",
  },
  {
    year: '2023',
    title: 'Berea & Beyond',
    description: "Arrived at Berea College with a designer's eye and an engineer's mind. Fashion became the bridge between technical precision and human expression in my work and personal brand.",
  },
  {
    year: '2024',
    title: 'Identity Drop',
    description: "First collaborative fashion project — merging cultural identity, pan-African aesthetics, and digital design into a cohesive visual story. Fashion, finally, as a full creative discipline.",
  },
];

/**
 * FashionTimeline
 * Props:
 *   milestones?:     Array<{ year: string, title: string, description: string }>
 *   sectionLabel?:   string — eyebrow text (default "The Story")
 *   sectionTitle?:   string — heading (default "Fashion Journey")
 */
export default function FashionTimeline({
  milestones = DEFAULT_MILESTONES,
  sectionLabel = 'The Story',
  sectionTitle = 'Fashion Journey',
}) {
  return (
    <section className="max-w-4xl mx-auto px-4 md:px-8 mt-20 pb-4">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.22em] mb-3">{sectionLabel}</p>
        <h2 className="font-serif text-3xl md:text-4xl text-white">{sectionTitle}</h2>
        <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-[#8B0000] to-transparent" />
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Center spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#1A3A8F]/60 to-transparent hidden md:block" />

        <div className="flex flex-col gap-10 md:gap-0">
          {milestones.map((m, i) => (
            <TimelineCard key={i} milestone={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ milestone, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0; // even → left, odd → right

  const xStart = isLeft ? -48 : 48;

  return (
    <div
      ref={ref}
      className={`relative md:flex md:items-center md:gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Card */}
      <motion.div
        className={`md:w-[calc(50%-2rem)] ${isLeft ? 'md:text-right' : 'md:text-left'}`}
        initial={{ opacity: 0, x: xStart }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="relative p-6 rounded-xl backdrop-blur-md"
          style={{
            background: 'rgba(26,58,143,0.12)',
            border: `1px solid rgba(139,0,0,0.35)`,
            borderLeft: isLeft ? undefined : '3px solid #8B0000',
            borderRight: isLeft ? '3px solid #8B0000' : undefined,
          }}
        >
          {/* Year */}
          <p className="font-mono text-[#8B0000] text-sm tracking-widest uppercase mb-2">
            {milestone.year}
          </p>

          {/* Title */}
          <h3 className="font-serif text-xl text-white mb-3">{milestone.title}</h3>

          {/* Description */}
          <p className="text-[#9CA3AF] text-sm leading-relaxed">{milestone.description}</p>

          {/* Corner accent */}
          <div
            className={`absolute top-4 ${isLeft ? 'left-4' : 'right-4'} w-1.5 h-1.5 rounded-full bg-[#8B0000]`}
          />
        </div>
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#8B0000] bg-[#101624] items-center justify-center z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#8B0000]" />
      </motion.div>

      {/* Spacer for the other side */}
      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
    </div>
  );
}
