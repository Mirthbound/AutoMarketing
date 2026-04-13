"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";

/** Design at largest Apple iPhone App Store size; smaller sizes re-exported via size picker. */
const W = 1320;
const H = 2868;

const IPHONE_SIZES = [
  { label: '6.9"', w: 1320, h: 2868 },
  { label: '6.5"', w: 1284, h: 2778 },
  { label: '6.3"', w: 1206, h: 2622 },
  { label: '6.1"', w: 1125, h: 2436 },
] as const;

const MK_RATIO = 1022 / 2082;

function phoneW(cW: number, cH: number, clamp = 0.84) {
  return Math.min(clamp, 0.72 * (cH / cW) * MK_RATIO);
}

type Theme = {
  bg: string;
  fg: string;
  accent: string;
  muted: string;
};

const THEME: Theme = {
  bg: "linear-gradient(165deg, #0b1020 0%, #1e1b4b 45%, #0f172a 100%)",
  fg: "#f8fafc",
  accent: "#a78bfa",
  muted: "#94a3b8",
};

const IMAGE_PATHS = [
  "/app-icon.png",
  "/screenshots/home.png",
  "/screenshots/now.png",
  "/screenshots/library.png",
  "/screenshots/discover.png",
  "/screenshots/stats.png",
  "/screenshots/wrapped.png",
];

const imageCache: Record<string, string> = {};

async function preloadAllImages() {
  await Promise.all(
    IMAGE_PATHS.map(async (path) => {
      const resp = await fetch(path);
      const blob = await resp.blob();
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      imageCache[path] = dataUrl;
    }),
  );
}

function img(path: string): string {
  return imageCache[path] || path;
}

