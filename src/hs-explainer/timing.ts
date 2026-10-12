import durations from "./vo-durations.json";
import { NARRATION } from "./narration.mjs";

export const FPS = 30;
export const VO_LEAD = 6; // frames of silence before narration starts in each beat
export const TAIL = 10; // frames of air after narration ends
export const STEP = 2.5; // collage pieces move on a 12 fps grid inside the 30 fps timeline

const vo = durations as Record<string, number>;

// Beat length is driven by the measured narration audio.
export const BEAT_FRAMES = NARRATION.map((n) => VO_LEAD + Math.ceil(vo[String(n.id)] * FPS) + TAIL);
export const BEAT_START = BEAT_FRAMES.reduce<number[]>((acc, f, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + BEAT_FRAMES[i - 1]);
  return acc;
}, []);
export const TOTAL_FRAMES = BEAT_FRAMES.reduce((a, b) => a + b, 0);
export const voFrames = (i: number) => Math.ceil(vo[String(NARRATION[i].id)] * FPS);

// Caption cues: sentences share the narration time in proportion to their length.
export type Cue = { from: number; to: number; text: string };
export const cuesFor = (i: number): Cue[] => {
  const parts = NARRATION[i].text.split(/(?<=[.?!]) +/);
  const total = parts.reduce((a, p) => a + p.length, 0);
  let at = VO_LEAD;
  return parts.map((text) => {
    const len = Math.round((text.length / total) * voFrames(i));
    const cue = { from: at, to: at + len, text };
    at += len;
    return cue;
  });
};

// Beat-local frames of visual events. Animations and sound effects both read these.
export const B1 = { words: [6, 13, 20, 28, 36, 44], stamp: 75, form: 2, sack: 4 };
export const B2 = { clip: 6, wco: 14, flags: 22, n200: 58, n98: 104, head: 0 };
export const B3 = { cards: [8, 50, 92], ding: 104, underline: 118 };
export const B4 = { clip: 4, left: 14, right: 52, flip: 112 };
export const B5 = { tapes: [8, 48, 88], extras: [44, 84, 124], arrow: 150 };
export const B6 = { clip: 2, rows: [18, 30, 42, 54, 66, 78, 90], circle: 92, stamp: 118, magnifier: 8 };
export const B7 = { left: 10, right: 40, arrow: 95, evfta: 125, cptpp: 150 };
export const B8 = { cert: 8, seal: 78, slip: 130, head: 20 };
export const B9 = { tabs: [8, 50, 92], checks: [46, 88, 130] };
export const B10 = { browser: 8, head: 22, url: 56 };
/** Frame at which the last sentence (the disclaimer) starts in beat 10. */
export const DISCLAIMER_AT = () => cuesFor(9)[cuesFor(9).length - 1].from;
