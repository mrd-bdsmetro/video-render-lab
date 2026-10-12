import React, { createContext, useContext, useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as loadBe } from "@remotion/google-fonts/BeVietnamPro";
import { STEP } from "./timing";

type Subset = "vietnamese" | "latin" | "latin-ext";
const subsets: Subset[] = ["vietnamese", "latin", "latin-ext"];
export const ANTON = loadAnton("normal", { weights: ["400"], subsets }).fontFamily;
export const PLAYFAIR = loadPlayfair("normal", { weights: ["900"], subsets }).fontFamily;
export const SERIF = loadSerif("normal", { weights: ["400", "700"], subsets }).fontFamily;
export const BE = loadBe("normal", { weights: ["600", "800"], subsets }).fontFamily;

// newsprint-editorial palette
export const P = {
  paper: "#F1E7D0",
  rim: "#FBF6E8",
  red: "#B3261E",
  mustard: "#E0A526",
  charcoal: "#222222",
  blue: "#0B3D91",
  rust: "#B4532A",
  avocado: "#6B7F2A",
  offwhite: "#F6F1E4",
  grey: "#B9B3A6",
};

// ---------- seeded randomness and stepped time ----------
export const rnd = (seed: number) => {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

/** Frame snapped to the 12 fps stop-motion grid. */
export const useStep = () => Math.floor(useCurrentFrame() / STEP) * STEP;

/** Entrance 0 -> 1 with overshoot, evaluated on the stepped frame so pieces move like stop-motion. */
export const useEnter = (delay: number, damping = 11) => {
  const f = useStep();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, stiffness: 170, mass: 0.7 } });
};

// ---------- camera ----------
const Cam = createContext({ p: 0, kind: "static" });
export const useCam = () => useContext(Cam);

export type CamKind = "push_in" | "pull_out" | "pan" | "tilt" | "parallax" | "static";

export const Camera: React.FC<{ kind: CamKind; frames: number; origin?: string; children: React.ReactNode }> = ({ kind, frames, origin = "50% 50%", children }) => {
  const f = useCurrentFrame();
  const p = Math.min(1, f / frames);
  const e = p * p * (3 - 2 * p);
  let t = "";
  if (kind === "push_in") t = `scale(${1 + 0.07 * e})`;
  if (kind === "pull_out") t = `scale(${1.09 - 0.09 * e})`;
  if (kind === "pan") t = `scale(1.08) translateX(${(0.5 - e) * 90}px)`;
  if (kind === "tilt") t = `scale(1.06) translateY(${(0.5 - e) * 70}px)`;
  return (
    <Cam.Provider value={{ p: e, kind }}>
      <div style={{ position: "absolute", inset: 0, transform: t, transformOrigin: origin }}>{children}</div>
    </Cam.Provider>
  );
};

/** Parallax layer: translates by depth when the camera kind is parallax. */
export const Layer: React.FC<{ depth: number; children: React.ReactNode }> = ({ depth, children }) => {
  const { p, kind } = useCam();
  const x = kind === "parallax" ? (0.5 - p) * 130 * depth : 0;
  return <div style={{ position: "absolute", inset: 0, transform: `translateX(${x}px)` }}>{children}</div>;
};