function Phone({
  src,
  alt,
  style,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "relative", aspectRatio: "9 / 19.5", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "14% / 7%",
          background: "linear-gradient(160deg, #2a2a2e 0%, #18181b 100%)",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.08), 0 28px 64px rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "30%",
            height: "4%",
            borderRadius: 999,
            background: "#0a0a0b",
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "3%",
            top: "3.5%",
            width: "94%",
            height: "96%",
            borderRadius: "10% / 4.5%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img(src)}
            alt={alt}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

function Caption({
  cW,
  label,
  headline,
  theme,
  align = "left",
}: {
  cW: number;
  label: string;
  headline: React.ReactNode;
  theme: Theme;
  align?: "left" | "center";
}) {
  return (
    <div style={{ color: theme.fg, textAlign: align }}>
      <div
        style={{
          fontSize: cW * 0.028,
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: theme.accent,
          marginBottom: cW * 0.022,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: cW * 0.088,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
        }}
      >
        {headline}
      </div>
    </div>
  );
}

type SlideId =
  | "hero"
  | "now"
  | "library"
  | "discover"
  | "stats"
  | "wrapped";

type SlideDef = {
  id: SlideId;
  label: string;
  headline: React.ReactNode;
  screenshot: string;
  /** layout variant for visual rhythm */
  variant: "hero" | "feature-a" | "feature-b";
};

const SLIDES: SlideDef[] = [
  {
    id: "hero",
    label: "GAMETIME",
    headline: (
      <>
        Your games,
        <br />
        one home.
      </>
    ),
    screenshot: "/screenshots/home.png",
    variant: "hero",
  },
  {
    id: "now",
    label: "NOW",
    headline: (
      <>
        Pick what
        <br />
        plays next.
      </>
    ),
    screenshot: "/screenshots/now.png",
    variant: "feature-a",
  },
  {
    id: "library",
    label: "LIBRARY",
    headline: (
      <>
        Seven lists.
        <br />
        Zero chaos.
      </>
    ),
    screenshot: "/screenshots/library.png",
    variant: "feature-b",
  },
  {
    id: "discover",
    label: "DISCOVER",
    headline: (
      <>
        Browse a huge
        <br />
        game catalog.
      </>
    ),
    screenshot: "/screenshots/discover.png",
    variant: "feature-a",
  },
  {
    id: "stats",
    label: "STATS",
    headline: (
      <>
        Know what
        <br />
        you finished.
      </>
    ),
    screenshot: "/screenshots/stats.png",
    variant: "feature-b",
  },
  {
    id: "wrapped",
    label: "YEAR IN GAMES",
    headline: (
      <>
        Progress
        <br />
        you can feel.
      </>
    ),
    screenshot: "/screenshots/wrapped.png",
    variant: "hero",
  },
];

function SlideCanvas({
  slide,
  cW,
  cH,
  theme,
}: {
  slide: SlideDef;
  cW: number;
  cH: number;
  theme: Theme;
}) {
  const fw = phoneW(cW, cH) * 100;

  if (slide.variant === "hero") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: theme.bg,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: cW * 0.1,
            left: cW * 0.08,
            right: cW * 0.08,
          }}
        >
          <Caption cW={cW} label={slide.label} headline={slide.headline} theme={theme} />
        </div>
        <Phone
          src={slide.screenshot}
          alt={slide.id}
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: `${fw}%`,
            transform: "translateX(-50%) translateY(11%)",
          }}
        />
      </div>
    );
  }

  if (slide.variant === "feature-a") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: theme.bg,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: cH * 0.12,
            left: cW * 0.07,
            width: "86%",
          }}
        >
          <Caption cW={cW} label={slide.label} headline={slide.headline} theme={theme} />
        </div>
        <Phone
          src={slide.screenshot}
          alt={slide.id}
          style={{
            position: "absolute",
            bottom: "-2%",
            right: "-4%",
            width: `${fw * 0.95}%`,
            transform: "translateY(8%)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: theme.bg,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: cH * 0.14,
          left: cW * 0.07,
          width: "78%",
        }}
      >
        <Caption cW={cW} label={slide.label} headline={slide.headline} theme={theme} />
      </div>
      <Phone
        src={slide.screenshot}
        alt={slide.id}
        style={{
          position: "absolute",
          top: cH * 0.08,
          left: "50%",
          width: `${fw * 0.88}%`,
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
}

async function captureSlide(el: HTMLElement, w: number, h: number): Promise<string> {
  const prev = { left: el.style.left, opacity: el.style.opacity, zIndex: el.style.zIndex };
  el.style.left = "0px";
  el.style.opacity = "1";
  el.style.zIndex = "1";
  const opts = { width: w, height: h, pixelRatio: 1, cacheBust: true };
  await toPng(el, opts);
  const dataUrl = await toPng(el, opts);
  el.style.left = prev.left;
  el.style.opacity = prev.opacity;
  el.style.zIndex = prev.zIndex;
  return dataUrl;
}

export default function ScreenshotsPage() {
  const [ready, setReady] = useState(false);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [exporting, setExporting] = useState<string | null>(null);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    preloadAllImages().then(() => setReady(true));
  }, []);

  const exportAll = useCallback(async () => {
    const size = IPHONE_SIZES[sizeIdx];
    for (let i = 0; i < SLIDES.length; i++) {
      setExporting(`${i + 1}/${SLIDES.length}`);
      const el = exportRefs.current[i];
      if (!el) continue;
      const dataUrl = await captureSlide(el, size.w, size.h);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${String(i + 1).padStart(2, "0")}-${SLIDES[i].id}-en-${size.w}x${size.h}.png`;
      a.click();
      await new Promise((r) => setTimeout(r, 320));
    }
    setExporting(null);
  }, [sizeIdx]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-zinc-600">
        Loading images…
      </div>
    );
  }

  const previewScale = 0.22;
  const pW = W * previewScale;
  const pH = H * previewScale;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "12px 20px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15 }}>GameTime · App Store screenshots</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <label style={{ fontSize: 13, color: "#475569" }}>
            Export size{" "}
            <select
              value={sizeIdx}
              onChange={(e) => setSizeIdx(Number(e.target.value))}
              style={{
                marginLeft: 8,
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 13,
              }}
            >
              {IPHONE_SIZES.map((s, i) => (
                <option key={s.label} value={i}>
                  {s.label} — {s.w}×{s.h}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={exportAll}
            disabled={!!exporting}
            style={{
              padding: "8px 20px",
              background: exporting ? "#93c5fd" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: exporting ? "default" : "pointer",
            }}
          >
            {exporting ? `Exporting… ${exporting}` : "Export all PNGs"}
          </button>
        </div>
      </div>

      <p style={{ padding: "16px 20px", fontSize: 13, color: "#64748b", maxWidth: 720 }}>
        Copy follows allowed positioning from <code>docs/GAMETIME.md</code> (no metrics, no &quot;350k&quot;
        unless your onboarding still uses it). Replace files in <code>public/screenshots/</code> with real
        Simulator captures (6.1&quot; recommended). Replace <code>public/app-icon.png</code> with your icon.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
          padding: "8px 20px 40px",
        }}
      >
        {SLIDES.map((slide, i) => (
          <div key={slide.id} style={{ textAlign: "center" }}>
            <div
              style={{
                width: pW,
                height: pH,
                margin: "0 auto",
                overflow: "hidden",
                borderRadius: 12,
                boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              }}
            >
              <div
                style={{
                  width: W,
                  height: H,
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
              >
                <SlideCanvas slide={slide} cW={W} cH={H} theme={THEME} />
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: "#475569" }}>
              {String(i + 1).padStart(2, "0")} · {slide.id}
            </div>
          </div>
        ))}
      </div>

      {/* Full-resolution nodes for html-to-image (design canvas W×H; toPng resizes to selected App Store size). */}
      <div style={{ position: "absolute", left: -9999, top: 0, pointerEvents: "none" }}>
        {SLIDES.map((slide, i) => (
          <div
            key={`export-${slide.id}`}
            ref={(el) => {
              exportRefs.current[i] = el;
            }}
            style={{ width: W, height: H }}
          >
            <SlideCanvas slide={slide} cW={W} cH={H} theme={THEME} />
          </div>
        ))}
      </div>
    </div>
  );
}
