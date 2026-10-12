import { TRANSITION } from "./theme";

// Scene lengths (frames). Total = sum - 4 * TRANSITION = 900.
export const SCENE_FRAMES = { q: 135, hs: 255, buyers: 255, chat: 165, cta: 150 } as const;

// Absolute start frame of each scene inside the TransitionSeries.
const order = ["q", "hs", "buyers", "chat", "cta"] as const;
export const SCENE_START = (() => {
  const out = {} as Record<(typeof order)[number], number>;
  let at = 0;
  for (const k of order) {
    out[k] = at;
    at += SCENE_FRAMES[k] - TRANSITION;
  }
  return out;
})();

// Scene-local frames of visual events. Animations and sound effects both read these.
export const Q = { sack: 5, arrowUs: 30, arrowEu: 40, us: 40, eu: 50, marks: [70, 80, 88, 96, 104] };

export const HS = {
  typeStart: 22, // first character appears typeStep frames after this
  typeStep: 7,
  click: 58,
  swapList: 80,
  popCode: 92,
  popSubCode: 108,
  swapUs: 136,
  popFree: 150,
  popDate: 168,
  popSource: 186,
  swapEu: 202,
  popEu: 218,
  popEuDate: 236,
};

export const BUYERS = { popCount: 30, popRows: 60, swapCompany: 126, popMeta: 150, popTop: 185, popSuppliers: 215 };

export const CHAT = { send: 20, dots: 55, answer: 88, chips: 115 };

export const CTA = { logo: 0, url: 25, button: 45, note: 62 };
