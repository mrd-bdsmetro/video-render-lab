import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import narration from "./narration.json";
import * as TM from "./timing";
import { SceneId } from "./timing";

type Ev = { at: number; src: string; vol: number; lead?: number };
const abs = (id: SceneId, local: number) => TM.SCENE_START[id] + local;

// Every event frame comes from timing.ts, the same constants the animations read.
const events: Ev[] = [
  // scene changes
  ...TM.ORDER.slice(1).map((id) => ({ at: TM.SCENE_START[id], src: "whoosh-short", vol: 0.22, lead: 4 })),

  // hook
  { at: abs("hook", TM.HOOK.bigNumber - 6), src: "whoosh-short", vol: 0.25 },
  { at: abs("hook", TM.HOOK.bigNumber), src: "boom", vol: 0.38 },

  // record
  { at: abs("record", TM.RECORD.exportBar), src: "vn-bar", vol: 0.5 },
  { at: abs("record", TM.RECORD.importBar), src: "vn-bar", vol: 0.45 },
  { at: abs("record", TM.RECORD.balance), src: "vn-ping", vol: 0.35 },

  // products: one thump per bar
  ...Array.from({ length: 8 }, (_, i) => ({ at: abs("products", TM.PRODUCTS.bar(i)), src: "vn-bar", vol: i === 0 ? 0.55 : 0.4 })),
  { at: abs("products", TM.PRODUCTS.hundred), src: "vn-ping", vol: 0.3 },

  // markets: sweep on launch, ping on arrival
  { at: abs("markets", TM.MARKETS.vietnam), src: "pop", vol: 0.3 },
  ...TM.MARKETS.arc.flatMap((a) => [
    { at: abs("markets", a), src: "vn-sweep", vol: 0.3 },
    { at: abs("markets", a + TM.MARKETS.arcDur - 2), src: "vn-ping", vol: 0.3 },
  ]),

  // coffee
  ...TM.COFFEE.tiles.map((f) => ({ at: abs("coffee", f), src: "pop", vol: 0.3 })),
  { at: abs("coffee", TM.COFFEE.cup), src: "whoosh-short", vol: 0.2 },
  { at: abs("coffee", TM.COFFEE.rank2), src: "chime", vol: 0.3 },
  { at: abs("coffee", TM.COFFEE.rank1), src: "chime", vol: 0.3 },
  { at: abs("coffee", TM.COFFEE.hs), src: "click", vol: 0.35 },

  // insight
  { at: abs("insight", TM.INSIGHT.bar + 6), src: "vn-sweep", vol: 0.25 },
  ...Array.from({ length: 6 }, (_, i) => ({ at: abs("insight", TM.INSIGHT.chips(i)), src: "pop", vol: 0.28 })),

  // end card
  { at: abs("cta", TM.CTA.url), src: "whoosh-short", vol: 0.25 },
  { at: abs("cta", TM.CTA.button), src: "chime", vol: 0.4 },
  { at: abs("cta", TM.CTA.button), src: "click", vol: 0.3 },
];

const voiceSpans = TM.ORDER.map((id) => ({ from: TM.SCENE_START[id] + TM.VO_DELAY, to: TM.SCENE_START[id] + TM.VO_DELAY + TM.VO_FRAMES[id] }));
void narration;

// Bed level: ducked while any narration clip plays, with short ramps.
const BED = 0.2;
const DUCK = 0.085;
const bedVolume = (f: number) => {
  let duck = 0;
  for (const s of voiceSpans) {
    const d = interpolate(f, [s.from - 8, s.from + 6, s.to - 4, s.to + 14], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    duck = Math.max(duck, d);
  }
  return interpolate(duck, [0, 1], [BED, DUCK]);
};

export const VnSfx: React.FC = () => (
  <>
    <Audio src={staticFile("sfx/bed-vn.wav")} volume={bedVolume} />
    {TM.ORDER.map((id) => (
      <Sequence key={id} from={TM.SCENE_START[id] + TM.VO_DELAY} layout="none">
        <Audio src={staticFile(`vn-trade/vo/${id}.mp3`)} volume={1} />
      </Sequence>
    ))}
    {events.map((e, i) => (
      <Sequence key={i} from={Math.max(0, e.at - (e.lead ?? 0))} layout="none">
        <Audio src={staticFile(`sfx/${e.src}.wav`)} volume={e.vol} />
      </Sequence>
    ))}
  </>
);