// ---------- paper ----------
const tornPoints = (w: number, h: number, seed: number, amp: number, edges: string) => {
  const r = rnd(seed);
  const pts: [number, number][] = [];
  const step = 15;
  const j = (on: boolean) => (on ? (r() - 0.5) * 2 * amp : (r() - 0.5) * 0.8);
  for (let x = 0; x <= w; x += step) pts.push([x, j(edges.includes("t"))]);
  for (let y = step; y <= h; y += step) pts.push([w + j(edges.includes("r")), y]);
  for (let x = w - step; x >= 0; x -= step) pts.push([x, h + j(edges.includes("b"))]);
  for (let y = h - step; y > 0; y -= step) pts.push([j(edges.includes("l")), y]);
  return pts;
};
const poly = (pts: [number, number][]) => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})`;

const SHADOW = "drop-shadow(4px 6px 0 rgba(0,0,0,0.26)) drop-shadow(0 12px 14px rgba(0,0,0,0.20))";

type Enter = "pop" | "left" | "right" | "drop" | "up" | "none";

const enterTransform = (enter: Enter, e: number, x: number, y: number, w: number, h: number) => {
  let tx = 0, ty = 0, sc = 1, rr = 0;
  if (enter === "pop") { sc = e; rr = (1 - e) * -14; }
  if (enter === "left") tx = (1 - e) * -(x + w + 200);
  if (enter === "right") tx = (1 - e) * (1920 - x + 200);
  if (enter === "drop") ty = (1 - e) * -(y + h + 200);
  if (enter === "up") ty = (1 - e) * (1080 - y + 200);
  return { tx, ty, sc: Math.max(0.001, sc), rr };
};

export type PieceProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  color?: string;
  edge?: "torn" | "cut";
  tear?: string; // which edges are torn: subset of "trbl"
  seed?: number;
  delay?: number;
  enter?: Enter;
  wobble?: number; // degrees of stepped sway
  z?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** A cut-out piece of paper: pale torn rim, coloured sheet, drop shadow, stepped entrance and sway. */
export const Piece: React.FC<PieceProps> = ({ x, y, w, h, rot = 0, color = P.paper, edge = "torn", tear = "trbl", seed = 1, delay = 0, enter = "pop", wobble = 0, z = 1, shadow = true, style, children }) => {
  const f = useStep();
  const e = useEnter(delay);
  const { outer, inner } = useMemo(() => {
    if (edge === "cut") {
      const r = rnd(seed);
      const q = () => (r() - 0.5) * 6;
      const o: [number, number][] = [[q(), q()], [w + q(), q()], [w + q(), h + q()], [q(), h + q()]];
      return { outer: poly(o), inner: poly(o) };
    }
    const inset = tornPoints(w, h, seed + 7, 5, tear).map(([px, py]) => [px * (1 - 10 / w) + 5, py * (1 - 10 / h) + 5] as [number, number]);
    return { outer: poly(tornPoints(w, h, seed, 5, tear)), inner: poly(inset) };
  }, [w, h, seed, edge, tear]);
  const { tx, ty, sc, rr } = enterTransform(enter, e, x, y, w, h);
  const sway = wobble ? Math.sin(f * 0.35 + seed) * wobble : 0;
  const jit = Math.sin(f * 1.7 + seed * 3) * 0.35;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: z, opacity: f >= delay ? 1 : 0, transform: `translate(${tx}px,${ty}px) rotate(${rot + sway + jit + rr}deg) scale(${sc})`, filter: shadow ? SHADOW : undefined, ...style }}>
      {edge === "torn" ? (
        <>
          <div style={{ position: "absolute", inset: 0, background: P.rim, clipPath: outer }} />
          <div style={{ position: "absolute", inset: 0, background: color, clipPath: inner }} />
        </>
      ) : (
        <div style={{ position: "absolute", inset: 0, background: color, clipPath: outer }} />
      )}
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
};

/** Free-floating item (no paper) with the same stepped entrance. */
export const Pop: React.FC<{ x: number; y: number; rot?: number; delay?: number; z?: number; wobble?: number; origin?: string; from?: "pop" | "left" | "right"; style?: React.CSSProperties; children: React.ReactNode }> = ({ x, y, rot = 0, delay = 0, z = 2, wobble = 0, origin = "50% 50%", from = "pop", style, children }) => {
  const f = useStep();
  const e = useEnter(delay);
  const sway = wobble ? Math.sin(f * 0.3 + x) * wobble : 0;
  const tx = from === "left" ? (1 - e) * -1500 : from === "right" ? (1 - e) * 1500 : 0;
  const sc = from === "pop" ? Math.max(0.001, e) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: z, opacity: f >= delay ? 1 : 0, transformOrigin: origin, transform: `translateX(${tx}px) rotate(${rot + sway}deg) scale(${sc})`, filter: SHADOW, ...style }}>{children}</div>
  );
};

// ---------- small pieces ----------
export const Tape: React.FC<{ x: number; y: number; rot?: number; w?: number; color?: string; delay?: number; z?: number }> = ({ x, y, rot = -6, w = 150, color = "rgba(240,214,120,0.8)", delay = 0, z = 6 }) => {
  const f = useStep();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 44, zIndex: z, opacity: f >= delay ? 1 : 0, transform: `rotate(${rot}deg)`, background: color, mixBlendMode: "multiply", clipPath: "polygon(0 8%,2% 0,4% 10%,6% 0,100% 0,98% 25%,100% 50%,98% 75%,100% 100%,6% 100%,3% 88%,1% 100%,0 90%,2% 50%)" }} />
  );
};

export const Halftone: React.FC<{ x: number; y: number; w: number; h: number; color?: string; dot?: number; dir?: string; opacity?: number; pulse?: boolean; rot?: number; round?: boolean; z?: number }> = ({ x, y, w, h, color = P.charcoal, dot = 14, dir = "to bottom right", opacity = 0.5, pulse = false, rot = 0, round = false, z = 0 }) => {
  const f = useStep();
  const s = pulse ? 1 + Math.sin(f * 0.22) * 0.12 : 1;
  const mask = round ? "radial-gradient(circle, #000 15%, transparent 72%)" : `linear-gradient(${dir}, #000, transparent 85%)`;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: z, opacity, transform: `rotate(${rot}deg) scale(${s})`, backgroundImage: `radial-gradient(circle, ${color} 36%, transparent 40%)`, backgroundSize: `${dot}px ${dot}px`, WebkitMaskImage: mask, maskImage: mask }} />
  );
};

