"use client";
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import Image from 'next/image';

const SPEED = 55; // px per second

/**
 * HorizontalGallery
 * Props:
 *   items: Array<{
 *     image?: string,   // URL or null
 *     title: string,
 *     description?: string,
 *     tag?: string,
 *     accent?: 'blue' | 'crimson' | 'gray'  // optional per-card colour
 *   }>
 *   title?: string  // optional section heading above the gallery
 */
export default function HorizontalGallery({ items = [], title }) {
  const trackRef    = useRef(null);
  const halfWidth   = useRef(0);
  const x           = useMotionValue(0);
  const [paused, setPaused]     = useState(false);
  const [ready, setReady]       = useState(false);

  // Touch drag state
  const touchStartX     = useRef(0);
  const touchStartMotX  = useRef(0);
  const dragging        = useRef(false);

  // Duplicate items so the loop appears seamless
  const doubled = [...items, ...items];

  // Measure after mount / on resize
  const measure = useCallback(() => {
    if (!trackRef.current) return;
    halfWidth.current = trackRef.current.scrollWidth / 2;
    setReady(true);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure, items]);

  // Continuous scroll
  useAnimationFrame((_, delta) => {
    if (paused || !ready || halfWidth.current === 0) return;
    const next = x.get() - (SPEED * delta) / 1000;
    // When we've scrolled exactly one full set, snap back to 0
    x.set(next <= -halfWidth.current ? next + halfWidth.current : next);
  });

  // Touch handlers
  function onTouchStart(e) {
    touchStartX.current   = e.touches[0].clientX;
    touchStartMotX.current = x.get();
    dragging.current = true;
    setPaused(true);
  }
  function onTouchMove(e) {
    if (!dragging.current) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    let nx = touchStartMotX.current + diff;
    // Keep within loop range
    if (nx > 0) nx -= halfWidth.current;
    if (nx < -halfWidth.current) nx += halfWidth.current;
    x.set(nx);
  }
  function onTouchEnd() {
    dragging.current = false;
    setPaused(false);
  }

  if (!items.length) return null;

  return (
    <div className="w-full mt-10">
      {title && (
        <h2 className="text-2xl font-serif mb-5 text-white max-w-5xl mx-auto px-4 md:px-0">
          {title}
        </h2>
      )}

      {/* Outer clip */}
      <div
        className="relative w-full overflow-hidden py-4 select-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #101624 0%, transparent 100%)' }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #101624 0%, transparent 100%)' }}
        />

        {/* Scrolling track */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-4 w-max px-4"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {doubled.map((item, i) => (
            <GalleryCard key={i} item={item} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Per-card accent config ── */
const ACCENT_STYLES = {
  blue: {
    bar:    'bg-[#87CEEB]',
    tag:    'bg-[#1A3A8F]/40 border-[#87CEEB]/20 text-[#87CEEB]',
    glow:   'hover:border-[#87CEEB]/30 hover:shadow-[0_0_24px_rgba(135,206,235,0.10)]',
    empty:  'from-[#1A3A8F]/40 to-[#101624]',
  },
  crimson: {
    bar:    'bg-[#8B0000]',
    tag:    'bg-[#8B0000]/20 border-[#8B0000]/30 text-[#9CA3AF]',
    glow:   'hover:border-[#8B0000]/30 hover:shadow-[0_0_24px_rgba(139,0,0,0.14)]',
    empty:  'from-[#8B0000]/30 to-[#101624]',
  },
  gray: {
    bar:    'bg-[#9CA3AF]',
    tag:    'bg-white/5 border-white/10 text-[#9CA3AF]',
    glow:   'hover:border-white/20 hover:shadow-[0_0_24px_rgba(255,255,255,0.05)]',
    empty:  'from-[#1A3A8F]/20 to-[#101624]',
  },
};

function GalleryCard({ item }) {
  const style = ACCENT_STYLES[item.accent ?? 'blue'];

  return (
    <motion.article
      className={`relative flex-shrink-0 w-56 sm:w-64 md:w-72 rounded-xl overflow-hidden
                  bg-white/5 border border-white/10 backdrop-blur-md cursor-pointer
                  transition-colors duration-300 ${style.glow}`}
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt={item.title ?? ''}
              fill
              sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 288px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Bottom gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(16,22,36,0.75) 0%, transparent 60%)' }}
            />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${style.empty} flex items-center justify-center`}>
            <span className="text-white/10 text-3xl font-serif">
              {item.title?.[0] ?? '?'}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Accent bar */}
        <div className={`w-6 h-[2px] rounded-full mb-3 ${style.bar}`} />

        <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-1">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-[#9CA3AF] text-xs leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        {item.tag && (
          <span className={`inline-block mt-3 px-2.5 py-0.5 rounded-full text-xs border ${style.tag}`}>
            {item.tag}
          </span>
        )}
      </div>
    </motion.article>
  );
}
