"use client";
import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion, useMotionValue, useSpring, useTransform, useAnimationFrame,
} from 'framer-motion';

/* ── orbiting satellite dot ─────────────────────────────────────────────────── */
function OrbDot({
  baseAngle, radius, size, color, speed,
}: {
  baseAngle: number; radius: number; size: number; color: string; speed: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useAnimationFrame((t) => {
    const angle = ((baseAngle + t * speed * 0.018) % 360) * (Math.PI / 180);
    if (ref.current) {
      ref.current.style.transform =
        `translate(calc(-50% + ${Math.cos(angle) * radius}px), calc(-50% + ${Math.sin(angle) * radius}px))`;
    }
  });
  return (
    <div
      ref={ref}
      className="absolute top-1/2 left-1/2 rounded-full pointer-events-none w-[var(--dot-sz)] h-[var(--dot-sz)] bg-[var(--dot-color)] [box-shadow:var(--dot-shadow)]"
      style={{
        '--dot-sz':     `${size}px`,
        '--dot-color':  color,
        '--dot-shadow': `0 0 ${size * 2}px ${color}88`,
      } as React.CSSProperties}
    />
  );
}

/* ── rotating gradient ring ─────────────────────────────────────────────────── */
function RotatingRing({ hovered }: { hovered: boolean }) {
  return (
    <motion.div
      className="absolute -inset-1 rounded-full pointer-events-none z-0 bg-[conic-gradient(from_0deg,#1A3A8F,#8B0000_30%,#87CEEB_55%,#8B0000_80%,#1A3A8F)]"
      animate={{ rotate: 360 }}
      transition={{ duration: hovered ? 1.8 : 5, repeat: Infinity, ease: 'linear' }}
    />
  );
}

/* ── main component ──────────────────────────────────────────────────────────── */
export interface ProfileCardProps {
  imageUrl: string | null;
  size?: number;
  mobileSize?: number;
}

const ORBITS = [
  { baseAngle: 0,   radius: 138, size: 5, color: '#87CEEB', speed: 0.9  },
  { baseAngle: 72,  radius: 142, size: 3, color: '#8B0000', speed: 0.65 },
  { baseAngle: 144, radius: 135, size: 4, color: '#1A3A8F', speed: 1.1  },
  { baseAngle: 216, radius: 140, size: 3, color: '#87CEEB', speed: 0.75 },
  { baseAngle: 288, radius: 136, size: 5, color: '#8B0000', speed: 0.55 },
];

export default function ProfileCard({ imageUrl, size = 220 }: ProfileCardProps) {
  const [hovered, setHovered] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  /* mouse-tracking parallax */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 22 });

  function onMouseMove(e: React.MouseEvent) {
    const r = frameRef.current!.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width  - 0.5);
    rawY.set((e.clientY - r.top)  / r.height - 0.5);
  }
  function onMouseLeave() { rawX.set(0); rawY.set(0); setHovered(false); }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, y: 28 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.35 }}
      className="flex flex-col items-center select-none"
    >
      {/* orbit + frame container — sized via CSS var */}
      <div
        className="relative w-[var(--container-sz)] h-[var(--container-sz)]"
        style={{ '--container-sz': `${size + 36}px` } as React.CSSProperties}
      >
        {/* satellite dots */}
        {ORBITS.map((o, i) => (
          <OrbDot key={i} {...o} radius={size / 2 + 18 + (i % 2 === 0 ? 2 : -2)} />
        ))}

        {/* 3-D tilt wrapper — width/height via CSS var, MotionValues stay in style */}
        <motion.div
          ref={frameRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onHoverStart={() => setHovered(true)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer w-[var(--frame-sz)] h-[var(--frame-sz)] [perspective:800px] [transform-style:preserve-3d]"
          style={{
            '--frame-sz': `${size}px`,
            rotateX,
            rotateY,
          } as React.CSSProperties}
        >
          {/* outer maroon glow on hover */}
          <motion.div
            className="absolute -inset-4 z-[-1] rounded-full pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.9 }}
            transition={{ duration: 0.4 }}
            aria-hidden
          >
            <div className="w-full h-full rounded-full shadow-[0_0_55px_18px_rgba(139,0,0,0.38),0_0_100px_40px_rgba(139,0,0,0.14)]" />
          </motion.div>

          {/* rotating gradient ring (outer) */}
          <RotatingRing hovered={hovered} />

          {/* middle pulsing ring */}
          <motion.div
            className="absolute -inset-px rounded-full pointer-events-none z-[1] border-2 border-[#87CEEB]/[0.35]"
            animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.012, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* inner sharp ring */}
          <div className="absolute inset-0.5 rounded-full pointer-events-none z-[2] border border-white/[0.12]" />

          {/* image container */}
          <div className="absolute inset-1 z-[3] rounded-full overflow-hidden bg-[#0d1420]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Osman Amadu Jalloh"
                fill
                className="object-cover object-top"
                priority
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-serif text-white [font-size:var(--mono-sz)] bg-gradient-to-br from-[#1A3A8F] via-[#101624] to-[#8B0000]"
                style={{ '--mono-sz': `${size * 0.28}px` } as React.CSSProperties}
              >
                OAJ
              </div>
            )}
            {/* inner vignette */}
            <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]" />
          </div>
        </motion.div>
      </div>

      {/* status badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        className="mt-5 flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-sm"
      >
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-xs font-mono text-[#9CA3AF] tracking-wider">Open to opportunities</span>
      </motion.div>
    </motion.div>
  );
}
