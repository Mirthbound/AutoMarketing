# Automating marketing-ready images from iOS screenshots

**Goal:** Start from **real app screenshots** (truthful UI), add **framing, headline, brand, device chrome** so posts look intentional on TikTok/Instagram—not a raw Simulator grab.

**Principle:** Keep **pixels from your app** accurate. Automate **layout around** them (gradients, bezels, captions), not redrawing the UI in an LLM (which can hallucinate screens).

---

## What “social ready” usually means

| Layer | Automated? | Notes |
|-------|------------|--------|
| **Real screenshot** | You export (Simulator, device, Fastlane snapshot) | Source of truth for `docs/COMPLIANCE.md` |
| **Device frame** | Yes (template) | iPhone bezel + shadow—stock assets or template libs |
| **Background / gradient** | Yes | Brand colors, safe area |
| **Headline / hook text** | Yes | From OpenAI or static copy—**rendered into the image** if you want text *on* the creative, not only in Buffer caption |
| **Logo / watermark** | Yes | Small “GameTime” wordmark |
| **Safe margins** | Yes | So IG/TikTok UI doesn’t crop critical text |

---

## Approach A — Template APIs (fastest path to quality)

Services merge **your screenshot URL or file** + **text variables** into a designed template → return **PNG/JPG URL**.

| Tool | Idea |
|------|------|
| **Placid** / **Bannerbear** / **Creatomate** / **Apitemplate** | Define a template once (Figma-like or web editor); API: `screenshot_url`, `headline`, `accent_color` → PNG. |
| **Cloudinary** | Image transformations + **overlays**; you upload screenshot, add text overlay via URL parameters or eager transforms—more DIY, very automatable. |

**n8n flow:** Screenshot in Drive/S3 → **HTTP Request** to template API with merge fields → **public URL** → Buffer `assets.images[].url`.

**Pros:** On-brand, repeatable, no maintaining Canvas code. **Cons:** Subscription cost.

---

## Approach A2 — [app-store-screenshots](https://github.com/ParthJadhav/app-store-screenshots) (Cursor / agent skill + Next.js)

**Repo integration:** This AutoMarketing workspace vendors the skill as a **git submodule** and documents the full flow in **`docs/APP_STORE_SCREENSHOTS.md`** (`generators/app-store-screenshots/`, per-app apps under `generators/screenshot-studio-gametime/` etc.).

**What it is:** An installable **skill** for Cursor (and similar agents) that scaffolds a **Next.js** app: **advertisement-style** slides (not raw UI docs), **Tailwind**, **`html-to-image` PNG export**, built-in **`mockup.png`** iPhone frame, and **Apple App Store export sizes** (6.9" / 6.5" / 6.3" / 6.1"). See the repo README for `npx skills add ParthJadhav/app-store-screenshots`.

**Best for**

- **App Store Connect**-sized marketing frames and **multi-locale** / **theme preset** workflows.
- When you want **Cursor to iterate the design** (layout, copy, colors) in a **real preview** before exporting.

**Gaps vs TikTok/Reels + Buffer**

- Default output is **App Store dimensions**, not necessarily **1080×1920 Reels**—you can **extend** the generated `page.tsx` with another “social” preset size, or **crop/letterbox** exports in a second step.
- **Automation:** Out of the box it’s **dev server + click to export** per slide. **Headless** batch (Playwright opening `localhost`) is possible but extra work—not a single n8n HTTP call like Placid.

**How to leverage it alongside this repo**

| Step | Action |
|------|--------|
| 1 | Install the skill (`npx skills add …`) in your **app repo** or a **sibling project** (not required to live inside AutoMarketing). |
| 2 | Drop **real Simulator captures** under `public/screenshots/` as the skill expects; use the **6.1"** simulator note from their README to reduce rescaling pain. |
| 3 | Prompt for **GameTime** brand, themes, and slide count—align copy with `docs/GAMETIME.md` **allowed claims**. |
| 4 | Export PNGs from the browser → copy into **`content/media/renders/`** (or push to GitHub for **public raw URLs** → Buffer). |
| 5 | Optional: reuse their **`mockup.png`** idea or asset pattern with your **sharp** pipeline (`content/media/frames/`). |

**When to prefer this over sharp alone:** You want **designed slides** and fast **visual iteration** without writing compositor code first. **When to add sharp/Placid:** You need **fully unattended** renders from n8n with no browser.

