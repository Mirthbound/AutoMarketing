# App Store screenshot generator — wired into this repo

This workspace includes **[ParthJadhav/app-store-screenshots](https://github.com/ParthJadhav/app-store-screenshots)** as a **git submodule** at `**generators/app-store-screenshots/`** (skill source + docs). Use it with **Cursor** to scaffold a **Next.js** project that exports **framed, ad-style PNGs** for the App Store—and you can **reuse those same PNGs** for Buffer (host a public URL or upload manually). See also `**docs/SOCIAL_IMAGE_AUTOMATION.md`** (Approach A2).

---

## What lives where


| Path                                    | Purpose                                                                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `**generators/app-store-screenshots/`** | Upstream **skill** (MIT). Read `README.md` inside for install and prompts. Update with `**git submodule update --remote`**. |
| `**generators/screenshot-studio-*/**`    | **Per-app Next.js** screenshot apps (GameTime, TuneScroll, babyTalk). Each has its own `README.md`. **Not** the old single `screenshot-studio/` app (see pointer `generators/screenshot-studio/README.md`). |
| `**content/media/screenshots/<app>/`**  | **Raw** Simulator/device PNGs **inputs** (one folder per app). Symlinked into each generator as `public/screenshots`. See `content/media/screenshots/README.md`. |
| `**content/media/renders/<app>/`**      | **Exported** framed PNGs for Git hosting + Buffer raw URLs (or use another host). Use **per-app subfolders** (see below). |


---

### `content/media/renders/` — per-app folders (optional)

You can separate assets by product, for example:

- `content/media/renders/gametime/`
- `content/media/renders/tunescroll/`
- `content/media/renders/babyTalk/`

Nothing in the repo requires a flat `renders/` directory. **GitHub raw URLs** simply include the folder path, e.g. `.../content/media/renders/gametime/01-badges-en-1320x2868.png`. Use that full URL in Buffer or n8n.

---

## One-time: install the skill for Cursor

From **any** directory (or this repo root):

```bash
npx skills add ParthJadhav/app-store-screenshots
```

Global (optional):

```bash
npx skills add ParthJadhav/app-store-screenshots -g
```

If your agent supports adding from a **local path** after cloning the submodule:

```bash
npx skills add ./generators/app-store-screenshots
```

(Exact flag may vary—use `npx skills add --help` if needed.)

---

## Run the Next.js generator (in this monorepo)

**GameTime** (six slides; copy follows `**docs/GAMETIME.md`** — no fake metrics, no “350k” line):

```bash
cd generators/screenshot-studio-gametime
npm install
npm run dev
```

**TuneScroll** and **babyTalk** use **template** projects (two slides each out of the box). Edit `src/app/page.tsx` to add slides, themes, and filenames. Raw PNGs go in `content/media/screenshots/tunescroll/` and `content/media/screenshots/babyTalk/`.

```bash
cd generators/screenshot-studio-tunescroll   # or screenshot-studio-babyTalk
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Drop/replace PNGs under **`content/media/screenshots/<app>/`** (filenames must match `IMAGE_PATHS` in that app’s `page.tsx`). Replace **`public/app-icon.png`** in that generator folder with the app’s icon. Use **Export all PNGs**, then copy files to **`content/media/renders/<app>/`** (e.g. `gametime/`) or directly under **`content/media/renders/`** if you prefer a flat folder.

To **re-scaffold** from the upstream skill only, install the skill (`npx skills add …`) and let Cursor regenerate—or edit `src/app/page.tsx` in place.

---

## Feeding Buffer

1. **Public URL:** Push `content/media/renders/**/*.png` (including under per-app folders) to **this** GitHub repo (or another public bucket). Use **raw** URLs in Buffer’s API (`docs/BUFFER_AUTOMATION.md`).
2. **Manual:** Upload the same files in the Buffer composer—no URL needed.

**Claims:** GameTime on-image copy must still match `**docs/GAMETIME.md`**. Other apps: follow their own product-truth docs when you add them.

---

## Update the submodule (upstream skill changes)

```bash
git submodule update --remote generators/app-store-screenshots
git add generators/app-store-screenshots
git commit -m "Bump app-store-screenshots skill submodule"
```

---

## Clone this repo on another machine

```bash
git clone https://github.com/Mirthbound/AutoMarketing.git
cd AutoMarketing
git submodule update --init --recursive
```

---

## License

The submodule is **MIT** (see `generators/app-store-screenshots/LICENSE`). Your generated `screenshot-studio-*` code is yours; keep upstream notices if you copy skill files.
