# n8n Local — Getting Started (manual “Execute”, no schedules)

For **solo use** on your **Mac**: you run **n8n inside Docker** (no separate “n8n Mac app” download). You build one workflow and click **Execute workflow** when you want a draft. **No cron required.**

**What you’re installing**

| Piece | What it is |
|-------|------------|
| **Docker Desktop** | The app that runs containers on your Mac. Install this **first**. |
| **n8n** | Pulled automatically the **first time** you run the `docker run … n8nio/n8n` command—you don’t download n8n from a website for this path. |

---

## 1) Install Docker Desktop (Homebrew)

You need [Homebrew](https://brew.sh). If you don’t have it, install from their site, then:

```bash
brew install --cask docker
```

1. Open **Docker** from **Applications** (or Spotlight: “Docker”).
2. Accept permissions / finish first-run setup if prompted.
3. Wait until the **whale icon** in the menu bar is steady and Docker says it’s **running** (not “starting…”).

**Check that Docker works:**

```bash
docker --version
docker run --rm hello-world
```

You should see a “Hello from Docker!” message. If that fails, fix Docker before continuing.

---

## 2) Start n8n (first time = downloads the n8n image)

In Terminal:

```bash
docker volume create n8n_data
docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
```

- The first run may **download** the `n8nio/n8n` image (one-time; needs internet).
- **Safari:** If you see a **secure cookie** warning on `http://`, stop the container and recreate with **`-e N8N_SECURE_COOKIE=false`** (local dev only)—see **Troubleshooting**—or use **Chrome/Firefox** instead.
- **UI:** open **[http://localhost:5678](http://localhost:5678)**
- First visit: create your **owner account** (stored locally in Docker volume—this isn’t n8n Cloud).

**Stop / start later**

```bash
docker stop n8n
docker start n8n
```

**Remove the container** (your workflows stay in the `n8n_data` volume until you delete that volume)

```bash
docker rm -f n8n
```

---

## 3) Get an OpenAI API key

Follow **Part 1** in [`docs/N8N_SETUP.md`](N8N_SETUP.md) (platform.openai.com → billing → API key).  
You need this before the OpenAI node will work.

---

## 4) Add the key in n8n

1. In n8n at `http://localhost:5678`: **Credentials** → **Add credential** → **OpenAI**.
2. Paste the API key → **Save**.

---

## 5) Build your first workflow (manual only)

1. **Workflows** → **Add workflow** → name it `gametime-draft-manual`.
2. **Trigger:** add **Manual Trigger** (not Schedule).  
   - You run everything with **Execute workflow** when you want output.
3. **OpenAI node:** connect after the trigger.
   - Credential: your OpenAI credential.
   - Model: **`gpt-4o-mini`**.
   - **System + user messages:** copy from [`prompts/N8N_OPENAI_BUFFER.md`](../prompts/N8N_OPENAI_BUFFER.md) (JSON output for captions → Buffer; image briefs for screenshots or a separate image generator). Product depth: [`GAMETIME.md`](GAMETIME.md).
4. **Output (pick one to start):**
   - **Send email** (Gmail/SMTP) with body = OpenAI output, **or**
   - Read the OpenAI output in the run panel and **copy manually**, **or**
   - Later: **HTTP Request** to GitHub API → [`content/drafts/`](../content/drafts/) (see **Part 5** in [`N8N_SETUP.md`](N8N_SETUP.md)).

5. **Save** the workflow (disk icon).

---

## 6) Run it

1. Open the workflow.
2. Click **Execute workflow** (or **Test workflow** depending on n8n version).
3. Copy the text into a file under **`content/drafts/`** in this repo if you’re not auto-committing yet.

That’s the loop: **you** decide when; **n8n** runs once per click.

---

## 7) Connect to this folder (optional)

| Goal | How |
|------|-----|
| **Copy/paste** | Paste execution output into `content/drafts/YYYY-MM-DD-topic.md` in Cursor. |
| **GitHub** | Add PAT + HTTP Request node per [`docs/N8N_SETUP.md`](N8N_SETUP.md) so drafts land in the repo. |
| **Local file on Mac** | Tricky from Docker without volume mounts; prefer GitHub or paste. |

---

## Troubleshooting

| Issue | Try |
|--------|-----|
| `docker: command not found` | Install Docker Desktop and **open the app**; use a new Terminal window. |
| `localhost:5678` won’t load | Docker running? `docker ps` shows a container named `n8n`? |
| First `docker run` is slow | Normal—image download. |
| **Safari shows “secure cookie” / insecure URL** | n8n defaults to secure cookies; Safari + `http://` often conflicts. **Quick fix:** use **Chrome or Firefox** for `http://localhost:5678`. **Safari fix:** recreate the container with `-e N8N_SECURE_COOKIE=false` (OK for **local only**): `docker stop n8n && docker rm n8n` then `docker run -d --name n8n -p 5678:5678 -e N8N_SECURE_COOKIE=false -v n8n_data:/home/node/.n8n n8nio/n8n` |
| OpenAI errors | Billing active? Key in Credentials? Model **`gpt-4o-mini`**? |
| “Where did my workflows go?” | Same Mac + same `n8n_data` volume; don’t delete the volume unless you mean to. |

---

## When you outgrow this

- **Schedules:** add a **Schedule** trigger (Mac must be on, or use n8n Cloud / a VPS).
- **Images:** put assets in **`content/media/`**; see **Images** in [`docs/N8N_SETUP.md`](N8N_SETUP.md).

**Full reference:** [`docs/N8N_SETUP.md`](N8N_SETUP.md) · [`docs/N8N_VISION.md`](N8N_VISION.md)
