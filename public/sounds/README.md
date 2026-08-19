# Sound Files — Osman's World Portfolio

Place the following MP3 files in this directory. All sounds should be kept short, subtle, and premium.

## Required Files

| File | Duration | Volume hint | Character |
|------|----------|-------------|-----------|
| `laser.mp3` | ~2.5–3s | 0.30 | Sharp electronic whoosh matching the laser border sweep |
| `tech.mp3` | ~1–1.5s | 0.28 | Electronic activation / engine boot |
| `fashion.mp3` | ~0.8–1.2s | 0.25 | Soft fabric whoosh / silk rustle |
| `entrepreneurship.mp3` | ~0.8–1s | 0.28 | Ascending power-on / rising tone |
| `about.mp3` | ~1s | 0.22 | Warm ambient chime / soft pad |
| `academics.mp3` | ~0.6–0.8s | 0.25 | Clean crisp notification chime |
| `hover.mp3` | ~0.1–0.2s | 0.15 | Ultra-subtle tick / soft pop |
| `click.mp3` | ~0.15–0.25s | 0.25 | Satisfying premium click |

---

## Free Royalty-Free Sources

### Freesound.org — Specific Search Terms

**laser.mp3** — sci-fi border sweep
- https://freesound.org/search/?q=laser+whoosh+sci-fi
- https://freesound.org/search/?q=electronic+swoosh+long
- Search: `laser beam whoosh` — filter: <3s, CC0 license

**tech.mp3** — electronic activation
- https://freesound.org/search/?q=electronic+startup+hum
- https://freesound.org/search/?q=machine+boot+electronic
- Search: `tech activation sound` — filter: <2s, CC0

**fashion.mp3** — fabric/silk movement
- https://freesound.org/search/?q=fabric+whoosh+soft
- https://freesound.org/search/?q=silk+swoosh+gentle
- Search: `cloth swish` — filter: <1.5s, CC0

**entrepreneurship.mp3** — ascending power tone
- https://freesound.org/search/?q=ascending+tone+power
- https://freesound.org/search/?q=rising+chime+electronic
- Search: `power up ascending` — filter: <1.5s, CC0

**about.mp3** — warm ambient
- https://freesound.org/search/?q=soft+ambient+chime+warm
- https://freesound.org/search/?q=gentle+bell+soft
- Search: `warm notification` — filter: <1.5s, CC0

**academics.mp3** — clean chime
- https://freesound.org/search/?q=notification+chime+clean
- https://freesound.org/search/?q=ding+soft+bell
- Search: `clean ding notification` — filter: <1s, CC0

**hover.mp3** — micro tick
- https://freesound.org/search/?q=ui+tick+subtle
- https://freesound.org/search/?q=button+hover+soft+tick
- Search: `soft tick ui` — filter: <0.3s, CC0

**click.mp3** — premium click
- https://freesound.org/search/?q=button+click+satisfying
- https://freesound.org/search/?q=click+premium+clean
- Search: `click button clean` — filter: <0.3s, CC0

### Other Free Sources

- **Mixkit** (mixkit.co/free-sound-effects/) — free, no attribution required
  - Category: Technology → UI/App sounds
- **Pixabay** (pixabay.com/sound-effects/) — CC0, no account needed
- **ZapSplat** (zapsplat.com) — free with account, huge UI sound library

### Recommended Pixabay searches

- `ui whoosh electronic` → laser.mp3 candidate
- `soft click button` → click.mp3 / hover.mp3
- `gentle chime notification` → academics.mp3 / about.mp3

---

## After Downloading

1. Rename each file to match the table above exactly (lowercase, `.mp3`)
2. Drop all 8 files into this `/public/sounds/` folder
3. Sounds are loaded lazily on first play — no bundle impact

## Volume Reference

The `soundManager.ts` controls per-sound volumes (all ≤ 0.30). Users can toggle
mute via the speaker icon in the navbar; preference is saved to localStorage.
