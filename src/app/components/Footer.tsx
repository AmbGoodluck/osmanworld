"use client";
import Link from 'next/link';
import { motion, useInView, type Variants } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

/* ─────────────── default data (used when Sanity not configured) ─────────────── */
const DEFAULT_WORLDS = [
  { label: 'About',            href: '/about'            },
  { label: 'Academics',        href: '/academics'        },
  { label: 'Fashion',          href: '/fashion'          },
  { label: 'Tech',             href: '/tech'             },
  { label: 'Ventures',         href: '/entrepreneurship' },
];

const DEFAULT_CONNECT = [
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/osman-jalloh'  },
  { label: 'GitHub',    href: 'https://github.com/osman-jalloh'       },
  { label: 'Twitter',   href: 'https://x.com/osmanjalloh_'            },
  { label: 'Instagram', href: 'https://instagram.com/osman.world'     },
  { label: 'Email',     href: 'mailto:osmanworld@email.com'           },
];

const DEFAULT_LEGAL = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Use',   href: '#terms'   },
];

const DEFAULT_SOCIALS = [
  { platform: 'LinkedIn',  label: 'LinkedIn',  href: 'https://linkedin.com/in/osman-jalloh'  },
  { platform: 'GitHub',    label: 'GitHub',    href: 'https://github.com/osman-jalloh'       },
  { platform: 'Twitter',   label: 'Twitter',   href: 'https://x.com/osmanjalloh_'            },
  { platform: 'Instagram', label: 'Instagram', href: 'https://instagram.com/osman.world'     },
  { platform: 'Email',     label: 'Email',     href: 'mailto:osmanworld@email.com'           },
];

/* ─────────────── social icon map ─────────────── */
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  Twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  Email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
  ),
};

/* ─────────────── particles ─────────────── */
type Pt = { id: number; left: string; top: string; size: number; dur: number; delay: number; op: number };

