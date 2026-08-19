"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { getSoundManager } from '../utils/soundManager';

/* ──────────────────────────────────────────────────────────────────────────────
   LaserBeam  —  single-use animation instance.
   Mounts fresh on every navigation (via key prop from LaserLight wrapper).
   Auto-removes itself from DOM after animation completes.
────────────────────────────────────────────────────────────────────────────── */
function LaserBeam({ w, h, uid }: { w: number; h: number; uid: number }) {
  const [show, setShow] = useState(true);
  const perimeter = 2 * (w + h);

  // Sweep speed — intentionally slow so the border trace is clearly visible
  const SWEEP = 2.5;

  // Head lengths as fraction of perimeter (fixed physical px regardless of screen)
  const glowLen  = Math.min(0.18, 220 / perimeter);
  const coreLen  = Math.min(0.08,  95 / perimeter);
  const whiteLen = Math.min(0.03,  38 / perimeter);

  // Unique filter IDs so simultaneous instances (during exit overlap) don't clash
  const FID = {
    outerGlow:   `ll-og-${uid}`,
    midBlur:     `ll-mb-${uid}`,
    coreBlur:    `ll-cb-${uid}`,
    cornerGlow:  `ll-cg-${uid}`,
    cornerSharp: `ll-cs-${uid}`,
  };

  useEffect(() => {
    // Play laser sweep sound (browser autoplay policy: silently skipped before first interaction)
    getSoundManager()?.play('laser');
    // 2.5 s sweep + 0.8 s corner flash + 0.5 s fade-out = 3.8 s total
    const t = setTimeout(() => setShow(false), 3800);
    return () => clearTimeout(t);
  }, []);

  const corners: [number, number][] = [
    [0, 0], [w, 0], [w, h], [0, h],
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          <svg
            width={w}
            height={h}
            className="absolute inset-0"
            aria-hidden="true"
            style={{ overflow: 'visible' }}
          >
            {/* ── SVG filter definitions ───────────────────────────── */}
            <defs>
              {/* wide soft glow for maroon outer halo */}
              <filter id={FID.outerGlow} x="-300%" y="-300%" width="700%" height="700%">
                <feGaussianBlur stdDeviation="14" result="blur" />
              </filter>
              {/* medium blur for blue mid layer */}
              <filter id={FID.midBlur} x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="7" result="blur" />
              </filter>
              {/* slight crisp blur for white core */}
              <filter id={FID.coreBlur} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
              </filter>
              {/* corner flash outer glow */}
              <filter id={FID.cornerGlow} x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="12" result="blur" />
              </filter>
              {/* corner flash sharp */}
              <filter id={FID.cornerSharp} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
              </filter>
            </defs>

            {/* ── 1 · Reveal trace — visible glowing trail left behind ── */}
            <motion.rect
              x={1} y={1} width={w - 2} height={h - 2}
              fill="none"
              stroke="rgba(135,206,235,0.45)"
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: SWEEP, ease: 'linear' }}
            />

            {/* ── 2 · Maroon outer halo — wide, soft, deep glow ────── */}
            <motion.rect
              x={1} y={1} width={w - 2} height={h - 2}
              fill="none"
              stroke="rgba(139,0,0,1)"
              strokeWidth={32}
              filter={`url(#${FID.outerGlow})`}
              initial={{ pathLength: glowLen, pathOffset: 0 }}
              animate={{ pathOffset: 1 }}
              transition={{ duration: SWEEP, ease: 'linear' }}
            />

            {/* ── 3 · Blue spread glow — motion blur feel ───────────── */}
            <motion.rect
              x={1} y={1} width={w - 2} height={h - 2}
              fill="none"
              stroke="rgba(135,206,235,1)"
              strokeWidth={14}
              filter={`url(#${FID.midBlur})`}
              initial={{ pathLength: coreLen, pathOffset: 0 }}
              animate={{ pathOffset: 1 }}
              transition={{ duration: SWEEP, ease: 'linear' }}
            />

            {/* ── 4 · Bright blue laser body ────────────────────────── */}
            <motion.rect
              x={1} y={1} width={w - 2} height={h - 2}
              fill="none"
              stroke="#87CEEB"
              strokeWidth={4}
              initial={{ pathLength: coreLen * 0.6, pathOffset: 0 }}
              animate={{ pathOffset: 1 }}
              transition={{ duration: SWEEP, ease: 'linear' }}
            />

            {/* ── 5 · White-hot leading tip ─────────────────────────── */}
            <motion.rect
              x={1} y={1} width={w - 2} height={h - 2}
              fill="none"
              stroke="rgba(255,255,255,1)"
              strokeWidth={2}
              filter={`url(#${FID.coreBlur})`}
              initial={{ pathLength: whiteLen, pathOffset: 0 }}
              animate={{ pathOffset: 1 }}
              transition={{ duration: SWEEP, ease: 'linear' }}
            />

            {/* ── 6 · Corner radiant flashes (fire after sweep ends) ── */}
            {corners.map(([cx, cy], i) => (
              <g key={i}>
                {/* outer maroon burst */}
                <motion.circle
                  cx={cx} cy={cy}
                  fill="none"
                  stroke="rgba(139,0,0,1)"
                  strokeWidth={3}
                  filter={`url(#${FID.cornerGlow})`}
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: [0, 55, 90], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.7, delay: SWEEP + 0.05, ease: 'easeOut' }}
                />
                {/* inner blue ring */}
                <motion.circle
                  cx={cx} cy={cy}
                  fill="none"
                  stroke="rgba(135,206,235,1)"
                  strokeWidth={2}
                  filter={`url(#${FID.cornerSharp})`}
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: [0, 30, 65], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, delay: SWEEP + 0.12, ease: 'easeOut' }}
                />
                {/* bright dot */}
                <motion.circle
                  cx={cx} cy={cy}
                  fill="white"
                  r={5}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.6, 0] }}
                  transition={{ duration: 0.45, delay: SWEEP, ease: 'easeOut' }}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
              </g>
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   LaserLight  —  layout-level wrapper.
   Listens to pathname changes and remounts LaserBeam on every navigation.
────────────────────────────────────────────────────────────────────────────── */
export default function LaserLight() {
  const pathname  = usePathname();
  const [uid, setUid]   = useState(0);
  const [dim, setDim]   = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    // Re-measure viewport and bump uid so LaserBeam remounts fresh
    setDim({ w: window.innerWidth, h: window.innerHeight });
    setUid((k) => k + 1);
  }, [pathname]);

  if (!dim) return null;

  return <LaserBeam key={uid} w={dim.w} h={dim.h} uid={uid} />;
}
