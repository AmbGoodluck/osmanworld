"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * Editorial masonry grid — fashion magazine spread aesthetic.
 * Props:
 *   images: Array<{ src?: string, alt?: string, label?: string, span?: string }>
 *   If src is empty a dark gradient placeholder is shown.
 */

// Default placeholder layout — 8 slots with different grid spans
const DEFAULT_IMAGES = [
  { label: 'Cover Story',       span: 'col-span-2 row-span-2', aspect: 'aspect-[3/4]'  },
  { label: 'Editorial I',       span: 'col-span-1 row-span-1', aspect: 'aspect-square'  },
  { label: 'Editorial II',      span: 'col-span-1 row-span-1', aspect: 'aspect-square'  },
  { label: 'Street',            span: 'col-span-1 row-span-2', aspect: 'aspect-[3/5]'   },
  { label: 'Lookbook',          span: 'col-span-2 row-span-1', aspect: 'aspect-[16/7]'  },
  { label: 'Portrait',          span: 'col-span-1 row-span-2', aspect: 'aspect-[3/5]'   },
  { label: 'Detail',            span: 'col-span-1 row-span-1', aspect: 'aspect-square'  },
  { label: 'Campaign',          span: 'col-span-2 row-span-1', aspect: 'aspect-[16/7]'  },
];

// Subtle gradient per slot so empty grid still looks editorial
const PLACEHOLDER_GRADIENTS = [
  'from-[#1A3A8F]/50 to-[#101624]',
  'from-[#8B0000]/40 to-[#101624]',
  'from-[#1A3A8F]/30 via-[#8B0000]/20 to-[#101624]',
  'from-[#101624] to-[#1A3A8F]/40',
  'from-[#8B0000]/30 to-[#101624]',
  'from-[#1A3A8F]/40 to-[#8B0000]/30',
  'from-[#101624] to-[#8B0000]/40',
  'from-[#1A3A8F]/20 to-[#101624]',
];

export default function FashionGrid({ images = [] }) {
  // Merge provided images with defaults
  const slots = DEFAULT_IMAGES.map((def, i) => ({ ...def, ...(images[i] ?? {}) }));

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 mt-14">
      {/* Section label */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#8B0000]/50 to-transparent" />
        <p className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.22em]">Editorial</p>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#8B0000]/50 to-transparent" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3">
        {slots.map((slot, i) => (
          <GridCell key={i} slot={slot} gradient={PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length]} />
        ))}
      </div>
    </section>
  );
}

function GridCell({ slot, gradient }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg cursor-pointer ${slot.span}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()   => setHovered(false)}
      style={{
        boxShadow: hovered
          ? '0 0 0 1.5px #8B0000, 0 8px 32px rgba(139,0,0,0.25)'
          : '0 4px 20px rgba(0,0,0,0.5)',
        transition: 'box-shadow 0.35s ease',
      }}
    >
      {slot.src ? (
        <>
          <Image
            src={slot.src}
            alt={slot.alt ?? slot.label ?? ''}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
            style={{
              transform:  hovered ? 'scale(1.07)' : 'scale(1.0)',
              filter:     hovered ? 'brightness(1.1)' : 'brightness(0.85)',
              transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.4s ease',
            }}
          />
        </>
      ) : (
        /* Placeholder */
        <div className={`w-full h-full bg-gradient-to-br ${gradient} transition-all duration-500`}
          style={{ filter: hovered ? 'brightness(1.2)' : 'brightness(1)' }}>
          {/* Subtle grid texture overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.08) 39px,rgba(255,255,255,0.08) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.08) 39px,rgba(255,255,255,0.08) 40px)',
            }}
          />
        </div>
      )}

      {/* Bottom vignette always present */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(16,22,36,0.75) 0%, transparent 55%)' }}
      />

      {/* Label */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: 0.22 }}
      >
        <span className="text-white text-xs font-medium tracking-widest uppercase">
          {slot.label}
        </span>
      </motion.div>

      {/* Maroon top accent */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-[#8B0000]"
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.div>
  );
}
