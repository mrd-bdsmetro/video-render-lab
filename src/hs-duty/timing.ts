import durations from "./vo-durations.json";
import { NARRATION } from "./narration.mjs";

export const FPS = 30;
export const VO_LEAD = 8; // frames of silence before each narration line
export const TAIL = 27; // frames of hold after each line (0.9 s), so viewers can read the screen

const vo = durations as Record<string, number>;

// Beat length follows the measured voice-over, so the picture never runs ahead of the narration.
export const BEAT_FRAMES = NARRATION.map((n) => VO_LEAD + Math.ceil(vo[String(n.id)] * FPS) + TAIL);
export const BEAT_START = BEAT_FRAMES.reduce<number[]>((acc, f, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + BEAT_FRAMES[i - 1]);
  return acc;
}, []);
export const TOTAL_FRAMES = BEAT_FRAMES.reduce((a, b) => a + b, 0);
