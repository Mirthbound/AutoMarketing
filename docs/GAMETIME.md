# GameTime — Creative & Claims Reference

**Product:** iOS **personal game OS**: one place for **what to play**, **what you own**, **what you finished**, and **how you’re doing**—built on **real game data (IGDB)** so it feels rich, not like a spreadsheet.

**Source of truth for copy:** This doc + your **live App Store listing** + **shipping build**. If marketing or onboarding copy changes, update this file.

Use the sections **Allowed claims**, **Conditional / gated claims**, and **Needs verification** before filming or publishing.

---

## Core positioning (lean on these)

| Theme | Copy direction |
|--------|----------------|
| **Personal game OS** | One hub for backlog, playing, completed, wishlist, and progress—not a generic list app. |
| **Real game data (IGDB)** | Huge catalog signal: covers, scores, platforms, genres/themes, similar titles, events—presented as **app experience**, not a sheet export. |
| **Daily driver (“Now”)** | Home for **what’s playing**, **what’s next** (smart rows + randomizer), and entry to **Wrapped** when the feature is available. |
| **Serious library tools** | Seven states, deep sort/filter, swipe between lists—**for people with real backlogs**. |
| **Discovery + depth** | Rails, search, events, recommendations queue (when unlocked)—find the next obsession **inside** the app. |
| **Progress you can feel** | Stats, Wrapped, badges, share cards—emotional payoff without inventing numbers in ads. |

**On-screen:** Prefer **your** screen recordings of **your** app UI. The app includes **proper IGDB attribution** in UI—good to show briefly for **trust** in educational or feature-tour spots (not required in every 15s punchy ad).

---

## Allowed claims (safe if the shipping app matches)

Use plain language that mirrors real labels and flows. **Do not** add rankings, awards, download counts, or partnership claims not in writing.

### Cross-cutting

- **Library states** you can reference: **Backlog, Playing, Completed, Dropped, Wishlist, On Hold**, plus **All** (seven states + All).
- **Unified search** to add games and search **in-library** (sheet flow).
- **IGDB-backed** metadata: rich **game detail** (summary, publisher, platforms, ratings, estimated playtime when available, similar games, series/collections where data exists).
- **Store links** on titles when the data provides them (Steam, PlayStation, Xbox, Nintendo, Epic, GOG, etc.—**show UI**, don’t promise every title has every link).
- **User journal** on a game: status, your rating, logged playtime, start/finish dates, completion %, notes—**autosave** with lightweight saved confirmation.
- **Sort** (where shown in app): playtime, your rating, title, release date, IGDB rating, completed date.
- **Deep filters** (where shown): platforms, IGDB score band, estimated length bands (HLTB-style averages in-app), your rating & logged playtime bands, has/no rating, has/no playtime.
- **Pull to refresh** tied to **sync** behavior as implemented (say “sync” or “refresh”—don’t invent sync speed).
- **Swipe / move between lists** as a headline interaction (matches onboarding).
- **Completion flow** via completion **form sheet** from library/now paths.
- **Discover** includes **unified catalog search**, **curated rails** (e.g. new releases, highly rated, trending, upcoming—mirror **exact rail names** from the app).
- **Industry / calendar events**: carousel, event detail, streams when live, related games, videos; **local notifications** for event start/end **where applicable** in settings.
- **Stats:** year filters (this year, last year, lifetime); headline metrics such as **games completed**, **total hours** (yours or estimated fallback—don’t fabricate user hours in ads), **average rating** (respect 5 vs 10 scale in copy if you mention it), **completion rate** with explainer; **record highlights** (longest/shortest completed run in period); **backlog health** style copy (motivational framing).
- **Wrapped / Year-End recap:** shareable recap, breakdowns, **story + square export sizes** in UI—**only** when the feature/season gate matches what you ship (see **Conditional** below).
- **Achievements / badges:** categories, tiers, progress, new treatment, toast on main tabs with shortcut to gallery—describe **patterns**, not fake unlock counts for the viewer.
- **iCloud (CloudKit)** sync when available; **last sync** visibility; **offline queue** / flush behavior when returning to foreground—**high level** only unless you verified exact behavior.
- **JSON backup** export and **restore from file** with **import preview** (counts of new vs overwritten; does not delete missing titles)—good trust angle.
- **Preferences:** default tab, default sort, default library list; **refresh all metadata from IGDB** for whole library (power-user maintenance); **replay onboarding** (“App features” tour); **share App Store** link; **feature request / bug report** mail links.
- **Notifications (all local):** flashbacks (e.g. completion anniversaries), weekly game-time reminders, wishlist release alerts with deep link, weekly stats summary, backlog reminders, event reminders where configured, **badge on icon** clears when opening app—use for **habit** angles, not creepy tracking language.

