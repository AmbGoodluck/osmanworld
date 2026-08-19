"use client";
import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import React from 'react';

const HeroCanvas = dynamic(() => import('../components/HeroCanvas'), { ssr: false, loading: () => null });

/* ─────────────────────── icon / style map ─────────────────────── */
const PLATFORM_META: Record<string, { accent: string; border: string; glow: string; icon: React.ReactNode }> = {
  'LinkedIn': {
    accent: '#87CEEB',
    border: 'hover:border-[#87CEEB]/50',
    glow:   'hover:shadow-[0_0_36px_rgba(135,206,235,0.18)]',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  'GitHub': {
    accent: '#9CA3AF',
    border: 'hover:border-white/30',
    glow:   'hover:shadow-[0_0_36px_rgba(255,255,255,0.07)]',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  'Twitter / X': {
    accent: '#9CA3AF',
    border: 'hover:border-white/30',
    glow:   'hover:shadow-[0_0_36px_rgba(255,255,255,0.07)]',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  'Instagram': {
    accent: '#8B0000',
    border: 'hover:border-[#8B0000]/50',
    glow:   'hover:shadow-[0_0_36px_rgba(139,0,0,0.18)]',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  'Email': {
    accent: '#8B0000',
    border: 'hover:border-[#8B0000]/50',
    glow:   'hover:shadow-[0_0_36px_rgba(139,0,0,0.18)]',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
  },
};

const DEFAULT_META = {
  accent: '#9CA3AF',
  border: 'hover:border-white/25',
  glow:   'hover:shadow-[0_0_36px_rgba(255,255,255,0.07)]',
  icon:   <span className="w-6 h-6 text-lg">✉</span>,
};

/* ─────────────────────── types ─────────────────────── */
export interface ContactData {
  email?: string;
  location?: string;
  responseTime?: string;
  openTo?: string;
  heroTagline?: string;
  socialLinks?: Array<{ platform: string; handle: string; url: string }>;
}

/* ─────────────────────── particles ─────────────────────── */
type Pt = { id: number; left: string; top: string; size: number; dur: number; delay: number; op: number };

function useParticles(n: number): Pt[] {
  const [pts, setPts] = useState<Pt[]>([]);
  useEffect(() => {
    setPts(Array.from({ length: n }, (_, i) => ({
      id: i,
      left:  `${(i * 7.3 + 3) % 97}%`,
      top:   `${(i * 13.1 + 7) % 95}%`,
      size:  1 + (i % 3),
      dur:   6 + (i % 8),
      delay: (i % 11) * 0.45,
      op:    0.08 + (i % 6) * 0.055,
    })));
  }, [n]);
  return pts;
}

/* ─────────────────────── field component ─────────────────────── */
function Field({
  tag, label, name, type = 'text', placeholder, value, onChange, required,
}: {
  tag: 'input' | 'textarea'; label: string; name: string; type?: string;
  placeholder: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const base =
    'w-full bg-white/5 border rounded-xl px-4 text-white placeholder-[#9CA3AF]/60 text-sm outline-none transition-all duration-300 ' +
    (focused ? 'border-[#8B0000] shadow-[0_0_0_3px_rgba(139,0,0,0.15)]' : 'border-white/10 hover:border-white/20');

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      <label className="block text-xs font-mono uppercase tracking-widest text-[#9CA3AF] mb-2">
        {label}{required && <span className="text-[#8B0000] ml-1">*</span>}
      </label>
      {tag === 'textarea' ? (
        <textarea
          name={name} rows={5} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          required={required} className={`${base} py-3 resize-none`}
        />
      ) : (
        <input
          type={type} name={name} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          required={required} className={`${base} h-12`}
        />
      )}
    </motion.div>
  );
}

/* ─────────────────────── main client component ─────────────────────── */
export default function ContactClient({ data }: { data: ContactData | null }) {
  const particles  = useParticles(38);
  const formRef    = useRef<HTMLFormElement>(null);
  const socialRef  = useRef<HTMLDivElement>(null);
  const socialInView = useInView(socialRef, { once: true, margin: '-80px' });

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errMsg,  setErrMsg]  = useState('');

  // Merge Sanity social links with local icon/style metadata
  const socials = data?.socialLinks && data.socialLinks.length > 0
    ? data.socialLinks.map((s) => ({
        ...s,
        href: s.platform === 'Email' ? `mailto:${s.url}` : s.url,
        ...(PLATFORM_META[s.platform] ?? DEFAULT_META),
      }))
    : [
        { platform: 'LinkedIn',    handle: 'Osman Amadu Jalloh', href: 'https://linkedin.com/in/osman-jalloh', ...PLATFORM_META['LinkedIn'] },
        { platform: 'GitHub',      handle: '@osman-jalloh',      href: 'https://github.com/osman-jalloh',     ...PLATFORM_META['GitHub']   },
        { platform: 'Twitter / X', handle: '@osmanjalloh_',      href: 'https://x.com/osmanjalloh_',          ...PLATFORM_META['Twitter / X'] },
        { platform: 'Instagram',   handle: '@osman.world',       href: 'https://instagram.com/osman.world',   ...PLATFORM_META['Instagram'] },
        { platform: 'Email',       handle: data?.email ?? 'osmanworld@email.com', href: `mailto:${data?.email ?? 'osmanworld@email.com'}`, ...PLATFORM_META['Email'] },
      ];

  const infoItems = [
    { label: 'Response time', value: data?.responseTime ?? 'Within 24 hours', color: '#87CEEB' },
    { label: 'Location',      value: data?.location      ?? 'Berea, KY · Remote',              color: '#9CA3AF' },
    { label: 'Open to',       value: data?.openTo        ?? 'Collabs · Internships · Projects', color: '#8B0000' },
  ];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? 'Failed to send.');
      setStatus('sent');
      setName(''); setEmail(''); setMessage('');
    } catch (err: any) {
      setStatus('error');
      setErrMsg(err.message ?? 'Something went wrong.');
    }
  }

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden pb-28">

      {/* ── Grid overlay ── */}
      <div className="contact-grid-overlay pointer-events-none fixed inset-0 z-[1] opacity-[0.03]" />

      {/* ── Particles ── */}
      <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
        {particles.map((p) => (
          <motion.div key={p.id} className="absolute rounded-full bg-white"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ opacity: [p.op, p.op * 3.5, p.op], y: [0, -20, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {[
          { l: '15%', t: '25%', c: '#87CEEB', s: 3, d: 9,  dl: 1.0 },
          { l: '82%', t: '18%', c: '#8B0000', s: 2, d: 7,  dl: 0.5 },
          { l: '90%', t: '70%', c: '#87CEEB', s: 2, d: 11, dl: 2.2 },
          { l: '8%',  t: '78%', c: '#8B0000', s: 3, d: 8,  dl: 0.9 },
          { l: '50%', t: '90%', c: '#1A3A8F', s: 4, d: 10, dl: 3.1 },
        ].map((p, i) => (
          <motion.div key={`a${i}`} className="absolute rounded-full"
            style={{ left: p.l, top: p.t, width: p.s, height: p.s, backgroundColor: p.c }}
            animate={{ opacity: [0.3, 0.9, 0.3], y: [0, -24, 0] }}
            transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center px-4 pt-24 pb-12">
        <div className="absolute inset-0 z-0 opacity-40">
          <HeroCanvas />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.28em' }}
            transition={{ duration: 1 }}
            className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.28em] mb-5"
          >
            Get in Touch
          </motion.p>

          <h1 className="font-serif leading-none text-white mb-6 select-none text-[clamp(3rem,9vw,6rem)] tracking-[0.04em]">
            Let&apos;s{' '}
            <span className="relative inline-block">
              Connect
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-[#8B0000]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'left' }}
              />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-[#9CA3AF] text-lg max-w-lg mx-auto leading-relaxed"
          >
            {data?.heroTagline ?? "Whether it's a project, collaboration, or just a conversation — the door is always open."}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mx-auto mt-8 h-px w-20 bg-gradient-to-r from-transparent via-[#8B0000] to-transparent"
            style={{ transformOrigin: 'center' }}
          />
        </motion.div>
      </section>

      {/* ═══════════ SOCIAL CARDS ═══════════ */}
      <section className="relative z-10 px-4 md:px-12 mb-20">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.28em] text-center mb-8"
          >
            Find me on
          </motion.p>

          <div ref={socialRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {socials.map((s, i) => (
              <motion.a
                key={s.platform}
                href={s.href}
                target={s.platform === 'Email' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 28 }}
                animate={socialInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.03 }}
                style={{ WebkitTapHighlightColor: 'transparent' }}
                className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl
                            bg-white/[0.04] border border-white/10 backdrop-blur-md
                            transition-colors duration-300 cursor-pointer ${s.border} ${s.glow}`}
              >
                <div className="transition-colors duration-300 [color:var(--accent)]"
                  style={{ '--accent': s.accent } as React.CSSProperties}>
                  {s.icon}
                </div>
                <p className="text-white text-sm font-semibold text-center leading-tight">{s.platform}</p>
                <p className="text-[#9CA3AF] text-xs text-center leading-tight line-clamp-1">{s.handle}</p>

                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
                  style={{ backgroundColor: s.accent, transformOrigin: 'left' }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="absolute top-3 right-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: s.accent }}
                >
                  ↗
                </motion.span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CONTACT FORM ═══════════ */}
      <section className="relative z-10 px-4 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* Left — info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.28em] mb-4">Direct Message</p>
              <h2 className="font-serif text-4xl text-white mb-5 leading-tight">Send a Message</h2>
              <p className="text-[#9CA3AF] leading-relaxed mb-8 text-sm">
                Have a project in mind? Want to collaborate on something meaningful?
                Or just want to say hello? Fill in the form and I&apos;ll get back to you within 24 hours.
              </p>
              {infoItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 [background-color:var(--dot)]"
                    style={{ '--dot': item.color } as React.CSSProperties} />
                  <p className="text-xs text-[#9CA3AF]">
                    <span className="text-white font-medium">{item.label}:</span>{' '}{item.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <form ref={formRef} onSubmit={handleSubmit}
              className="p-7 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col gap-5">
              <Field tag="input"    label="Name"    name="name"    placeholder="Your full name"
                value={name}    onChange={setName}    required />
              <Field tag="input"    label="Email"   name="email"   type="email" placeholder="your@email.com"
                value={email}   onChange={setEmail}   required />
              <Field tag="textarea" label="Message" name="message" placeholder="Tell me what's on your mind..."
                value={message} onChange={setMessage} required />

              <AnimatePresence mode="wait">
                {status === 'error' && (
                  <motion.p key="err"
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-[#ff6b6b] bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
                  >{errMsg}</motion.p>
                )}
                {status === 'sent' && (
                  <motion.p key="ok"
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-[#87CEEB] bg-[#87CEEB]/10 border border-[#87CEEB]/20 rounded-lg px-4 py-2"
                  >Message sent! I&apos;ll be in touch soon.</motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full h-12 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 overflow-hidden
                  ${status === 'sent'
                    ? 'bg-[#1A3A8F]/60 text-[#87CEEB] border border-[#87CEEB]/30 cursor-default'
                    : 'bg-[#8B0000] text-white hover:bg-[#a00000] hover:shadow-[0_0_28px_rgba(139,0,0,0.45)] cursor-pointer'
                  }`}
              >
                {status === 'idle' && (
                  <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ translateX: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === 'sending' ? (
                    <>
                      <motion.span
                        className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                      Sending…
                    </>
                  ) : status === 'sent' ? '✓ Message Sent' : <>Send Message <span aria-hidden>→</span></>}
                </span>
              </motion.button>

              <p className="text-center text-xs text-[#9CA3AF]">
                Your message goes directly to Osman — no middlemen.
              </p>
            </form>
          </motion.div>

        </div>
      </section>

    </main>
  );
}
