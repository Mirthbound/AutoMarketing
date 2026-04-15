"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

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

type SlideId = "slide01" | "slide02" | "slide03" | "slide04" | "slide05";

/** Edit themes + copy in this file; raw PNGs live in `content/media/screenshots/babyTalk/`. */
type Theme = {
  fg: string;
  muted: string;
  gradient: string;
  accent: string;
  glow: string;
};

const SLIDE_THEMES: Record<SlideId, Theme> = {
  slide01: {
    fg: "#f8fafc",
    muted: "#94a3b8",
    gradient:
      "linear-gradient(168deg, #020617 0%, #0f172a 22%, #312e81 55%, #0e7490 100%)",
    accent: "#67e8f9",
    glow: "rgba(34, 211, 238, 0.55)",
  },
  slide02: {
    fg: "#f8fafc",
    muted: "#94a3b8",
    gradient:
      "linear-gradient(175deg, #020617 0%, #134e4a 35%, #1e40af 92%)",
    accent: "#2dd4bf",
    glow: "rgba(45, 212, 191, 0.5)",
  },
  slide03: {
    fg: "#f8fafc",
    muted: "#a8b2c3",
    gradient:
      "linear-gradient(182deg, #0c0a12 0%, #4c1d95 42%, #312e81 88%)",
    accent: "#c4b5fd",
    glow: "rgba(167, 139, 250, 0.48)",
  },
  slide04: {
    fg: "#f8fafc",
    muted: "#94a3b8",
    gradient:
      "linear-gradient(165deg, #020617 0%, #0e7490 38%, #4338ca 95%)",
    accent: "#7dd3fc",
    glow: "rgba(56, 189, 248, 0.52)",
  },
  slide05: {
    fg: "#ecfdf5",
    muted: "#a7c4bc",
    gradient:
      "linear-gradient(195deg, #022c22 0%, #0f172a 48%, #1e1b4b 100%)",
    accent: "#6ee7b7",
    glow: "rgba(52, 211, 153, 0.42)",
  },
};

function themeFor(id: SlideId): Theme {
  return SLIDE_THEMES[id];
}

const IMAGE_PATHS = [
  "/app-icon.png",
  "/screenshots/home.png",
  "/screenshots/journal.png",
  "/screenshots/learn.png",
  "/screenshots/milestone_details.png",
  "/screenshots/milestones.png",
];

const imageCache: Record<string, string> = {};

/**
 * html-to-image serializes the cloned DOM into an SVG, then loads it as a data URL. Very large
 * `data:image/png;base64,...` attributes (common for tall Simulator PNGs) can exceed browser limits
 * and rasterize as solid black inside the phone while the on-screen preview still looks fine.
 */
const MAX_RASTER_EXPORT_PX = 1600;

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("decode failed"));
    image.src = src;
  });
}

async function blobToExportDataUrl(blob: Blob): Promise<string> {
  if (blob.type === "image/svg+xml") {
    return blobToDataUrl(blob);
  }
  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = await loadHtmlImage(objectUrl);
    const nw = image.naturalWidth;
    const nh = image.naturalHeight;
    if (!nw || !nh) {
      return blobToDataUrl(blob);
    }
    const maxSide = Math.max(nw, nh);
    if (maxSide <= MAX_RASTER_EXPORT_PX) {
      return blobToDataUrl(blob);
    }
    const scale = MAX_RASTER_EXPORT_PX / maxSide;
    const tw = Math.round(nw * scale);
    const th = Math.round(nh * scale);
    const canvas = document.createElement("canvas");
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    if (!ctx) return blobToDataUrl(blob);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, tw, th);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function preloadAllImages() {
  await Promise.all(
    IMAGE_PATHS.map(async (path) => {
      const resp = await fetch(path);
      if (!resp.ok) {
        throw new Error(`${path} → HTTP ${resp.status}`);
      }
      const blob = await resp.blob();
      imageCache[path] = await blobToExportDataUrl(blob);
    }),
  );
}

function img(path: string): string {
  return imageCache[path] || path;
}

