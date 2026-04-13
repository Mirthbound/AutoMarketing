# AutoMarketing — Mirthbound Apps

Performance marketing workspace for **consumer iOS apps**: plan creative, draft copy/scripts in `content/drafts/`, approve assets, produce short-form video, schedule in **Buffer** (TikTok primary, Instagram Reels secondary), then log outcomes. This is **advertising**, not a public dev diary.

**Legal note:** Brand may appear as *Mirthbound Apps*; entity may be *Mirthbound Interactive, LLC*. Use the name that matches your storefront and contracts.

---

## End-to-end pipeline

| Stage | Owner | Output |
|--------|--------|--------|
| **Plan** | You + strategy docs | Themes, hooks, calendar slots (`content/calendar/`) |
| **Draft** | You + AI (Cursor) | Scripts/captions in `content/drafts/` using `templates/` |
| **Approve** | You | Move or copy approved work to `content/approved/` |
| **Produce** | You / creator | Screen recordings, VO, edits (original UI preferred) |
| **Schedule** | You | Buffer: TikTok + IG from approved assets (manual upload/scheduling unless you add automation later) |
| **Log** | You | Results in calendar or a simple log file—**no invented metrics** |

**Rules of the road:** AI produces **drafts only**. Nothing ships from `drafts/` without your review. No unsupervised auto-posting.

---

## Product priority

1. **GameTime** — Personal game OS on iOS (what to play, own, finish, how you’re doing); IGDB-backed catalog, Now/Home smart picks + randomizer, deep library tools, Discover, stats/Wrapped/badges, sync & backup where applicable (`docs/GAMETIME.md`).
2. **TuneScroll** — lyrics/chords, setlists, auto-scroll for musicians (follow-on; see `docs/TUNESCROLL.md`).

---

## Repo map

| Path | Purpose |
|------|---------|
| `docs/STRATEGY.md` | Positioning, pillars, TT vs IG, cadence, campaign outline |
| `docs/GAMETIME.md` | Allowed claims, hooks, video concepts, compliance cues |
| `docs/TUNESCROLL.md` | Coming-next stub + early hooks |
| `docs/BRAND_VOICE.md` | Tone, on-screen text, CTAs |
| `docs/COMPLIANCE.md` | App Store honesty, copyright, privacy |
| `docs/BUFFER_WORKFLOW.md` | Buffer + TikTok Business setup, batching, repurposing |
| `docs/BUFFER_AUTOMATION.md` | n8n → Buffer GraphQL API → queue/post (TikTok + IG); channel IDs |
| `docs/N8N_VISION.md` | n8n: auto drafts → you submit; phases, workflows, credentials |
| `docs/N8N_SETUP.md` | Step-by-step: OpenAI API key, n8n install, first workflow, Git wiring |
| `docs/N8N_LOCAL_START.md` | **Quick start:** Docker on Mac, Manual Trigger, Execute—no schedules |
| `templates/` | TikTok script + IG adaptation templates |
| `prompts/CURSOR_MARKETING_AGENT.md` | Standing agent charter for Cursor |
| `prompts/N8N_OPENAI_BUFFER.md` | n8n OpenAI system/user prompts (JSON → Buffer; image-led) |
| `config/urls.json` | Store links and handles (**placeholders** until verified) |
| `content/calendar/` | Monthly planning files |
| `content/drafts/` | All AI/raw drafts |
| `content/media/` | Images for posts; **`content/media/presets/`** = reusable backgrounds (host publicly for Buffer URLs) |
| `content/approved/` | Your approved copy/scripts |
| `content/published/` | Optional: what went live + dates (no fake numbers) |

---

## How I use Cursor here

Typical commands and habits:

- **Open this folder as the workspace** so `.cursor/rules/marketing.mdc` applies project-wide.
- **Draft a TikTok script:** ask the agent to follow `templates/TIKTOK_AD_SCRIPT.md` and `docs/GAMETIME.md`; save output under `content/drafts/` with a dated filename.
- **Batch hooks:** “Generate 5 hooks for GameTime backlog + IGDB discovery; include safe/legal minimal variant.”
- **Repurpose to Reels:** run the same idea through `templates/IG_REEL_ADAPTATION.md`.
- **Refresh placeholders:** edit `config/urls.json` when App Store IDs and social handles are final.
- **Review checklist:** every draft should pass the claims check in `prompts/CURSOR_MARKETING_AGENT.md` before moving to `content/approved/`.

Optional terminal habits (if you use git): `git status` before commits; keep `drafts/` out of anything customer-facing until approved.

---

## Quick links

- Strategy: [`docs/STRATEGY.md`](docs/STRATEGY.md)
- GameTime reference: [`docs/GAMETIME.md`](docs/GAMETIME.md)
- Agent charter: [`prompts/CURSOR_MARKETING_AGENT.md`](prompts/CURSOR_MARKETING_AGENT.md)
