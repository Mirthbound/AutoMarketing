# TuneScroll screenshot studio

Template **Next.js** App Store frame generator. **Edit** `src/app/page.tsx` (`SLIDES`, `SLIDE_THEMES`, `IMAGE_PATHS`) as you add real slides.

**Raw captures:** `content/media/screenshots/tunescroll/` (symlinked as `public/screenshots`). Filenames must match `IMAGE_PATHS` / `SLIDES` in `src/app/page.tsx` (currently `intro.png`, `feed.png`, `liked.png`, `saved.png`).

**App icon:** `public/app-icon.png` (swap for TuneScroll’s icon).

## Run

```bash
cd generators/screenshot-studio-tunescroll
npm install
npm run dev
```

Exports → copy finals to **`../../content/media/renders/tunescroll/`** for Buffer / raw URLs.
