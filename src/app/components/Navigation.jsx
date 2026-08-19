"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSoundManager } from '../utils/soundManager';

const DEFAULT_TABS = [
  { name: 'About',            href: '/about',            sound: 'about'            },
  { name: 'Academics',        href: '/academics',        sound: 'academics'        },
  { name: 'Fashion',          href: '/fashion',          sound: 'fashion'          },
  { name: 'Tech',             href: '/tech',             sound: 'tech'             },
  { name: 'Entrepreneurship', href: '/entrepreneurship', sound: 'entrepreneurship' },
  { name: 'Experience',       href: '/experience',       sound: 'tech'             },
  { name: 'Contact',          href: '/contact',          sound: 'click'            },
];

/**
 * Navigation
 * Props:
 *   siteSettings?: { siteName?, siteNameAccent?, navTabs? }
 */
export default function Navigation({ siteSettings }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  const tabs      = siteSettings?.navTabs?.length ? siteSettings.navTabs : DEFAULT_TABS;
  const siteName  = siteSettings?.siteName        ?? "OSMAN'S WORLD";
  const accentWord = siteSettings?.siteNameAccent ?? 'WORLD';

  const accentIdx    = siteName.indexOf(accentWord);
  const beforeAccent = accentIdx > -1 ? siteName.slice(0, accentIdx) : siteName;
  const afterAccent  = accentIdx > -1 ? siteName.slice(accentIdx + accentWord.length) : '';

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 12); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sm = getSoundManager();
    if (sm) setSoundMuted(sm.isMuted());
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  function handleNavClick(sound) {
    getSoundManager()?.play(sound);
  }

  function toggleSound() {
    const sm = getSoundManager();
    if (!sm) return;
    const next = !soundMuted;
    sm.setMuted(next);
    setSoundMuted(next);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0b1120]/80 backdrop-blur-xl shadow-[0_4px_32px_rgba(0,0,0,0.45)]' : 'bg-[#0b1120]/60 backdrop-blur-md'}`}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">

        {/* Wordmark */}
        <Link
          href="/"
          className="font-serif text-xl tracking-widest text-white hover:text-[#87CEEB] transition-colors duration-200 select-none"
          style={{ letterSpacing: '0.18em' }}
          onClick={() => handleNavClick('click')}
        >
          {beforeAccent}
          {accentIdx > -1 && <span className="text-[#8B0000]">{accentWord}</span>}
          {afterAccent}
        </Link>

        {/* Desktop nav + sound toggle */}
        <div className="hidden md:flex items-center gap-1">
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => handleNavClick(tab.sound)}
                  className={`relative px-3 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-sm group ${active ? 'text-white' : 'text-[#9CA3AF] hover:text-white'}`}
                >
                  {tab.name}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-[#8B0000] transition-all duration-300 ${active ? 'w-4/5 opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-40'}`} />
                  <span className={`absolute inset-0 rounded-sm bg-[#1A3A8F] transition-opacity duration-200 -z-10 ${active ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'}`} />
                </Link>
              );
            })}
          </nav>
          <SoundToggle muted={soundMuted} onToggle={toggleSound} size={16} className="ml-2" />
        </div>

        {/* Mobile: sound toggle + hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <SoundToggle muted={soundMuted} onToggle={toggleSound} size={15} className="" />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex flex-col justify-center items-center w-10 h-10 gap-[5px] focus:outline-none"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${menuOpen ? 'w-6 translate-y-[7px] rotate-45' : 'w-6'}`} />
            <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${menuOpen ? 'w-0 opacity-0' : 'w-5'}`} />
            <span className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${menuOpen ? 'w-6 -translate-y-[7px] -rotate-45' : 'w-6'}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ borderTop: menuOpen ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
      >
        <nav className="flex flex-col px-5 py-3 gap-1 bg-[#0b1120]/95 backdrop-blur-xl">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => handleNavClick(tab.sound)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium tracking-wide transition-all duration-150 ${active ? 'text-white bg-[#1A3A8F]/30 border-l-2 border-[#8B0000]' : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200 ${active ? 'bg-[#8B0000]' : 'bg-transparent'}`} />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function SoundToggle({ muted, onToggle, size, className }) {
  return (
    <button
      onClick={onToggle}
      className={`w-8 h-8 flex items-center justify-center rounded-full text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-all duration-200 ${className}`}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      title={muted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {muted ? (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