function FooterParticles() {
  const [pts, setPts] = useState<Pt[]>([]);
  useEffect(() => {
    setPts(Array.from({ length: 22 }, (_, i) => ({
      id:    i,
      left:  `${(i * 11.3 + 5) % 96}%`,
      top:   `${(i * 17.7 + 3) % 92}%`,
      size:  1 + (i % 2),
      dur:   7 + (i % 7),
      delay: (i % 9) * 0.5,
      op:    0.07 + (i % 5) * 0.04,
    })));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ opacity: [p.op, p.op * 3.5, p.op], y: [0, -14, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {[
        { l: '8%',  t: '30%', c: '#87CEEB', s: 2, d: 9,  dl: 1.0 },
        { l: '92%', t: '25%', c: '#8B0000', s: 2, d: 7,  dl: 0.5 },
        { l: '50%', t: '15%', c: '#1A3A8F', s: 3, d: 10, dl: 2.0 },
        { l: '75%', t: '65%', c: '#8B0000', s: 2, d: 8,  dl: 0.8 },
        { l: '20%', t: '70%', c: '#87CEEB', s: 2, d: 11, dl: 3.0 },
      ].map((p, i) => (
        <motion.div key={`a${i}`} className="absolute rounded-full"
          style={{ left: p.l, top: p.t, width: p.s, height: p.s, backgroundColor: p.c }}
          animate={{ opacity: [0.25, 0.75, 0.25], y: [0, -18, 0] }}
          transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function ColHead({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#9CA3AF] mb-5">{children}</p>
  );
}

function FLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const cls = 'block text-sm text-[#9CA3AF] hover:text-white transition-colors duration-200 mb-2.5 group w-fit';
  const inner = (
    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">{label}</span>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

/* ─────────────── types ─────────────── */
interface SiteSettings {
  siteName?: string;
  siteNameAccent?: string;
  brandDescription?: string;
  copyrightName?: string;
  openToWorkText?: string;
  footerWorlds?: { label: string; href: string }[];
  footerConnect?: { label: string; href: string }[];
  footerLegal?: { label: string; href: string }[];
  socialLinks?: { platform: string; label: string; href: string }[];
}

/* ─────────────── main component ─────────────── */
export default function Footer({ siteSettings }: { siteSettings?: SiteSettings | null }) {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const siteName      = siteSettings?.siteName       ?? "OSMAN'S WORLD";
  const accentWord    = siteSettings?.siteNameAccent ?? 'WORLD';
  const brandDesc     = siteSettings?.brandDescription ?? 'Building at the intersection of tech, fashion and entrepreneurship.';
  const copyrightName = siteSettings?.copyrightName  ?? 'Osman Amadu Jalloh';
  const openToWork    = siteSettings?.openToWorkText ?? 'Open to work';

  const worlds  = siteSettings?.footerWorlds?.length  ? siteSettings.footerWorlds  : DEFAULT_WORLDS;
  const connect = siteSettings?.footerConnect?.length ? siteSettings.footerConnect : DEFAULT_CONNECT;
  const legal   = siteSettings?.footerLegal?.length   ? siteSettings.footerLegal   : DEFAULT_LEGAL;
  const socials = siteSettings?.socialLinks?.length   ? siteSettings.socialLinks   : DEFAULT_SOCIALS;

  // Split site name for maroon accent word
  const accentIdx    = siteName.indexOf(accentWord);
  const beforeAccent = accentIdx > -1 ? siteName.slice(0, accentIdx) : siteName;
  const afterAccent  = accentIdx > -1 ? siteName.slice(accentIdx + accentWord.length) : '';

  const container: Variants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } },
  };

  return (
    <footer ref={ref} className="relative z-10 mt-24 overflow-hidden">

      <motion.div
        className="h-px w-full bg-gradient-to-r from-transparent via-[#8B0000] to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'center' }}
      />

      <div className="relative bg-[#0a0f1a] border-t border-white/[0.04]">
        <FooterParticles />

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Brand column */}
          <motion.div variants={item} className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4 group">
              <span
                className="font-serif text-xl tracking-widest text-white group-hover:text-[#87CEEB] transition-colors duration-200"
                style={{ letterSpacing: '0.18em' }}
              >
                {beforeAccent}
                {accentIdx > -1 && <span className="text-[#8B0000]">{accentWord}</span>}
                {afterAccent}
              </span>
            </Link>
            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-[220px]">{brandDesc}</p>
            <div className="mt-6 h-px w-12 bg-gradient-to-r from-[#8B0000] to-transparent" />
          </motion.div>

          {/* Worlds */}
          <motion.div variants={item}>
            <ColHead>Worlds</ColHead>
            {worlds.map((l) => <FLink key={l.href} label={l.label} href={l.href} />)}
          </motion.div>

          {/* Connect */}
          <motion.div variants={item}>
            <ColHead>Connect</ColHead>
            {connect.map((l) => <FLink key={l.href} label={l.label} href={l.href} external />)}
          </motion.div>

          {/* Legal + CTA */}
          <motion.div variants={item}>
            <ColHead>Legal</ColHead>
            {legal.map((l) => <FLink key={l.href} label={l.label} href={l.href} />)}

            <div className="mt-8">
              <ColHead>Say Hello</ColHead>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border border-[#8B0000]/50 text-[#9CA3AF] hover:text-white hover:border-[#8B0000] hover:bg-[#8B0000]/10 transition-all duration-200"
              >
                {openToWork} ·<span className="text-[#8B0000]">Contact →</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative z-10 border-t border-white/[0.06]"
        >
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-5">

            <p className="text-xs text-[#9CA3AF] text-center md:text-left">
              © {new Date().getFullYear()} {copyrightName}. All rights reserved.
            </p>

            {/* Social icons row */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.platform}
                  href={s.href}
                  target={s.platform === 'Email' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-[#9CA3AF] hover:text-white hover:bg-[#8B0000]/20 hover:border-[#8B0000]/40 transition-all duration-200"
                  whileHover={{ scale: 1.15, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                  {SOCIAL_ICONS[s.platform] ?? (
                    <span className="text-xs font-mono">{s.platform[0]}</span>
                  )}
                </motion.a>
              ))}
            </div>

            <p className="text-xs text-[#9CA3AF]/60 text-center md:text-right">
              Built with <span className="text-[#8B0000]">passion</span> · {siteName} {new Date().getFullYear()}
            </p>
          </div>
        </motion.div>
      </div>

    </footer>
  );
}
