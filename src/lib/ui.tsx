import React, { createContext, useContext } from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, fontFamily } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Backdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      fontFamily,
      color: C.text,
      background: `radial-gradient(1200px 700px at 85% -10%, ${C.tint} 0%, transparent 60%), ${C.bg}`,
    }}
  >
    {children}
  </div>
);

export const useIn = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

export const Headline: React.FC<{
  text: string;
  sub?: string;
  delay?: number;
  subDelay?: number;
  size?: number;
}> = ({ text, sub, delay = 0, subDelay = 25, size = 62 }) => {
  const a = useIn(delay);
  const b = useIn(subDelay);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 44, textAlign: "center", padding: "0 120px" }}>
      <div
        style={{
          fontSize: size,
          fontWeight: 800,
          lineHeight: 1.15,
          opacity: a,
          transform: `translateY(${(1 - a) * 30}px)`,
        }}
      >
        {text}
      </div>
      {sub ? (
        <div
          style={{
            marginTop: 12,
            fontSize: 34,
            fontWeight: 600,
            color: C.brand,
            opacity: b,
            transform: `translateY(${(1 - b) * 20}px)`,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

export const Disclaimer: React.FC<{ from: number }> = ({ from }) => {
  const a = useIn(from);
  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        bottom: 24,
        padding: "10px 18px",
        borderRadius: 10,
        background: "rgba(23,23,23,0.9)",
        color: "#fff",
        fontSize: 22,
        fontWeight: 600,
        opacity: a,
      }}
    >
      Số liệu ước tính, không phải tư vấn pháp lý.
    </div>
  );
};

// ---- Browser frame with Ken Burns pan/zoom over 1920x1080 screenshots ----

const ScaleCtx = createContext(1);
export const useShotScale = () => useContext(ScaleCtx);

// Horizontal crop of the 1920px screenshots: the pages are a centred column, so the
// frame shows x = CROP_X .. CROP_X + CROP_W and the full page width (header button included).
const CROP_X = 340;
const CROP_W = 1240;

export type Focus = { f: number; x: number; y: number; z: number };

export const BrowserShot: React.FC<{
  width?: number;
  focus: Focus[];
  url: string;
  top?: number;
  children: React.ReactNode;
}> = ({ width = 1400, focus, url, top = 215, children }) => {
  const frame = useCurrentFrame();
  const vw = width;
  const vh = Math.round((width * 9) / 16);
  const frames = focus.map((k) => k.f);
  const ease = { easing: (t: number) => t * t * (3 - 2 * t), ...clamp };
  const fx = interpolate(frame, frames, focus.map((k) => k.x), ease);
  const fy = interpolate(frame, frames, focus.map((k) => k.y), ease);
  const z = interpolate(frame, frames, focus.map((k) => k.z), ease);
  const s = (vw / CROP_W) * z;
  const tx = Math.min(-CROP_X * s, Math.max(vw - (CROP_X + CROP_W) * s, vw / 2 - fx * s));
  const ty = Math.min(0, Math.max(vh - 1080 * s, vh / 2 - fy * s));
  const enter = useIn(0);
  return (
    <div
      style={{
        position: "absolute",
        left: (1920 - vw) / 2,
        top,
        width: vw,
        borderRadius: 18,
        overflow: "hidden",
        background: C.card,
        border: `1px solid ${C.line}`,
        boxShadow: "0 40px 90px rgba(23,23,23,0.22), 0 0 0 1px rgba(202,53,0,0.08)",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 60}px) scale(${0.96 + 0.04 * enter})`,
      }}
    >
      <div style={{ height: 44, background: "#f1f1f1", display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
        ))}
        <div
          style={{
            marginLeft: 18,
            flex: 1,
            height: 28,
            borderRadius: 14,
            background: "#fff",
            fontSize: 17,
            color: C.muted,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ position: "relative", width: vw, height: vh, overflow: "hidden" }}>
        <ScaleCtx.Provider value={s}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              transformOrigin: "0 0",
              transform: `translate(${tx}px, ${ty}px) scale(${s})`,
            }}
          >
            {children}
          </div>
        </ScaleCtx.Provider>
      </div>
    </div>
  );
};

// A screenshot layer that fades in at `from` and (optionally) out at `to`.
export const Shot: React.FC<{ file: string; from?: number; to?: number; fade?: number }> = ({
  file,
  from = 0,
  to = 100000,
  fade = 12,
}) => {
  const frame = useCurrentFrame();
  const inn = from === 0 ? 1 : interpolate(frame, [from, from + fade], [0, 1], clamp);
  const out = interpolate(frame, [to - fade, to], [1, 0], clamp);
  return (
    <Img
      src={staticFile(`shots/${file}`)}
      style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: Math.min(inn, out) }}
    />
  );
};

// Orange highlight box (image coordinates) with optional label.
export const Highlight: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  from: number;
  to?: number;
  label?: string;
  labelSide?: "top" | "bottom" | "left";
}> = ({ x, y, w, h, from, to = 100000, label, labelSide = "top" }) => {
  const frame = useCurrentFrame();
  const s = useShotScale();
  const a = useIn(from, 14);
  const out = interpolate(frame, [to - 8, to], [1, 0], clamp);
  const o = a * out;
  const k = 1 / s; // keep on-screen sizes constant under zoom
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o }}>
      <div
        style={{
          position: "absolute",
          inset: -6 * k,
          border: `${5 * k}px solid ${C.accent}`,
          borderRadius: 10 * k,
          background: "rgba(255,105,0,0.12)",
          boxShadow: `0 0 ${(18 + 14 * pulse) * k}px rgba(255,105,0,0.65)`,
          transform: `scale(${1.08 - 0.08 * a})`,
        }}
      />
      {label ? (
        <div
          style={{
            position: "absolute",
            ...(labelSide === "left"
              ? { right: w + 16 * k, top: "50%", transform: "translateY(-50%)" }
              : { left: 0, [labelSide === "top" ? "bottom" : "top"]: h + 16 * k }),
            whiteSpace: "nowrap",
            background: C.brand,
            color: "#fff",
            fontSize: 26 * k,
            fontWeight: 800,
            padding: `${6 * k}px ${16 * k}px`,
            borderRadius: 10 * k,
            boxShadow: `0 ${6 * k}px ${16 * k}px rgba(0,0,0,0.25)`,
            fontFamily,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

export const Wordmark: React.FC<{ size: number }> = ({ size }) => (
  <span style={{ fontFamily, fontWeight: 800, fontSize: size, letterSpacing: -1 }}>
    Open<span style={{ color: C.brand }}>BtoB</span>
  </span>
);
