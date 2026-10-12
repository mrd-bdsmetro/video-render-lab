import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { B1, B10, B2, B3, B4, B5, B6, B7, B8, B9, BEAT_START, DISCLAIMER_AT } from "./timing";

type Ev = { at: number; src: string; vol: number; lead?: number };
const hs = (n: string) => `hs-explainer/sfx/${n}.wav`;
const at = (beat: number, local: number) => BEAT_START[beat - 1] + local;

// Every event frame comes from timing.ts, the same constants the animations use.
const events: Ev[] = [
  // beat transitions: existing whoosh
  ...BEAT_START.slice(1).map((s) => ({ at: s, src: "sfx/whoosh-short.wav", vol: 0.3, lead: 3 })),
  // 1
  ...B1.words.map((f) => ({ at: at(1, f), src: hs("paper-slap"), vol: 0.5 })),
  { at: at(1, B1.form), src: hs("paper-rustle"), vol: 0.5 },
  { at: at(1, B1.stamp), src: hs("stamp-thump"), vol: 0.8 },
  // 2
  { at: at(2, B2.clip), src: hs("paper-rustle"), vol: 0.5 },
  { at: at(2, B2.wco), src: hs("paper-slap"), vol: 0.5 },
  { at: at(2, B2.n200), src: "sfx/tick.wav", vol: 0.6 },
  { at: at(2, B2.n98), src: "sfx/tick.wav", vol: 0.6 },
  { at: at(2, B2.n200), src: hs("paper-slap"), vol: 0.4 },
  { at: at(2, B2.n98), src: hs("paper-slap"), vol: 0.4 },
  // 3
  ...B3.cards.map((f) => ({ at: at(3, f), src: hs("paper-slap"), vol: 0.5 })),
  { at: at(3, B3.ding), src: hs("ding"), vol: 0.55 },
  { at: at(3, B3.underline), src: hs("scribble"), vol: 0.5 },
  // 4
  { at: at(4, B4.left), src: hs("paper-slap"), vol: 0.5 },
  { at: at(4, B4.right), src: hs("paper-slap"), vol: 0.5 },
  { at: at(4, B4.flip), src: hs("paper-rustle"), vol: 0.6 },
  { at: at(4, B4.flip + 4), src: "sfx/pop.wav", vol: 0.4 },
  // 5
  ...B5.tapes.map((f) => ({ at: at(5, f), src: hs("tape-rip"), vol: 0.5 })),
  ...B5.extras.map((f) => ({ at: at(5, f), src: "sfx/pop.wav", vol: 0.4 })),
  { at: at(5, B5.arrow), src: "sfx/whoosh.wav", vol: 0.45 },
  // 6
  { at: at(6, B6.clip), src: hs("paper-slap"), vol: 0.5 },
  ...B6.rows.map((f) => ({ at: at(6, f), src: "sfx/tick.wav", vol: 0.35 })),
  { at: at(6, B6.circle), src: hs("scribble"), vol: 0.6 },
  { at: at(6, B6.stamp), src: hs("stamp-thump"), vol: 0.8 },
  // 7
  { at: at(7, B7.left), src: hs("paper-slap"), vol: 0.5 },
  { at: at(7, B7.right), src: hs("paper-slap"), vol: 0.5 },
  { at: at(7, B7.arrow), src: "sfx/whoosh-short.wav", vol: 0.35 },
  { at: at(7, B7.evfta), src: hs("stamp-thump"), vol: 0.7 },
  { at: at(7, B7.cptpp), src: hs("stamp-thump"), vol: 0.7 },
  // 8
  { at: at(8, B8.cert), src: hs("paper-slap"), vol: 0.5 },
  { at: at(8, B8.seal), src: hs("stamp-thump"), vol: 0.8 },
  { at: at(8, B8.slip), src: hs("tape-rip"), vol: 0.5 },
  { at: at(8, B8.slip + 3), src: hs("paper-slap"), vol: 0.5 },
  // 9
  ...B9.tabs.map((f) => ({ at: at(9, f), src: hs("paper-slap"), vol: 0.5 })),
  ...B9.checks.map((f) => ({ at: at(9, f), src: hs("scribble"), vol: 0.5 })),
  // 10
  { at: at(10, B10.browser), src: hs("paper-slap"), vol: 0.5 },
  { at: at(10, B10.head), src: hs("paper-slap"), vol: 0.5 },
  { at: at(10, B10.url), src: hs("ding"), vol: 0.45 },
  { at: at(10, DISCLAIMER_AT()), src: hs("tape-rip"), vol: 0.5 },
  { at: at(10, DISCLAIMER_AT() + 3), src: hs("paper-slap"), vol: 0.5 },
];

export const Sfx: React.FC = () => (
  <>
    {events.map((e, i) => (
      <Sequence key={i} from={Math.max(0, e.at - (e.lead ?? 0))} layout="none">
        <Audio src={staticFile(e.src)} volume={e.vol} />
      </Sequence>
    ))}
  </>
);