---

## Approach B — Your own render script (full control, one-time dev cost)

Small **Node** or **Python** script (run locally, in CI, or via n8n **Execute Command** if allowed):

- **Input:** path to PNG + JSON (`headline`, `subhead`, `theme`).
- **Libraries:** **sharp** (Node) or **Pillow** (Python) to composite layers: background → rounded rect mask for screenshot → device frame PNG → text with a font file.
- **Output:** `content/media/renders/2026-04-15-gametime.png` → push to GitHub for raw URL or upload to S3.

**Pros:** No per-render SaaS fee at scale; git-versioned fonts/layout constants. **Cons:** You maintain layout code.

### What is a “sharp script”?

**[sharp](https://sharp.pixelplumbing.com/)** is a popular **Node.js** library for image work: resize, crop, composite layers, PNG/JPEG/WebP output. A “sharp script” here means a **small program** (e.g. `scripts/render-social-card.mjs`) that you run with `node` (or that n8n triggers). It reads your **iOS screenshot** plus **parameters** (headline, colors) and writes **one output PNG** ready to upload.

You customize looks by **changing code + assets**, not by clicking a SaaS template (unless you later wrap the same logic).

### How you customize what it looks like

| Lever | What you change |
|--------|------------------|
| **Canvas size** | Constants (e.g. 1080×1920 for stories). |
| **Background** | Flat color in code, or `sharp` reads a **PNG/JPG** from `content/media/presets/`. |
| **Screenshot position & size** | Numbers: `top`, `left`, `width`, `height` — often with a **rounded-rectangle mask** so the shot isn’t a harsh square. |
| **Device frame** | Optional fourth layer: transparent **PNG bezel** on top of the screenshot (asset file you drop in the repo). |
| **Text** | `sharp` doesn’t draw text by itself—you either: use **`@napi-rs/canvas`** / **node-canvas** / **svg** template rendered to PNG for headlines, or pre-render text in SVG and composite with `sharp`. Simpler shortcut: **only** composite image layers in `sharp` and bake headline in a tiny **SVG** string with your font, then `sharp` converts SVG → raster and composites. |
| **Fonts** | `.ttf` / `.otf` checked into repo (e.g. `assets/fonts/`) so renders are reproducible. |
| **Brand** | Hex colors and spacing in one **`config.json`** or exported from your design tokens. |

**Workflow:** Edit numbers/assets → run script → open output PNG. When it looks right, lock values in git.

### Minimal shape (illustrative only)

Conceptually the script does: **create solid background** → **resize screenshot** → **composite screenshot** at `(x,y)` → **composite frame PNG** → **write** `out.png`. Text overlay is the extra step (SVG/canvas or separate library).

```js
// Illustrative — not a complete text renderer; shows compositing idea.
import sharp from "sharp";

const W = 1080, H = 1920;
const bg = await sharp({ create: { width: W, height: H, channels: 3, background: { r: 18, g: 18, b: 22 } } })
  .png()
  .toBuffer();

const shot = await sharp("input/screenshot.png").resize(900).toBuffer();

await sharp(bg)
  .composite([{ input: shot, top: 420, left: 90 }])
  .toFile("out/render.png");
```

Real social cards usually add **rounded corners** (`roundedCorners` / mask), **shadow**, and a **headline** via SVG or canvas—same idea: more `composite()` steps or one merged buffer.

### Where to get a device frame (bezel) PNG

For `sharp`, the “frame” is just a **raster image**—usually a **transparent PNG** with the phone hardware (bezel, notch/Dynamic Island) drawn around a **clear or cut-out screen area** where your screenshot shows through. You composite **screenshot first**, then **frame on top** (or use a mask—depends on the asset).

| Source | Notes |
|--------|--------|
| **[Apple Design Resources](https://developer.apple.com/design/resources/)** | Official marketing/device artwork packs (often for Keynote/Sketch/Figma). **Read Apple’s license** for each asset—commercial use has rules; good for on-brand bezels. |
| **Figma / FigJam community** | Search “iPhone 15 / 16 frame” — many free components; **export** the frame layer as **PNG @2x/@3x** with transparency. Check license on each file. |
| **Mockup / device shot sites** | e.g. **Mockuuups**, **Rotato**, **Shots**, **Screely** — export still PNG; some are paid. Pick one that allows **static** marketing use. |
| **Stock / Creative Market / Gumroad** | Paid packs of device PNGs; clear licensing for ads. |
| **Make your own** | In **Figma**: rounded rectangle + stroke + inner shadow → **export** 2×–3× PNG. Less photoreal but **zero license risk** if you draw it simply. |

**Practical tips**

- Save frames in-repo, e.g. **`content/media/frames/iphone-16-pro-portrait@3x.png`**, and reference that path in your script.
- **Match aspect** to your Simulator capture (same device generation if possible) so the screenshot lines up under the frame’s “screen hole.”
- If the asset uses a **solid black screen rectangle** instead of alpha, you may need to **mask** the screenshot into the screen region instead of layering on top—depends on the file.

### How you edit the “template” in a sharp setup

There is **no** separate hosted template like Placid. The “template” is **whatever you put in git**—usually split like this:

| Piece | What you edit | Typical path (example) |
|--------|----------------|--------------------------|
| **Layout numbers** | Canvas size, margins, screenshot `top`/`left`/`width`, layer order | **`config/social-card.json`** or constants at top of one `.mjs` file |
| **Compositing logic** | Rounded mask, shadow, which image is on top | **`scripts/render-social-card.mjs`** (the `composite([...])` list) |
| **Headline / text block** | Wording comes from CLI/JSON; **look** (font size, line wrap, position) | **SVG string** in the script, or **`templates/social-headline.svg`** with `{{headline}}` replaced before `sharp` renders it to a buffer |
| **Colors & fonts** | Hex values, path to `.ttf` | Config JSON or env; fonts in **`content/media/fonts/`** or **`assets/fonts/`** |
| **Background & frame** | Swap files | **`content/media/presets/`**, **`content/media/frames/`** — keep filenames stable so the script doesn’t need edits |

**Edit loop:** change JSON/SVG/script → run `node scripts/render-social-card.mjs` (with your args) → open the output PNG → repeat until it matches your taste → **commit**. That commit *is* your template version.

**Tip:** Keep **all tunable numbers** in one **config file** so “template tweaks” are mostly JSON edits; reserve the script for structure (e.g. “draw three layers in this order”).

---

## Approach C — Design tool + batch

- **Figma** with components + **Figma API** or plugins to export frames (heavier setup).
- **Shortcuts** (macOS) or **Fastlane** + shell to drop latest screenshots into a watched folder that triggers a script.

Good when designers own the template and engineering only supplies assets.

---

## Approach D — AI image models (use carefully)

- **DALL·E / Midjourney / Flux:** Great for **abstract backgrounds** or **mood**, poor at **exact** UI fidelity.
- **Safe pattern:** Generate **background only** → composite **real screenshot** on top in **sharp**/template tool. Avoid “redraw my whole app screen” prompts.

---

## Suggested stack for Mirthbound (pragmatic)

1. **Export screenshots** on a schedule or release: Simulator, or **fastlane snapshot** into `content/media/screenshots/` (raw).
2. **Copy hook** from same pipeline as captions (`prompts/N8N_OPENAI_BUFFER.md`) or a **Set** node field `headline`.
3. **Render:**
   - **v1:** Template API (Placid/Bannerbear) with 2–3 branded templates (Now tab, Library, Discover).
   - **v2:** Replace with **sharp** script if volume/cost justifies it.
4. **Host** output → public HTTPS URL (`docs/BUFFER_AUTOMATION.md`).
5. **Buffer** gets `text` + `image` URL.

---

## n8n wiring (conceptual)

```
Manual Trigger
  → Set (screenshot_url, headline, template_id)
  → HTTP Request (template API render) OR Execute Command (node script)
  → Set (public_image_url)
  → HTTP Request (Buffer createPost)
```

---

## Checklist

- [ ] Screenshot is **real app UI**, demo data if needed (`docs/COMPLIANCE.md`).
- [ ] Text on image doesn’t contradict App Store claims (`docs/GAMETIME.md`).
- [ ] Export **1080×1920** or per-platform safe sizes; test crop on IG/TikTok preview.

---

## Related

- `docs/BUFFER_AUTOMATION.md` — posting the final URL  
- `content/media/presets/` — static backgrounds if you composite manually first  
- `prompts/N8N_OPENAI_BUFFER.md` — `image_direction` / headline for the render step
