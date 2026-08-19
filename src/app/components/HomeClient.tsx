"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from './ProfileCard';
import { getSoundManager, type SoundName } from '../utils/soundManager';

interface DomainCard {
  num: string;
  name: string;
  href: string;
  tagline: string;
  desc: string;
  symbol: string;
  accentColor: string;
}

interface HomePageData {
  eyebrow?: string;
  heroTitle?: string;
  heroAccentWord?: string;
  rotatingTitles?: string[];
  bio?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  sectionLabel?: string;
  sectionTitle?: string;
  domainCards?: DomainCard[];
}

const DEFAULT_TITLES = [
  'Full-Stack Product Engineer',
  'AI Builder & Founder',
  'Computer Science Sophomore',
  'Fashion Designer',
  'Creative Entrepreneur',
];

const DEFAULT_DOMAINS: DomainCard[] = [
  { num: '01', name: 'About',            href: '/about',            tagline: 'The person behind the world',  desc: 'Journey, values, and story.',              symbol: '◎', accentColor: '#87CEEB' },
  { num: '02', name: 'Projects',         href: '/projects',         tagline: 'Shipped. Real. Live.',         desc: 'Fynd, Regain AI, College Circle and more.', symbol: '◉', accentColor: '#8B0000' },
  { num: '03', name: 'Tech',             href: '/tech',             tagline: 'Systems & experiences',        desc: 'Full-stack, interactive builds.',           symbol: '◈', accentColor: '#87CEEB' },
  { num: '04', name: 'Fashion',          href: '/fashion',          tagline: 'Visual storytelling',          desc: 'Editorial, brand, photography.',            symbol: '◇', accentColor: '#9CA3AF' },
  { num: '05', name: 'Entrepreneurship', href: '/entrepreneurship', tagline: 'Growth in motion',             desc: 'Ventures, metrics, momentum.',              symbol: '▲', accentColor: '#8B0000' },
];

type Particle = {
  id: number; left: string; top: string;
  size: number; duration: number; delay: number; opacity: number;
};

function useParticles(count: number): Particle[] {
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => {
        const a = (i * 137.508) % 360;
        const r = 10 + (i * 61) % 85;
        return {
          id:       i,
          left:     `${50 + r * Math.cos((a * Math.PI) / 180)}%`,
          top:      `${50 + r * Math.sin((a * Math.PI) / 180) * 0.5}%`,
          size:     1 + (i % 3),
          duration: 7 + (i % 7),
          delay:    (i % 11) * 0.4,
          opacity:  0.1 + (i % 5) * 0.06,
        };
      })
    );
  }, [count]);
  return particles;
}