/** Greeked newspaper text: bars standing in for columns of small type. */
export const Greek: React.FC<{ w: number; lines: number; seed?: number; color?: string; gap?: number; bar?: number }> = ({ w, lines, seed = 3, color = "rgba(34,34,34,0.55)", gap = 13, bar = 5 }) => {
  const r = rnd(seed);
  return (
    <div style={{ width: w }}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} style={{ height: bar, marginBottom: gap, background: color, width: `${i % 7 === 6 ? 45 : 82 + r() * 18}%`, borderRadius: 2 }} />
      ))}
    </div>
  );
};

/** Text width estimate for Anton-style condensed caps. */
export const textW = (t: string, size: number, k = 0.5) => t.length * size * k + size * 0.5;

export const Strip: React.FC<{ text: string; x: number; y: number; size: number; rot?: number; bg?: string; fg?: string; delay?: number; font?: string; seed?: number; enter?: Enter; z?: number; k?: number; wobble?: number }> = ({ text, x, y, size, rot = 0, bg = P.paper, fg = P.charcoal, delay = 0, font = ANTON, seed = 1, enter = "pop", z = 3, k = 0.5, wobble = 0 }) => {
  const w = textW(text, size, k);
  const h = size * 1.28;
  return (
    <Piece x={x} y={y} w={w} h={h} rot={rot} color={bg} seed={seed} delay={delay} enter={enter} z={z} wobble={wobble} edge={seed % 2 ? "torn" : "cut"} tear="tb">
      <div style={{ width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, fontSize: size, color: fg, whiteSpace: "nowrap", lineHeight: 1, letterSpacing: font === ANTON ? 1 : 0, textTransform: "uppercase" }}>{text}</div>
    </Piece>
  );
};

type WordStyle = { bg: string; fg: string; font?: string };

/** Lays out words as ransom strips on one row. */
export const Words: React.FC<{ words: string[]; x: number; y: number; size: number; delay: number; step: number; gap?: number; seed?: number; styles?: WordStyle[]; rots?: number[]; k?: number }> = ({ words, x, y, size, delay, step, gap = 14, seed = 1, styles, rots = [-3, 2, -2, 3, -1, 2], k = 0.5 }) => {
  const defs: WordStyle[] = styles ?? [{ bg: P.charcoal, fg: P.paper }, { bg: P.paper, fg: P.charcoal }, { bg: P.red, fg: P.paper }, { bg: P.paper, fg: P.red, font: PLAYFAIR }, { bg: P.charcoal, fg: P.mustard }];
  let cx = x;
  return (
    <>
      {words.map((wd, i) => {
        const d = defs[i % defs.length];
        const font = d.font ?? ANTON;
        const kk = font === PLAYFAIR ? 0.62 : k;
        const node = <Strip key={i} text={wd} x={cx} y={y + (i % 2) * 6} size={size} rot={rots[i % rots.length]} bg={d.bg} fg={d.fg} font={font} delay={delay + i * step} seed={seed + i} k={kk} />;
        cx += textW(wd, size, kk) + gap;
        return node;
      })}
    </>
  );
};

