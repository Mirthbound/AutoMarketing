# App Store screenshot generator — wired into this repo

This workspace includes **[ParthJadhav/app-store-screenshots](https://github.com/ParthJadhav/app-store-screenshots)** as a **git submodule** at **`generators/app-store-screenshots/`** (skill source + docs). Use it with **Cursor** to scaffold a **Next.js** project that exports **framed, ad-style PNGs** for the App Store—and you can **reuse those same PNGs** for Buffer (host a public URL or upload manually). See also **`docs/SOCIAL_IMAGE_AUTOMATION.md`** (Approach A2).

---

## What lives where

| Path | Purpose |
|------|---------|
| **`generators/app-store-screenshots/`** | Upstream **skill** (MIT). Read `README.md` inside for install and prompts. Update with **`git submodule update --remote`**. |
| **`generators/screenshot-studio/`** | **Your** generated Next.js app should live **here** (create when you scaffold—see below). Not committed until you add files—keeps the marketing repo clean until you’re ready. |
| **`content/media/renders/`** | Drop **exported PNGs** here for Git hosting + Buffer raw URLs (or use another host). |

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

## Scaffold the Next.js generator (in this monorepo)

1. In Cursor, open the **AutoMarketing** folder (this repo).
2. Ask the agent something like:  
   **“Build App Store screenshots for GameTime using the app-store-screenshots skill. Scaffold the Next.js project under `generators/screenshot-studio/`. Align copy with `docs/GAMETIME.md` allowed claims.”**
3. If the skill prefers an **empty** folder, create it first:

```bash
mkdir -p generators/screenshot-studio
```

4. Add **`app-icon.png`**, **`public/screenshots/`** captures (6.1" Simulator per upstream README), then run the dev server from **`generators/screenshot-studio/`** as the skill instructs (`npm run dev` / `pnpm dev`).

5. **Export PNGs** from the browser UI, then copy into **`content/media/renders/`** (and commit when happy).

---

## Feeding Buffer

1. **Public URL:** Push `content/media/renders/*.png` to **this** GitHub repo (or another public bucket). Use **raw** URLs in Buffer’s API (`docs/BUFFER_AUTOMATION.md`).
2. **Manual:** Upload the same files in the Buffer composer—no URL needed.

**Claims:** All on-image copy must still match **`docs/GAMETIME.md`**.

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
