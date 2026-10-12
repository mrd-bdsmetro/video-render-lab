import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { V, fontFamily } from "./theme";

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
export const outCubic = Easing.out(Easing.cubic);
export const outQuart = Easing.out(Easing.quad);

/** 0..1 progress of an animation that starts at `at` and lasts `dur` frames, eased out. */
export const useProg = (at: number, dur: number, ease: (t: number) => number = outCubic) => {
  const frame = useCurrentFrame();
  return ease(clamp01((frame - at) / dur));
};

export const fmt = (n: number, d = 1) => n.toLocaleString("vi-VN", { minimumFractionDigits: d, maximumFractionDigits: d });
export const fmtInt = (n: number) => Math.round(n).toLocaleString("vi-VN");

export const Bg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 900], [0, -60]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1400px 900px at 70% 0%, ${V.bg2} 0%, ${V.bg} 70%)`, fontFamily, color: V.text }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={0} x2={1920} y1={110 + i * 90 + (drift % 90)} y2={110 + i * 90 + (drift % 90)} stroke="#1b3159" strokeWidth={1} />
        ))}
      </svg>
      {children}
    </AbsoluteFill>
  );
};

export const Title: React.FC<{ eyebrow: string; title: string; at?: number }> = ({ eyebrow, title, at = 0 }) => {
  const p = useProg(at, 18);
  return (
    <div style={{ position: "absolute", left: 110, top: 64, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 4, color: V.accent, textTransform: "uppercase" }}>{eyebrow}</div>
      <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.15, marginTop: 6 }}>{title}</div>
    </div>
  );
};

/** On-screen source line, bottom-left, above the burned-in captions. */
export const SourceCaption: React.FC<{ text: string; at?: number }> = ({ text, at = 10 }) => {
  const p = useProg(at, 20);
  return (
    <div style={{ position: "absolute", left: 110, right: 110, bottom: 30, fontSize: 25, color: V.muted, opacity: p * 0.95, fontWeight: 400 }}>
      {text}
    </div>
  );
};
