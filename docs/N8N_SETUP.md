# n8n + OpenAI Setup — Step by Step

This guide covers: **OpenAI API key (`gpt-4o-mini`)** → **running n8n** → **a first “draft to disk” workflow** → **optional: save drafts into this repo** (`content/drafts/`).

**Related:** `docs/N8N_VISION.md`, `docs/BUFFER_AUTOMATION.md`, `templates/TIKTOK_AD_SCRIPT.md`, `prompts/CURSOR_MARKETING_AGENT.md`, **`prompts/N8N_OPENAI_BUFFER.md`** (copy-paste system/user prompts for Buffer-bound JSON output).

---

## Part 1 — OpenAI API key for `gpt-4o-mini`

### 1. Create or log into an OpenAI account

1. Open **[https://platform.openai.com](https://platform.openai.com)** (developer/API platform—not only ChatGPT consumer).
2. Sign up or sign in.

### 2. Enable API billing (required for API access)

1. In the dashboard, open **Settings → Billing** (or **Billing overview**).
2. Add a **payment method** and purchase **API credits** or enable pay-as-you-go, per OpenAI’s current rules.
3. **Note:** Free promotional API credit sometimes exists for new accounts—check OpenAI’s site; ongoing use is billed.

### 3. Create an API key

1. Go to **API keys** (often under your profile / **[https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)**).
2. Click **Create new secret key**.
3. Name it (e.g. `n8n-automarketing`).
4. **Copy the key once** and store it in a password manager. You cannot view it again later (only rotate).

### 4. Use the model name `gpt-4o-mini`

- In n8n’s OpenAI node (or HTTP calls to the Chat Completions / Responses API), set the model to **`gpt-4o-mini`**.
- If a node lists models in a dropdown, pick **`gpt-4o-mini`** if present; otherwise type it exactly (availability depends on your account and OpenAI’s model list).

### 5. Security habits

- Never commit the key to Git. Use **n8n Credentials** only.
- Rotate the key if it leaks.
- Set **usage limits** in OpenAI (monthly budget cap) under Billing / Limits if available.

---

## Part 2 — Run n8n (pick one)

### Option A — n8n Cloud (fastest)

1. Go to **[https://n8n.io](https://n8n.io)** and sign up for **n8n Cloud** (hosted by n8n).
2. Complete email verification and open your **n8n instance URL** (e.g. `yourname.app.n8n.cloud`).
3. **Pros:** No server maintenance. **Cons:** Subscription; check current pricing.

### Option B — Self-host with Docker (local or VPS)

1. Install [Docker](https://docs.docker.com/get-docker/) on your machine or server.
2. Run (example—adjust port/volume as you like):

```bash
docker volume create n8n_data
docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
```

3. Open **`http://localhost:5678`** (or your server IP + port).
4. Complete the first-run **owner account** setup in the UI.
5. **Pros:** Data stays on your infra. **Cons:** You patch and back up the instance.

**Official docs:** [https://docs.n8n.io/hosting/](https://docs.n8n.io/hosting/)

---

## Part 3 — Connect OpenAI inside n8n

1. In n8n, open **Credentials** → **Add credential**.
2. Search for **OpenAI** (or **OpenAI API**).
3. Paste your **API key** from Part 1.
4. Save. Test connection if the dialog offers it.

---

## Part 4 — First workflow: schedule → LLM → draft file (no Git yet)

Goal: prove the loop before wiring Git.

### Step 1 — New workflow

1. **Workflows** → **Add workflow**.
2. Name it: `marketing-draft-gametime-v1`.

### Step 2 — Schedule trigger

1. Add node: **Schedule Trigger**.
2. Set **Rule** (e.g. every **Monday 09:00** in your timezone), or use **interval** for testing (every 5 minutes once, then change back).

### Step 3 — Prompt context (Set node)

1. Add **Edit Fields (Set)** or **Code** node to define:
   - `product`: `GameTime`
   - Optional: `theme` (e.g. `backlog`, `discovery`) for variety.

### Step 4 — OpenAI / LLM step

1. Add **OpenAI** node (e.g. **Message a model** or **Chat**—names vary by n8n version).
2. Select your **OpenAI credential**.
3. Model: **`gpt-4o-mini`** (enable **JSON / structured output** in the node if available—helps the next step).
4. **System message** — use the full block in **`prompts/N8N_OPENAI_BUFFER.md`** (GameTime truth + **JSON** keys for `primary_caption`, `image_direction`, `image_prompt_for_generator`, Buffer notes—aligned with image-led posts and **`docs/BUFFER_AUTOMATION.md`**).  
   - Legacy Markdown script format is still in **`templates/TIKTOK_AD_SCRIPT.md`** if you prefer long-form scripts.

5. **User message** — from the same file, e.g. `Theme: {{ $json.theme }}` or the static example in **`prompts/N8N_OPENAI_BUFFER.md`**.

6. Map the **assistant text** output to the next node (often `{{ $json.message.content }}` or the field shown in n8n’s output panel—inspect after one test run).

### Step 5 — Save the draft somewhere you can see

Pick **one** to start:

| Method | Node idea |
|--------|-----------|
| **Email yourself** | **Gmail** / **SMTP** node: body = LLM output; subject = `GameTime draft {{ $now }}` |
| **Google Drive** | **Google Drive**: create file in a folder |
| **Local testing** | **Write Binary File** only works if n8n runs where the path exists—usually skip for Cloud |

**Recommendation:** Email or Drive first. Git comes in Part 5.

### Step 6 — Notification (optional)

1. Add **Slack**, **Telegram**, or **Email** node: “New GameTime draft created — check Drive / inbox.”

### Step 7 — Activate

1. **Save** workflow.
2. Toggle **Active**.
3. Use **Execute workflow** once to test without waiting for the schedule.

---

## Part 5 — Wire drafts into **this repo** (`content/drafts/`)

**Idea:** Each run creates a new file such as `content/drafts/2026-04-20-n8n-gametime-01.md` on your **default branch** (or a dedicated branch).

### Prerequisites

1. Repo hosted on **GitHub** (or GitLab—steps differ slightly).
2. **Personal Access Token (PAT)** with permission to **read/write repository contents** (GitHub: fine-grained token → Contents: Read and write on that repo only).

### Steps (GitHub example)

1. GitHub → **Settings → Developer settings → Fine-grained tokens** → create token scoped to the **AutoMarketing** repo, **Contents: Read and write**.
2. In n8n, add **HTTP Request** node (or **GitHub** community node if you prefer).
3. Use GitHub **Contents API** to **create or update** a file:
   - `PUT https://api.github.com/repos/OWNER/REPO/contents/content/drafts/FILENAME.md`
   - Headers: `Authorization: Bearer YOUR_PAT`, `Accept: application/vnd.github+json`
   - Body JSON: `message`, `content` (Base64-encoded Markdown), `branch`

4. Filename: use an **Expression** so each run is unique, e.g.  
   `2026-04-20-n8n-{{ $now.format('HHmmss') }}.md`

5. **Important:** If the file already exists, GitHub requires the **current file `sha`** on update—either always use **new filenames** (simplest) or add a **Get file** step first to read `sha`.

6. After the first successful commit, pull in Cursor or run `git pull` locally to see files under `content/drafts/`.

**Alternative:** Push to branch `auto-drafts` and open PRs for review—safer for teams, more nodes.

---

## Part 6 — Align prompts with the repo (recommended)

1. Copy allowed-claims bullets from **`docs/GAMETIME.md`** into the **system message** (or host a raw paste in a private gist and **HTTP Request** fetch—optional).
2. Keep **`templates/TIKTOK_AD_SCRIPT.md`** open while you refine the system prompt so section headings match.
3. Store long prompts in n8n **Set** nodes or **n8n’s workflow static data** so you are not editing giant strings in multiple places.

---

## Images — where to put them so n8n can use them

**n8n does not see your laptop’s folders by default.** Workflows run in the **cloud** (n8n Cloud) or on **your server** (self-host). So “rely on them” means: store files where a workflow can reach them by **API**, **node**, or **URL**.

### In this repo (recommended home base)

| Path | Use |
|------|-----|
| **`content/media/`** | **Approved** static assets: exported PNG/JPG/WebP for posts, UI screenshots, end cards. Subfolders optional, e.g. `content/media/gametime/`, `content/media/brand/`. |

Commit and push to GitHub (or Git host). Then n8n can:

1. **HTTP Request** — fetch **`https://raw.githubusercontent.com/OWNER/REPO/BRANCH/content/media/yourfile.png`** (works for **public** repos; for **private** repos use a token in headers or a different host).
2. **Google Drive / Dropbox / S3** — put files there and use the matching **n8n node** to read or get a **share link** Buffer/social APIs accept.
3. **Generate in n8n** — OpenAI **Images** node or another API writes **binary**; next node uploads to Drive/S3 or attaches where your stack supports.

### What not to do

- Don’t assume **`/Users/.../AutoMarketing/content/media`** paths work from **n8n Cloud**—they won’t unless you sync that folder to a service n8n integrates with.
- For **Buffer / Meta / TikTok** uploads, platforms usually need a **public URL** or **native upload** from your machine—confirm Buffer’s current API for **media URL** vs file upload.

**Practical default:** Keep masters in **`content/media/`**, push to Git if you’re okay with visibility rules; point n8n at **raw GitHub URLs** (public) or **S3/Drive** (private links with auth in n8n).

---

## Checklist before relying on automation

- [ ] OpenAI billing and **usage cap** configured.
- [ ] API key only in **n8n Credentials**.
- [ ] Test run produces Markdown you would actually post after creative work (images/caption).
- [ ] Claims still pass your read of **`docs/GAMETIME.md`** (automation does not remove legal responsibility).
- [ ] Git PAT scoped **minimally** (one repo, contents only if possible).

---

## Quick reference

| Item | Value / link |
|------|----------------|
| OpenAI platform | [https://platform.openai.com](https://platform.openai.com) |
| API keys | [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Model (cost-effective) | `gpt-4o-mini` |
| n8n docs | [https://docs.n8n.io](https://docs.n8n.io) |
| This repo drafts folder | `content/drafts/` |
| Static images for posts | `content/media/` (see **Images** section above) |
