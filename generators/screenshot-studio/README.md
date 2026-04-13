# GameTime screenshot studio

Next.js **App Store** screenshot generator (iPhone portrait). Headlines align with **`docs/GAMETIME.md`** allowed claims (no fabricated metrics).

## Run locally

```bash
cd generators/screenshot-studio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Choose export size, then **Export all PNGs**.

## Replace placeholders

| File | Replace with |
|------|----------------|
| `public/screenshots/*.png` | Real **6.1"** Simulator captures (see upstream skill README). |
| `public/app-icon.png` | Your App Store icon. |

## Build

```bash
npm run build
npm start
```

## Outputs

Downloads are named `01-hero-en-1320x2868.png`, etc. Copy finals to **`../../content/media/renders/`** for Buffer / GitHub raw URLs (`docs/BUFFER_AUTOMATION.md`).
