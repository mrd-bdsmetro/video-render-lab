import timing from "./vo-timing.json";
import narration from "./narration.json";

export const FPS = 30;
export const TRANSITION = 12;
export const VO_DELAY = 18; // frames of silence before the voice starts (>= TRANSITION so it never talks over a cross-fade)
export const TAIL = 36; // frames after the voice ends: 12 of cross-fade plus a 0.8 s hold before the next scene starts to move

export const ORDER = ["hook", "record", "products", "markets", "coffee", "insight", "cta"] as const;
export type SceneId = (typeof ORDER)[number];

type Timing = Record<string, { duration: number; lines: { start: number; end: number }[] }>;
const T = timing as Timing;

// Scene lengths come from the measured clip durations (scripts/make-vo.mjs -> vo-timing.json).
export const VO_FRAMES = Object.fromEntries(ORDER.map((id) => [id, Math.ceil(T[id].duration * FPS)])) as Record<SceneId, number>;
export const SCENE_FRAMES = Object.fromEntries(ORDER.map((id) => [id, VO_DELAY + VO_FRAMES[id] + TAIL])) as Record<SceneId, number>;

export const SCENE_START = (() => {
  const out = {} as Record<SceneId, number>;
  let at = 0;
  for (const id of ORDER) {
    out[id] = at;
    at += SCENE_FRAMES[id] - TRANSITION;
  }
  return out;
})();

export const TOTAL_FRAMES = ORDER.reduce((a, id) => a + SCENE_FRAMES[id], 0) - (ORDER.length - 1) * TRANSITION;

/** Scene-local frame at `frac` (0..1) of narration line `i`. Animations and sound effects both read this. */
export const L = (id: SceneId, i: number, frac = 0): number => {
  const l = T[id].lines[i];
  return VO_DELAY + Math.round((l.start + frac * (l.end - l.start)) * FPS);
};

/** Scene-local frame at fraction `frac` of the whole voice clip. */
export const F = (id: SceneId, frac: number): number => VO_DELAY + Math.round(frac * VO_FRAMES[id]);

// ---- Visual events (scene-local frames) ----
export const HOOK = { perSec: 4, bigNumber: L("hook", 1, 0), bigDone: L("hook", 1, 0.85) };

export const RECORD = { exportBar: 8, importBar: 40, balance: 78, growthChip: L("record", 0, 0.2) };

export const PRODUCTS = {
  first: L("products", 0, 0.05),
  hundred: L("products", 0, 0.75),
  // bars 1..7 spread across the second line
  bar: (i: number) => (i === 0 ? L("products", 0, 0.05) : L("products", 1, 0.02 + ((i - 1) / 6) * 0.72)),
};

export const MARKETS = {
  map: 0,
  vietnam: 6,
  arc: [L("markets", 0, 0.1), L("markets", 1, 0.08), L("markets", 1, 0.42), L("markets", 1, 0.72)] as const,
  arcDur: 34,
};

export const COFFEE = {
  title: 4,
  cup: 4,
  tiles: [L("coffee", 1, 0.05), L("coffee", 1, 0.4), L("coffee", 1, 0.72)] as const,
  rank2: L("coffee", 2, 0.5),
  rank1: L("coffee", 2, 0.82),
  hs: L("coffee", 3, 0.0),
};

export const INSIGHT = { bar: L("insight", 0, 0.0), chips: (i: number) => L("insight", 1, 0.05 + i * 0.13) };

export const CTA = { logo: 4, url: L("cta", 1, 0.0), button: L("cta", 1, 0.55) };

// ---- Narration lines for captions (absolute composition frames) ----
export type CaptionCue = { from: number; to: number; text: string };
export const CAPTIONS: CaptionCue[] = narration.scenes.flatMap((s) => {
  const id = s.id as SceneId;
  return s.lines.map((line, i) => {
    const l = T[id].lines[i];
    return {
      from: SCENE_START[id] + VO_DELAY + Math.round(l.start * FPS),
      to: SCENE_START[id] + VO_DELAY + Math.round(l.end * FPS) + 6,
      text: line.text,
    };
  });
});