### “Now” (home)

- **Now Playing:** horizontal strip for games marked **Playing**; quick path to **finish / log progress**.
- **Smart “what should I play next?” rows** from backlog, including concepts like: **highest rated (IGDB user score)**, **oldest in backlog**, **quick wins** (estimated under ~10h), **big commitments** (40+ hours)—**only** if those rows exist and labels match the app.
- **Backlog randomizer:** roll a pick, **pick another**, haptics, empty-state guidance.
- **Year-End / Wrapped entry** from home when the feature gate is on (often defaulting in **December**)—tie copy to **actual** gate behavior.

### Personalized recommendations

- **Discovery Queue–style** flow (swipe suggestions, detail, add to library)—**banner appears after user has completed ≥10 games** in product logic. Ads can describe the **mechanic** without implying every new user sees it on day one.

---

## Conditional / gated claims (use only when true in build + listing)

| Topic | Rule |
|--------|------|
| **“350,000+ games”** (onboarding copy) | Use **only** if current onboarding/store still states it **and** you’re comfortable it matches catalog/data sourcing. Otherwise use “large IGDB-backed catalog” without a number. |
| **Highly rated / trending thresholds** | Don’t cite numeric cutoffs in ads unless fixed in product and approved—say “highly rated rail” or show UI. |
| **Wrapped / Year-End** | Mention **seasonal/feature gate** (e.g. December emphasis) as in app; don’t promise Wrapped UI if the gate is off in public build. |
| **iCloud sync** | Say “when available” or show **settings** screen if regional/account limitations exist. |
| **Recommendations banner** | Clarify **unlocks after** enough completed games (product logic)—don’t imply instant for new installs. |
| **Event streams / notifications** | “Where applicable” / per settings—don’t promise alerts the user hasn’t enabled. |

---

## Needs verification (confirm before claiming numerically or legally sensitive)

- **Pricing**, trials, IAP, and App Store **subtitle** / **keywords**.
- **Minimum iOS**, device coverage, and regional **availability**.
- Exact **sync** conflict behavior, **multi-device** edge cases, and **CloudKit** eligibility.
- Which **rails** and **filters** ship in a given version; label text changes.
- **Estimated length** source and refresh cadence (HLTB-style averages in-app—don’t cite external brand names unless you have rights / factual need).
- **Third-party store links** availability per platform (show UI, don’t guarantee completeness per game).

If unknown: **show the screen** or use non-numeric language (“estimated length,” “IGDB rating,” “your hours”).

---

## Feature map by surface (for shot lists & scripts)

Concise—pair with **Allowed claims** above.

| Surface | Beats to film |
|---------|----------------|
| **Now** | Now Playing strip; smart next-play rows; randomizer + haptics; Wrapped entry when on |
| **Library** | Seven states; search/add; sort & filters; pull to refresh; swipe between lists; completion sheet |
| **Discover** | Unified search; rails; events carousel + detail; recommendations queue (unlocked state) |
| **Game detail** | Metadata stack; similar games; journal fields; store links row |
| **Stats** | Year filters; headline metrics; highlights; backlog health; launch Wrapped from Stats |
| **Profile / settings** | Badges gallery; iCloud + backup; preferences; replay tour; support links |
| **Notifications** | Settings toggles + example purpose (local only) |

---

## How to sell it (ad & store angles — suggested)

