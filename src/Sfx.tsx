import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { BUYERS, CHAT, CTA, HS, Q, SCENE_START } from "./lib/timing";

type Ev = { at: number; src: string; vol: number; lead?: number };

const abs = (scene: keyof typeof SCENE_START, local: number) => SCENE_START[scene] + local;

// Every event frame comes from lib/timing.ts, the same constants the animations use.
const events: Ev[] = [
  // Scene 1: sack, arrows, regions, question marks
  { at: abs("q", Q.sack), src: "whoosh-short", vol: 0.35 },
  { at: abs("q", Q.arrowUs), src: "whoosh-short", vol: 0.25 },
  { at: abs("q", Q.arrowEu), src: "whoosh-short", vol: 0.25 },
  { at: abs("q", Q.us), src: "pop", vol: 0.4 },
  { at: abs("q", Q.eu), src: "pop", vol: 0.4 },
  { at: abs("q", Q.marks[0]), src: "boom", vol: 0.55 },
  ...Q.marks.slice(1).map((m) => ({ at: abs("q", m), src: "pop", vol: 0.3 })),

  // Scene transitions
  { at: SCENE_START.hs, src: "whoosh", vol: 0.45, lead: 5 },
  { at: SCENE_START.buyers, src: "whoosh", vol: 0.4, lead: 5 },
  { at: SCENE_START.chat, src: "whoosh", vol: 0.45, lead: 5 },
  { at: SCENE_START.cta, src: "whoosh", vol: 0.4, lead: 5 },

  // Scene 2: type-in, click, screenshot swaps, callouts
  ...[1, 2, 3, 4].map((i) => ({ at: abs("hs", HS.typeStart + HS.typeStep * i), src: "tick", vol: 0.5 })),
  { at: abs("hs", HS.click + 3), src: "click", vol: 0.5 },
  { at: abs("hs", HS.swapList), src: "whoosh-short", vol: 0.3 },
  { at: abs("hs", HS.swapUs), src: "whoosh-short", vol: 0.3 },
  { at: abs("hs", HS.swapEu), src: "whoosh-short", vol: 0.3 },
  ...[HS.popCode, HS.popSubCode, HS.popFree, HS.popDate, HS.popSource, HS.popEu, HS.popEuDate].map((f) => ({
    at: abs("hs", f),
    src: "pop",
    vol: 0.35,
  })),

  // Scene 3: callouts and company swap
  ...[BUYERS.popCount, BUYERS.popRows, BUYERS.popMeta, BUYERS.popTop, BUYERS.popSuppliers].map((f) => ({
    at: abs("buyers", f),
    src: "pop",
    vol: 0.35,
  })),
  { at: abs("buyers", BUYERS.swapCompany), src: "whoosh-short", vol: 0.3 },

  // Scene 4: chat
  { at: abs("chat", CHAT.send), src: "send", vol: 0.4 },
  { at: abs("chat", CHAT.answer), src: "msg", vol: 0.5 },
  { at: abs("chat", CHAT.chips), src: "pop", vol: 0.3 },

  // Scene 5: button + chime
  { at: abs("cta", CTA.button), src: "chime", vol: 0.5 },
  { at: abs("cta", CTA.button), src: "click", vol: 0.35 },
];

export const Sfx: React.FC = () => (
  <>
    {events.map((e, i) => (
      <Sequence key={i} from={Math.max(0, e.at - (e.lead ?? 0))} layout="none">
        <Audio src={staticFile(`sfx/${e.src}.wav`)} volume={e.vol} />
      </Sequence>
    ))}
  </>
);