export default function HomeClient({
  profileImageUrl,
  homePage,
}: {
  profileImageUrl: string | null;
  homePage: HomePageData | null;
}) {
  const titles  = homePage?.rotatingTitles?.length ? homePage.rotatingTitles : DEFAULT_TITLES;
  const domains = homePage?.domainCards?.length    ? homePage.domainCards    : DEFAULT_DOMAINS;

  const [titleIdx, setTitleIdx] = useState(0);
  const particles = useParticles(42);

  useEffect(() => {
    const id = setInterval(() => setTitleIdx((i) => (i + 1) % titles.length), 2600);
    return () => clearInterval(id);
  }, [titles.length]);

  const eyebrow         = homePage?.eyebrow         ?? 'Portfolio · Osman Amadu Jalloh';
  const heroTitle       = homePage?.heroTitle        ?? "OSMAN'S WORLD";
  const heroAccentWord  = homePage?.heroAccentWord   ?? 'WORLD';
  const bio             = homePage?.bio              ?? 'Sophomore CS student at Berea College. Shipped Fynd, a verified-student social platform on iOS and web with 100+ active users. Built Regain AI, a Claude API-powered contact automation tool. Founder, builder, and designer.';
  const primaryLabel    = homePage?.primaryCtaLabel  ?? 'Explore the World';
  const primaryHref     = homePage?.primaryCtaHref   ?? '/about';
  const secondaryLabel  = homePage?.secondaryCtaLabel ?? 'View Projects';
  const secondaryHref   = homePage?.secondaryCtaHref  ?? '/projects';
  const sectionLabel    = homePage?.sectionLabel     ?? 'Navigate';
  const sectionTitle    = homePage?.sectionTitle     ?? 'Choose Your World';

  const accentIdx   = heroTitle.indexOf(heroAccentWord);
  const beforeAccent = accentIdx > -1 ? heroTitle.slice(0, accentIdx) : heroTitle;
  const afterAccent  = accentIdx > -1 ? heroTitle.slice(accentIdx + heroAccentWord.length) : '';

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,0.5) 1px,transparent 1px,transparent 60px),' +
            'repeating-linear-gradient(90deg,rgba(255,255,255,0.5),rgba(255,255,255,0.5) 1px,transparent 1px,transparent 60px)',
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ opacity: [p.opacity, p.opacity * 3, p.opacity], y: [0, -18, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {[
          { left: '18%', top: '30%', color: '#87CEEB', size: 3, dur: 9,  delay: 1.2 },
          { left: '75%', top: '20%', color: '#8B0000', size: 2, dur: 7,  delay: 0.4 },
          { left: '88%', top: '65%', color: '#87CEEB', size: 2, dur: 11, delay: 2.1 },
          { left: '12%', top: '72%', color: '#8B0000', size: 3, dur: 8,  delay: 0.8 },
          { left: '55%', top: '85%', color: '#1A3A8F', size: 4, dur: 10, delay: 3.0 },
        ].map((p, i) => (
          <motion.div
            key={`accent-${i}`}
            className="absolute rounded-full"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, backgroundColor: p.color }}
            animate={{ opacity: [0.35, 0.85, 0.35], y: [0, -22, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <section className="relative z-10 min-h-screen flex flex-col justify-center px-4 md:px-12 pt-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex justify-center order-first lg:order-last">
            <ProfileCard imageUrl={profileImageUrl} size={220} mobileSize={160} />
          </div>
          <div className="order-last lg:order-first">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.28em] mb-6"
            >
              {eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif leading-none mb-6 select-none"
              style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', letterSpacing: '0.04em' }}
            >
              {beforeAccent}
              {accentIdx > -1 && <span className="text-[#8B0000]">{heroAccentWord}</span>}
              {afterAccent}
            </motion.h1>
            <div className="h-9 mb-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={titleIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="text-xl text-[#87CEEB] font-light tracking-wide"
                >
                  {titles[titleIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-[#9CA3AF] leading-relaxed max-w-md mb-10 text-base"
            >
              {bio}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={primaryHref}
                onClick={() => getSoundManager()?.play('about')}
                className="px-7 py-3 rounded-full bg-[#8B0000] text-white text-sm font-medium tracking-wide hover:bg-[#a00000] transition-all duration-200 hover:shadow-[0_0_24px_rgba(139,0,0,0.45)]"
              >
                {primaryLabel}
              </Link>
              <Link
                href={secondaryHref}
                onClick={() => getSoundManager()?.play('tech')}
                className="px-7 py-3 rounded-full border border-[#87CEEB]/40 text-[#87CEEB] text-sm font-medium tracking-wide hover:bg-[#87CEEB]/10 transition-all duration-200"
              >
                {secondaryLabel}
              </Link>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <p className="font-mono text-xs text-[#9CA3AF] tracking-widest uppercase">Scroll</p>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-[#9CA3AF] to-transparent"
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      <section className="relative z-10 px-4 md:px-12 pb-32 pt-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <p className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.28em] mb-4">
              {sectionLabel}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">{sectionTitle}</h2>
            <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[#8B0000] to-transparent" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {domains.map((d, i) => (
              <DomainCard key={d.href} domain={d} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function DomainCard({ domain: d, index }: { domain: DomainCard; index: number }) {
  const [hovered, setHovered] = useState(false);
  const soundMap: Record<string, SoundName> = {
    '/about': 'about', '/academics': 'academics', '/fashion': 'fashion',
    '/tech': 'tech', '/entrepreneurship': 'entrepreneurship',
  };
  const sound: SoundName = soundMap[d.href] ?? 'click';
  function handleHover(isHovered: boolean) {
    setHovered(isHovered);
    if (isHovered) getSoundManager()?.play('hover');
  }
  const hexToRgba = (hex: string, a: number) => {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${a})`;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={d.href} onClick={() => getSoundManager()?.play(sound)}>
        <motion.div
          className="group relative h-full min-h-[220px] p-6 rounded-2xl overflow-hidden cursor-pointer bg-white/[0.04] border border-white/10 backdrop-blur-md transition-all duration-300"
          style={hovered ? { borderColor: hexToRgba(d.accentColor, 0.4), boxShadow: `0 0 40px ${hexToRgba(d.accentColor, 0.14)}` } : {}}
          onHoverStart={() => handleHover(true)}
          onHoverEnd={() => handleHover(false)}
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <motion.div className="absolute inset-0 rounded-2xl pointer-events-none" animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.35 }} style={{ background: `radial-gradient(ellipse at 50% 80%, ${hexToRgba(d.accentColor, 0.094)} 0%, transparent 70%)` }} />
          <motion.p className="font-mono text-6xl font-bold leading-none mb-4 select-none" style={{ color: d.accentColor }} animate={{ opacity: hovered ? 0.25 : 0.12 }} transition={{ duration: 0.3 }}>{d.num}</motion.p>
          <motion.p className="text-2xl mb-3 select-none" style={{ color: d.accentColor }} animate={{ scale: hovered ? 1.2 : 1 }} transition={{ duration: 0.3 }}>{d.symbol}</motion.p>
          <h3 className="font-serif text-xl text-white mb-1 leading-tight">{d.name}</h3>
          <p className="text-xs font-mono uppercase tracking-widest mb-3 opacity-80" style={{ color: d.accentColor }}>{d.tagline}</p>
          <motion.p className="text-[#9CA3AF] text-xs leading-relaxed" animate={{ opacity: hovered ? 1 : 0.5 }} transition={{ duration: 0.2 }}>{d.desc}</motion.p>
          <motion.p className="mt-4 text-sm font-medium" style={{ color: d.accentColor }} animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }} transition={{ duration: 0.22 }}>Enter →</motion.p>
          <motion.div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: d.accentColor, transformOrigin: 'left' }} animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35 }} />
        </motion.div>
      </Link>
    </motion.div>
  );
}
