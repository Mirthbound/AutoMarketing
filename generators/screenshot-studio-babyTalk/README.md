# babyTalk screenshot studio

Template **Next.js** App Store frame generator. **Edit** `src/app/page.tsx` (`SLIDES`, `SLIDE_THEMES`, `IMAGE_PATHS`) as you add real slides.

**Raw captures:** `content/media/screenshots/babyTalk/` (symlinked as `public/screenshots`). Filenames must match `IMAGE_PATHS` / `SLIDES` in `src/app/page.tsx` (currently `home.png`, `journal.png`, `learn.png`, `milestone_details.png`, `milestones.png`).

**App icon:** `public/app-icon.png` (swap for babyTalk’s icon).

## Run

```bash
cd generators/screenshot-studio-babyTalk
npm install
npm run dev
```

Exports → copy finals to **`../../content/media/renders/babyTalk/`** for Buffer / raw URLs.
