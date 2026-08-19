"use client";
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import Image from 'next/image';

const SPEED = 48; // px per second — tweak for faster/slower

/**
 * PhotoGallery — infinite auto-scrolling image strip
 *
 * Props:
 *   images: Array<{
 *     src: string,          // image URL (Sanity urlFor or static)
 *     alt?: string,
 *     title?: string,       // optional caption shown on hover
 *   }>
 *   title?: string          // optional section heading
 *   aspectRatio?: string    // default '3/4' (portrait) — try '16/9', '1/1'
 */
export default function PhotoGallery({
  images = [],
  title,
  aspectRatio = '3/4',
}) {
  const trackRef   = useRef(null);
  const halfWidth  = useRef(0);
  const x          = useMotionValue(0);
  const [paused, setPaused]   = useState(false);
  const [ready,  setReady]    = useState(false);

  // Touch
  const touchStartX    = useRef(0);
  const touchStartMotX = useRef(0);
  const dragging       = useRef(false);

  // Duplicate for seamless loop
  const doubled = [...images, ...images];

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
  }, [measure, images]);

  useAnimationFrame((_, delta) => {
    if (paused || !ready || halfWidth.current === 0) return;
    const next = x.get() - (SPEED * delta) / 1000;
    x.set(next <= -halfWidth.current ? next + halfWidth.current : next);
  });

  function onTouchStart(e) {
    touchStartX.current    = e.touches[0].clientX;
    touchStartMotX.current = x.get();
    dragging.current = true;
    setPaused(true);
  }
  function onTouchMove(e) {
    if (!dragging.current) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    let nx = touchStartMotX.current + diff;
    if (nx > 0) nx -= halfWidth.current;
    if (nx < -halfWidth.current) nx += halfWidth.current;
    x.set(nx);
  }
  function onTouchEnd() {
    dragging.current = false;
    setPaused(false);
  }

  if (!images.length) return null;

  return (
    <div className="w-full mt-12">
      {title && (
        <h2 className="text-2xl font-serif mb-5 text-white max-w-5xl mx-auto px-4 md:px-0">
          {title}
        </h2>
      )}

      <div
        className="relative w-full overflow-hidden select-none py-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #101624 0%, rgba(16,22,36,0.6) 60%, transparent 100%)' }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #101624 0%, rgba(16,22,36,0.6) 60%, transparent 100%)' }}
        />

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-3 w-max px-6"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {doubled.map((img, i) => (
            <PhotoCard key={i} img={img} aspectRatio={aspectRatio} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function PhotoCard({ img, aspectRatio }) {
  const [hovered, setHovered] = useState(false);

  // Derive card width from aspect ratio for consistent sizing
  const cardWidth = aspectRatio === '16/9' ? 'w-64 sm:w-72 md:w-80'
                  : aspectRatio === '1/1'  ? 'w-44 sm:w-52 md:w-56'
                  :                          'w-36 sm:w-40 md:w-48'; // portrait default

  return (
    <motion.div
      className={`relative flex-shrink-0 ${cardWidth} rounded-xl overflow-hidden cursor-pointer`}
      style={{
        aspectRatio,
        boxShadow: hovered
          ? '0 0 0 2px #8B0000, 0 8px 32px rgba(139,0,0,0.35), 0 4px 16px rgba(0,0,0,0.6)'
          : '0 4px 24px rgba(0,0,0,0.5)',
        transition: 'box-shadow 0.3s ease',
      }}
      whileHover={{ scale: 1.06, y: -6 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {img.src ? (
        <>
          <Image
            src={img.src}
            alt={img.alt ?? img.title ?? 'Gallery image'}
            fill
            sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 192px"
            className="object-cover transition-transform duration-700"
            style={{ transform: hovered ? 'scale(1.08)' : 'scale(1.0)' }}
          />
          {/* Permanent subtle bottom vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(16,22,36,0.7) 0%, transparent 50%)' }}
          />
          {/* Title caption — slides up on hover */}
          {img.title && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 px-3 py-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
              transition={{ duration: 0.22 }}
            >
              <p className="text-white text-xs font-medium leading-snug line-clamp-2">
                {img.title}
              </p>
            </motion.div>
          )}
          {/* Maroon top accent line on hover */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px] bg-[#8B0000]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ transformOrigin: 'left' }}
          />
        </>
      ) : (
        /* Placeholder slot */
        <div className="w-full h-full bg-gradient-to-br from-[#1A3A8F]/30 to-[#8B0000]/15 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {img.title && (
            <p className="text-white/20 text-xs text-center px-2 line-clamp-2">{img.title}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
