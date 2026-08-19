/**
 * soundManager.ts — singleton audio manager for Osman's World portfolio.
 *
 * Client-only. Never imported on the server.
 * Howler is loaded dynamically to avoid SSR module evaluation errors.
 */

export type SoundName =
  | 'laser'
  | 'tech'
  | 'fashion'
  | 'entrepreneurship'
  | 'about'
  | 'academics'
  | 'hover'
  | 'click'
  | 'background';

const SOUND_CONFIG: Record<SoundName, { volume: number; loop?: boolean }> = {
  laser:            { volume: 0.30 },
  tech:             { volume: 0.28 },
  fashion:          { volume: 0.25 },
  entrepreneurship: { volume: 0.28 },
  about:            { volume: 0.22 },
  academics:        { volume: 0.25 },
  hover:            { volume: 0.15 },
  click:            { volume: 0.25 },
  background:       { volume: 0.20, loop: true },
};

class SoundManager {
  private sounds: Partial<Record<SoundName, any>> = {};
  private muted: boolean = false;
  private HowlClass: any = null;

  constructor() {
    try {
      this.muted = localStorage.getItem('osman-sound-muted') === 'true';
    } catch {
      this.muted = false;
    }
  }

  private async ensureHowl(): Promise<any> {
    if (!this.HowlClass) {
      try {
        const howler = await import('howler');
        this.HowlClass = howler.Howl;
        if (this.muted) howler.Howler.mute(true);
      } catch {
        return null;
      }
    }
    return this.HowlClass;
  }

  private async load(name: SoundName): Promise<any> {
    if (!this.sounds[name]) {
      const Howl = await this.ensureHowl();
      if (!Howl) return null;
      const cfg = SOUND_CONFIG[name];
      this.sounds[name] = new Howl({
        src: [`/sounds/${name}.mp3`],
        volume: cfg.volume,
        loop: cfg.loop ?? false,
        preload: true,
        onloaderror: () => {},
      });
    }
    return this.sounds[name];
  }

  play(name: SoundName): void {
    if (this.muted) return;
    this.load(name).then(sound => {
      try { sound?.play(); } catch {}
    });
  }

  startBackground(): void {
    if (this.muted) return;
    this.load('background').then(bg => {
      try { if (bg && !bg.playing()) bg.play(); } catch {}
    });
  }

  stopBackground(): void {
    try { this.sounds['background']?.stop(); } catch {}
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      localStorage.setItem('osman-sound-muted', String(muted));
      import('howler').then(({ Howler }) => Howler.mute(muted));
    } catch {}
  }

  isMuted(): boolean {
    return this.muted;
  }
}

let _instance: SoundManager | null = null;

export function getSoundManager(): SoundManager | null {
  if (typeof window === 'undefined') return null;
  if (!_instance) _instance = new SoundManager();
  return _instance;
}