Use as **themes**, not all in one ad:

| Angle | Punch-in |
|-------|----------|
| **Stop staring at your backlog** | Now tab + smart rows + randomizer + time-based picks |
| **One library, every device** | iCloud + backup/restore + offline queue narrative (accurate to build) |
| **Know what you actually finished** | Stats, Wrapped, completion rate, hours (no fake user stats) |
| **Find the next obsession faster** | Discover rails + search + similar games + rec queue when unlocked |
| **Progress you can feel** | Badges, toasts, Wrapped share cards |
| **Serious filters for serious backlogs** | Library filters + sort + multi-list workflow |

---

## Hook ideas (ads, not logs)

*Original set plus product-shaped lines—you can rotate and A/B.*

1. “Your game backlog is lying to you.”
2. “POV: you finally deleted the ‘games’ note.”
3. “Stop treating your library like a camera roll.”
4. “If you can’t find it, you won’t play it.”
5. “One app. Your whole game life.”
6. “Backlog guilt is optional.”
7. “Roll the backlog. Commit or reroll.”
8. “What should I play next? The app actually answers.”
9. “IGDB-powered—without the spreadsheet face.”
10. “Quick win or long haul—pick a row and go.”
11. “Seven lists. Zero chaos.”
12. “Filters deep enough for a backlog your size.”
13. “Know what you finished. Finally.”
14. “Stats that match how you actually play.”
15. “Wrapped-style recap—without the cringe spreadsheet export.”
16. “Badges hit different when you earned them.”
17. “Events, rails, search—still one library.”
18. “Journal per game. Notes app could never.”
19. “Sync and backup story for people with more than one device.”
20. “Discover the next obsession before you buy the fifth one you won’t start.”
21. “Randomizer for the chronically indecisive.”
22. “Playing strip on the home tab—finish the old, start the new.”
23. “Similar titles, series, store links—detail that goes deep.”
24. “Local reminders. Not creepy. Just ‘your backlog exists.’”
25. “Personal game OS. Not another notes hack.”

---

## Video concepts (performance ads)

1. **Notes app intervention** — Messy Notes vs unified search + add flow.
2. **Now Playing → done** — Strip + completion sheet in one arc.
3. **Smart rows** — Highest rated / oldest / quick wins / big commitments—UI truth only.
4. **Randomizer** — Roll → haptic → “pick another”; empty state if demo library thin.
5. **Filter flex** — One beat: open filters, apply one band, show results count **from demo data** (no fake numbers if UI shows none).
6. **Discover rails** — Pan new releases / highly rated / trending / upcoming—match live labels.
7. **Events carousel** — Single event card → detail; mention notifications only if showing toggles.
8. **Stats / Wrapped** — Demo account; **demo library** label; seasonal copy only when gate on.
9. **Badge toast** — Earned badge → gallery shortcut (staged demo if needed).
10. **iCloud + backup trust** — Settings tour: last sync + export/import preview (no real user data).
11. **Recommendations queue** — Only if you can show unlocked state or clearly label “unlocks as you complete more.”
12. **CTA A/B** — Same visuals; test App Store search vs link in bio.

---

## Competitor-aware angles (no names unless factual)

- **Category:** “Notes apps weren’t built for game collections.”
- **Category:** “Store wishlists ≠ a library you own and finish.”
- **Category:** “Screenshots aren’t a system.”
- **Avoid:** Naming other apps unless comparing a **documented** public fact.

---

## Filming checklist (quick)

- [ ] Claims match **Allowed**, **Conditional**, and live build; flag **Needs verification** items.
- [ ] No real user data—**demo library** only; label if helpful.
- [ ] **350k+** and **threshold** numbers only if still accurate and approved.
- [ ] Wrapped / rec queue / iCloud framed with **gates** and **when available** where needed.
- [ ] IGDB attribution visible in UI if you show settings/about—good for trust clips.
- [ ] No third-party trailers or copyrighted OST as primary audio.
- [ ] App Store name and developer match live listing (`config/urls.json` when finalized).
