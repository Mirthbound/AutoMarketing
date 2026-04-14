# Raw App Store / marketing screenshots (inputs)

Put **Simulator or device PNGs** here **per app**, then open the matching Next.js project under `generators/screenshot-studio-<app>/`.

| App | Input folder | Generator |
|-----|----------------|-----------|
| GameTime | `content/media/screenshots/gametime/` | `generators/screenshot-studio-gametime/` |
| TuneScroll | `content/media/screenshots/tunescroll/` | `generators/screenshot-studio-tunescroll/` |
| babyTalk | `content/media/screenshots/babyTalk/` | `generators/screenshot-studio-babyTalk/` |

Each app’s `public/screenshots` is a **symlink** to its folder above (Unix/macOS). On Windows, if symlinks are problematic, copy PNGs into `generators/screenshot-studio-<app>/public/screenshots/` instead, or use a directory junction. Filenames must match `SLIDES` / `IMAGE_PATHS` in that app’s `src/app/page.tsx`.

**Finished marketing exports** (framed PNGs for Buffer, etc.) go in **`content/media/renders/<app>/`**, not here.
