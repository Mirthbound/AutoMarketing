# App Store screenshot generator — wired into this repo

This workspace includes **[ParthJadhav/app-store-screenshots](https://github.com/ParthJadhav/app-store-screenshots)** as a **git submodule** at `**generators/app-store-screenshots/`** (skill source + docs). Use it with **Cursor** to scaffold a **Next.js** project that exports **framed, ad-style PNGs** for the App Store—and you can **reuse those same PNGs** for Buffer (host a public URL or upload manually). See also `**docs/SOCIAL_IMAGE_AUTOMATION.md`** (Approach A2).

---

## What lives where


| Path                                    | Purpose                                                                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `**generators/app-store-screenshots/`** | Upstream **skill** (MIT). Read `README.md` inside for install and prompts. Update with `**git submodule update --remote`**. |
| `generators/screenshot-studio/`         | **Next.js screenshot app** (scaffolded). Run `npm run dev` inside; see `generators/screenshot-studio/README.md`.            |
| `**content/media/renders/`**            | Drop **exported PNGs** here for Git hosting + Buffer raw URLs (or use another host).                                        |


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

**Status:** `generators/screenshot-studio/` is a working **Next.js** + **html-to-image** app with **six** GameTime slides; copy follows `**docs/GAMETIME.md`** (no fake metrics, no “350k” line).

```bash
cd generators/screenshot-studio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Replace `**public/screenshots/*.png**` with real **6.1"** Simulator captures and `**public/app-icon.png`** with your icon. Use **Export all PNGs**, then copy files to `**content/media/renders/`**.

To **re-scaffold** from the upstream skill only, install the skill (`npx skills add …`) and let Cursor regenerate—or edit `src/app/page.tsx` in place.

---

## Feeding Buffer

1. **Public URL:** Push `content/media/renders/*.png` to **this** GitHub repo (or another public bucket). Use **raw** URLs in Buffer’s API (`docs/BUFFER_AUTOMATION.md`).
2. **Manual:** Upload the same files in the Buffer composer—no URL needed.

**Claims:** All on-image copy must still match `**docs/GAMETIME.md`**.

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

The submodule is **MIT** (see `generators/app-store-screenshots/LICENSE`). Your generated `screenshot-studio/` code is yours; keep upstream notices if you copy skill files.