# Buffer Workflow — TikTok + Instagram

**Automation (n8n → Buffer API → queue):** See **`docs/BUFFER_AUTOMATION.md`** for GraphQL, `channelId`, and image URLs.

**Assumption:** You **manually** upload or schedule from **approved** assets unless/until you add automation. Buffer features change—**always confirm steps in Buffer’s current help center** for TikTok Business and Instagram.

---

## 1) Connect accounts

1. Log into Buffer (web).
2. Connect **Instagram** as a **Business** account linked to a **Facebook Page** (Meta’s requirement for most scheduling APIs).
3. Connect **TikTok** via Buffer’s TikTok integration. If prompted for **TikTok Business** / creator tools, follow Buffer’s wizard—requirements vary by region and account type.

**Placeholder action:** When IDs are ready, add handles to `config/urls.json`.

---

## 2) TikTok Business / creator requirements (high level)

- Buffer’s docs specify which TikTok account types can post via third parties (e.g., Business vs personal limitations).
- **Action:** Open Buffer’s latest article: “TikTok” + “scheduling” + “requirements” and complete any **account conversion** or **permissions** steps **before** batch day.
- Keep **2FA** and admin access documented for Mirthbound—don’t lock scheduling to one phone.

---

## 3) Scheduling hygiene

- **Batch:** Film multiple cuts one session; schedule across the week in one Buffer sitting.
- **Spacing:** Stagger posts to avoid audience fatigue; test different **posting times** after you have qualitative feedback (comments, saves)—**don’t invent benchmarks**.
- **Captions:** Paste from `content/approved/`; keep **one CTA**.
- **Hashtags:** **0–3** on TikTok if used at all; relevance over volume (see template).

---

## 4) Repurposing TikTok → Instagram Reels

1. Export **9:16** from the same master where possible.
2. **New cover frame** for IG (often more static, readable title).
3. **Rewrite first line** of caption as a hook repeat; CTA may sit on line 2 (see `templates/IG_REEL_ADAPTATION.md`).
4. Check **music:** IG audio library differs from TikTok; replace if needed with licensed track.
5. Schedule in Buffer; note date in `content/published/` if you maintain a log.

---

## 5) Operational loop

| Step | Action |
|------|--------|
| Approve | Asset + caption live in `content/approved/` |
| Upload | Buffer composer; attach video |
| Double-check | CTA, spelling, App Store name |
| Schedule | Date/time per calendar |
| Log | Optional note in `content/published/` or monthly calendar file |

---

## 6) If something fails

- Re-read Buffer’s error message; often account type, expired token, or missing Business linkage.
- Re-authenticate TikTok/IG in Buffer; confirm TikTok still allows third-party posts for that account class.