/** Gradient + subtle “tech grid” + soft glows (reads well on App Store thumbnails). */
function TechBackdrop({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: theme.gradient,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.13,
          backgroundImage: `
            linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-18%",
          right: "-10%",
          width: "56%",
          height: "42%",
          background: `radial-gradient(ellipse farthest-corner, ${theme.glow} 0%, transparent 72%)`,
          filter: "blur(52px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-24%",
          left: "-14%",
          width: "62%",
          height: "48%",
          background:
            "radial-gradient(ellipse farthest-corner, rgba(99,102,241,0.42) 0%, transparent 74%)",
          filter: "blur(58px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 44%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

function Phone({
  src,
  alt,
  accent,
  style,
}: {
  src: string;
  alt: string;
  accent: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "relative", aspectRatio: "9 / 19.5", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "14% / 7%",
          background: "linear-gradient(155deg, #2d2d35 0%, #141416 55%, #0a0a0c 100%)",
          boxShadow: `
            inset 0 0 0 1px rgba(255,255,255,0.1),
            0 32px 72px rgba(0,0,0,0.58),
            0 0 0 1px rgba(255,255,255,0.04),
            0 0 100px ${accent}33
          `,
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

/** Same position on every slide: top-right “stamp” so it never fights the headline. */
function AppIconMark({ cW, accent }: { cW: number; accent: string }) {
  const s = Math.round(cW * 0.12);
  return (
    <div
      style={{
        position: "absolute",
        top: cW * 0.052,
        right: cW * 0.06,
        zIndex: 5,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img("/app-icon.png")}
        alt=""
        width={s}
        height={s}
        style={{
          display: "block",
          borderRadius: cW * 0.028,
          boxShadow: `
            0 10px 36px rgba(0,0,0,0.45),
            0 0 0 1px rgba(255,255,255,0.12),
            0 0 48px ${accent}38
          `,
        }}
        draggable={false}
      />
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
          textShadow:
            "0 4px 32px rgba(0,0,0,0.65), 0 0 40px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {headline}
      </div>
    </div>
  );
}

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
    id: "slide01",
    label: "HOME",
    headline: (
      <>
        Your day,
        <br />
        one place.
      </>
    ),
    screenshot: "/screenshots/home.png",
    variant: "hero",
  },
  {
    id: "slide02",
    label: "JOURNAL",
    headline: (
      <>
        Moments
        <br />
        worth saving.
      </>
    ),
    screenshot: "/screenshots/journal.png",
    variant: "feature-a",
  },
  {
    id: "slide03",
    label: "LEARN",
    headline: (
      <>
        Guidance
        <br />
        that fits.
      </>
    ),
    screenshot: "/screenshots/learn.png",
    variant: "feature-b",
  },
  {
    id: "slide04",
    label: "DETAILS",
    headline: (
      <>
        Every milestone
        <br />
        in context.
      </>
    ),
    screenshot: "/screenshots/milestone_details.png",
    variant: "feature-a",
  },
  {
    id: "slide05",
    label: "MILESTONES",
    headline: (
      <>
        Track what
        <br />
        matters.
      </>
    ),
    screenshot: "/screenshots/milestones.png",
    variant: "feature-b",
  },
];

function SlideCanvas({
  slide,
  cW,
  cH,
}: {
  slide: SlideDef;
  cW: number;
  cH: number;
}) {
  const theme = themeFor(slide.id);
  const fw = phoneW(cW, cH) * 100;

  if (slide.variant === "hero") {
    /** Tighter headline↔device gap: less bottom peek + slightly wider phone than generic phoneW. */
    const fwHero = Math.min(0.9, phoneW(cW, cH) * 1.07) * 100;
    return (
      <TechBackdrop theme={theme}>
        <AppIconMark cW={cW} accent={theme.accent} />
        <div
          style={{
            position: "absolute",
            top: cW * 0.085,
            left: cW * 0.08,
            right: cW * 0.08,
          }}
        >
          <Caption cW={cW} label={slide.label} headline={slide.headline} theme={theme} />
        </div>
        <Phone
          src={slide.screenshot}
          alt={slide.id}
          accent={theme.accent}
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: `${fwHero}%`,
            transform: "translateX(-50%) translateY(3%)",
          }}
        />
      </TechBackdrop>
    );
  }

  if (slide.variant === "feature-a") {
    return (
      <TechBackdrop theme={theme}>
        <AppIconMark cW={cW} accent={theme.accent} />
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
          accent={theme.accent}
          style={{
            position: "absolute",
            bottom: "-2%",
            right: "-4%",
            width: `${fw * 0.95}%`,
            transform: "translateY(8%)",
          }}
        />
      </TechBackdrop>
    );
  }

  /**
   * feature-b (babyTalk): phone scaled between “no overlap with headline” and filling the frame
   * (~0.76× phone width factor); modest bottom inset on the caption block.
   */
  return (
    <TechBackdrop theme={theme}>
      <AppIconMark cW={cW} accent={theme.accent} />
      <div
        style={{
          position: "absolute",
          bottom: cH * 0.125,
          left: cW * 0.1,
          right: cW * 0.1,
          zIndex: 2,
        }}
      >
        <Caption cW={cW} label={slide.label} headline={slide.headline} theme={theme} />
      </div>
      <Phone
        src={slide.screenshot}
        alt={slide.id}
        accent={theme.accent}
        style={{
          position: "absolute",
          top: cH * 0.095,
          left: "50%",
          width: `${fw * 0.76}%`,
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      />
    </TechBackdrop>
  );
}

function resizePngDataUrl(dataUrl: string, outW: number, outH: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = outW;
      c.height = outH;
      const ctx = c.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas 2d"));
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, outW, outH);
      resolve(c.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("resize: image load failed"));
    img.src = dataUrl;
  });
}

async function captureSlide(el: HTMLElement, outW: number, outH: number): Promise<string> {
  const prev = {
    position: el.style.position,
    left: el.style.left,
    top: el.style.top,
    transform: el.style.transform,
    transformOrigin: el.style.transformOrigin,
    opacity: el.style.opacity,
    zIndex: el.style.zIndex,
    width: el.style.width,
    height: el.style.height,
  };
  el.style.position = "fixed";
  el.style.left = "0px";
  el.style.top = "0px";
  el.style.transform = "none";
  el.style.transformOrigin = "top left";
  el.style.opacity = "1";
  el.style.zIndex = "2147483647";
  el.style.width = `${W}px`;
  el.style.height = `${H}px`;
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
  try {
    if (document.fonts?.ready) await document.fonts.ready;
  } catch {
    /* ignore */
  }

  const canvas = await html2canvas(el, {
    scale: 1,
    width: W,
    height: H,
    windowWidth: W,
    windowHeight: H,
    scrollX: 0,
    scrollY: 0,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    logging: false,
  });

  el.style.position = prev.position;
  el.style.left = prev.left;
  el.style.top = prev.top;
  el.style.transform = prev.transform;
  el.style.transformOrigin = prev.transformOrigin;
  el.style.opacity = prev.opacity;
  el.style.zIndex = prev.zIndex;
  el.style.width = prev.width;
  el.style.height = prev.height;

  const dataUrl = canvas.toDataURL("image/png");
  if (outW === W && outH === H) return dataUrl;
  return resizePngDataUrl(dataUrl, outW, outH);
}

export default function ScreenshotsPage() {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [exporting, setExporting] = useState<string | null>(null);
  const capturePreviewRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    preloadAllImages()
      .then(() => setReady(true))
      .catch((e: unknown) => {
        setLoadError(e instanceof Error ? e.message : String(e));
      });
  }, []);

  const exportAll = useCallback(async () => {
    const size = IPHONE_SIZES[sizeIdx];
    for (let i = 0; i < SLIDES.length; i++) {
      setExporting(`${i + 1}/${SLIDES.length}`);
      const el = capturePreviewRefs.current[i];
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

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-zinc-100 px-6 text-center text-zinc-800">
        <p className="font-semibold">Could not load image assets</p>
        <p className="max-w-lg text-sm text-zinc-600">{loadError}</p>
        <p className="max-w-lg text-sm text-zinc-500">
          Filenames must match <code className="rounded bg-zinc-200 px-1">SLIDES</code> in this file, under{" "}
          <code className="rounded bg-zinc-200 px-1">public/screenshots</code> in the project you run{" "}
          <code className="rounded bg-zinc-200 px-1">npm run dev</code> from.
        </p>
      </div>
    );
  }

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
        <span style={{ fontWeight: 700, fontSize: 15 }}>babyTalk · App Store screenshots</span>
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
        <code>public/screenshots</code> is a symlink to <code>content/media/screenshots/babyTalk/</code>. Edit{" "}
        <code>SLIDES</code> / filenames here; use the same repo folder as your dev server. Add a product-truth doc
        when ready (e.g. <code>docs/BABYTALK.md</code>). <code>public/app-icon.png</code> on every slide
        (top-right). PNGs must be fully on disk (not iCloud-only placeholders).
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
                ref={(node) => {
                  capturePreviewRefs.current[i] = node;
                }}
                style={{
                  width: W,
                  height: H,
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
              >
                <SlideCanvas slide={slide} cW={W} cH={H} />
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: "#475569" }}>
              {String(i + 1).padStart(2, "0")} · {slide.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