/** Rough-edged rubber stamp. */
export const Stamp: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; rot?: number; delay?: number; ring?: boolean; w?: number; sub?: string }> = ({ x, y, text, size = 64, color = P.red, rot = -8, delay = 0, ring = false, w, sub }) => {
  const f = useStep();
  const t = f - delay;
  const s = t < 0 ? 0.001 : t < 5 ? 1.7 - 0.14 * t : 1;
  const bw = w ?? textW(text, size, 0.52) + 50;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 9, opacity: t < 0 ? 0 : Math.min(0.92, 0.5 + t * 0.15), transform: `rotate(${rot}deg) scale(${s})`, filter: "url(#rough)" }}>
      {ring ? (
        <div style={{ width: bw, height: bw, borderRadius: "50%", border: `8px double ${color}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color, fontFamily: ANTON, fontSize: size, textAlign: "center", lineHeight: 1.05, textTransform: "uppercase" }}>
          <span>{text}</span>
          {sub && <span style={{ fontSize: size * 0.4, fontFamily: BE, fontWeight: 800 }}>{sub}</span>}
        </div>
      ) : (
        <div style={{ width: bw, border: `8px solid ${color}`, padding: "4px 14px", color, fontFamily: ANTON, fontSize: size, textAlign: "center", textTransform: "uppercase", whiteSpace: "nowrap", lineHeight: 1.15, borderRadius: 6, boxSizing: "border-box" }}>{text}</div>
      )}
    </div>
  );
};

/** Defs for the rough ink filter. Render once per beat. */
export const Defs: React.FC = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5" result="d" />
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="9" result="g" />
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.45" result="m" />
        <feComposite in="d" in2="m" operator="in" />
      </filter>
    </defs>
  </svg>
);

/** Paper grain over everything: fractal noise, multiplied. */
export const Grain: React.FC = () => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, zIndex: 50, mixBlendMode: "multiply", opacity: 0.7, pointerEvents: "none" }}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0.55 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" opacity="0.14" />
  </svg>
);

export const Fill: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <div style={{ position: "absolute", inset: 0, background: color, overflow: "hidden" }}>{children}</div>
);

/** Scattered scraps of paper in palette colours. */
export const Scraps: React.FC<{ seed: number; n: number; colors?: string[]; area?: [number, number, number, number]; z?: number; wobble?: number }> = ({ seed, n, colors = [P.paper, P.red, P.mustard, P.charcoal], area = [0, 0, 1920, 900], z = 0, wobble = 0 }) => {
  const r = rnd(seed);
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const w = 40 + r() * 90, h = 30 + r() * 70;
        return <Piece key={i} x={area[0] + r() * (area[2] - w)} y={area[1] + r() * (area[3] - h)} w={w} h={h} rot={r() * 80 - 40} color={colors[i % colors.length]} seed={seed + i} delay={Math.floor(r() * 25)} z={z} wobble={wobble} edge={i % 2 ? "torn" : "cut"} />;
      })}
    </>
  );
};

/** Paper arrow (points right), cut with scissors. */
export const Arrow: React.FC<{ x: number; y: number; w: number; h: number; color: string; rot?: number; delay?: number; z?: number; enter?: Enter }> = ({ x, y, w, h, color, rot = 0, delay = 0, z = 4, enter = "pop" }) => {
  const f = useStep();
  const e = useEnter(delay);
  const { tx, ty, sc, rr } = enterTransform(enter, e, x, y, w, h);
  const hd = Math.min(h * 0.9, w * 0.4);
  const clip = `polygon(0 28%,${w - hd}px 28%,${w - hd}px 0,${w}px 50%,${w - hd}px 100%,${w - hd}px 72%,0 72%)`;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: z, opacity: f >= delay ? 1 : 0, transform: `translate(${tx}px,${ty}px) rotate(${rot + rr}deg) scale(${sc})`, filter: SHADOW }}>
      <div style={{ position: "absolute", inset: 0, background: color, clipPath: clip }} />
    </div>
  );
};
