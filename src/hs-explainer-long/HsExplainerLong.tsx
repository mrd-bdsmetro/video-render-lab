import React from "react";
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BE, Camera, Defs, Grain, P } from "../hs-explainer/collage";
import durations from "./vo-durations.json";
import { NARRATION } from "./narration.mjs";
import { SCENES, Scene } from "./scenes";

export const FPS = 30;
export const VO_LEAD = 12; // silence before narration in each beat
export const HOLD = 24; // 0.8 s held after the narration, so key beats land before the next one

const vo = durations as Record<string, number>;
const voF = (i: number) => Math.ceil((vo[String(NARRATION[i].id)] ?? 4) * FPS);
export const BEAT_FRAMES = NARRATION.map((n, i) => VO_LEAD + voF(i) + (n.kind === "chapter" ? 14 : HOLD));
export const BEAT_START = BEAT_FRAMES.reduce<number[]>((a, f, i) => (a.push(i === 0 ? 0 : a[i - 1] + BEAT_FRAMES[i - 1]), a), []);
export const HSL_FRAMES = BEAT_FRAMES.reduce((a, b) => a + b, 0);

// Captions: sentences share the narration time in proportion to their length.
const cuesFor = (i: number) => {
  const parts = NARRATION[i].text.split(/(?<=[.?!:]) +/);
  const total = parts.reduce((a, p) => a + p.length, 0);
  let at = VO_LEAD;
  return parts.map((text) => {
    const len = Math.round((text.length / total) * voF(i));
    const c = { from: at, to: at + len, text };
    at += len;
    return c;
  });
};

const Captions: React.FC<{ beat: number }> = ({ beat }) => {
  const f = useCurrentFrame();
  const cue = cuesFor(beat).find((c) => f >= c.from && f < c.to + 2);
  if (!cue || NARRATION[beat].kind === "chapter") return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, display: "flex", justifyContent: "center", zIndex: 60 }}>
      <div style={{ maxWidth: 1780, padding: "12px 34px 14px", background: P.charcoal, color: P.paper, fontFamily: BE, fontWeight: 800, fontSize: 40, lineHeight: 1.25, textAlign: "center", transform: "rotate(-0.4deg)", boxShadow: "5px 6px 0 rgba(0,0,0,0.3)" }}>{cue.text}</div>
    </div>
  );
};

const Footer: React.FC = () => (
  <div style={{ position: "absolute", right: 30, bottom: 14, zIndex: 60, fontFamily: BE, fontWeight: 600, fontSize: 22, color: P.paper, background: "rgba(34,34,34,0.88)", padding: "5px 14px" }}>Thông tin tham khảo, không phải tư vấn pháp lý</div>
);

const CAMS = ["push_in", "pan", "tilt", "parallax", "pull_out"] as const;

const Beat: React.FC<{ i: number }> = ({ i }) => {
  const n = NARRATION[i];
  const Body = SCENES[n.kind as Scene["kind"]];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Defs />
      <Camera kind={n.kind === "chapter" ? "push_in" : CAMS[i % CAMS.length]} frames={BEAT_FRAMES[i]}>
        <Body s={n as unknown as Scene} vo={voF(i)} ch={n.ch} />
      </Camera>
      <Grain />
      <Captions beat={i} />
      <Footer />
    </div>
  );
};

// Music ducks while the narration plays.
const musicVolume = (f: number) => {
  let duck = 1;
  for (let i = 0; i < NARRATION.length; i++) {
    const a = BEAT_START[i] + VO_LEAD;
    const b = a + voF(i);
    duck = Math.min(duck, interpolate(f, [a - 6, a, b, b + 10], [1, 0.3, 0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  }
  const fade = interpolate(f, [0, 30, HSL_FRAMES - 60, HSL_FRAMES - 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return 0.4 * duck * fade;
};

// Sound effects on each beat start: paper slap for scenes, stamp for chapter cards, whoosh between beats.
const SfxLong: React.FC = () => (
  <>
    {NARRATION.map((n, i) => (
      <React.Fragment key={n.id}>
        {i > 0 && (
          <Sequence from={BEAT_START[i] - 3} layout="none"><Audio src={staticFile("sfx/whoosh-short.wav")} volume={0.3} /></Sequence>
        )}
        <Sequence from={BEAT_START[i] + (n.kind === "chapter" ? 4 : 10)} layout="none">
          <Audio src={staticFile(n.kind === "chapter" ? "hs-explainer/sfx/stamp-thump.wav" : "hs-explainer/sfx/paper-slap.wav")} volume={n.kind === "chapter" ? 0.7 : 0.5} />
        </Sequence>
        {n.kind === "cards" || n.kind === "digits" || n.kind === "compare" ? (
          <Sequence from={BEAT_START[i] + 10 + Math.round(voF(i) * 0.31)} layout="none"><Audio src={staticFile("hs-explainer/sfx/paper-slap.wav")} volume={0.4} /></Sequence>
        ) : null}
        {n.kind === "url" || n.kind === "search" ? (
          <Sequence from={BEAT_START[i] + 10 + Math.round(voF(i) * 0.5)} layout="none"><Audio src={staticFile("hs-explainer/sfx/ding.wav")} volume={0.5} /></Sequence>
        ) : null}
      </React.Fragment>
    ))}
  </>
);

export const HsExplainerLong: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: P.paper }}>
    {NARRATION.map((n, i) => (
      <Sequence key={n.id} from={BEAT_START[i]} durationInFrames={BEAT_FRAMES[i]} layout="none">
        <Sequence from={0} durationInFrames={BEAT_FRAMES[i]}>
          <Beat i={i} />
        </Sequence>
        <Sequence from={VO_LEAD} layout="none">
          <Audio src={staticFile(`hs-explainer-long/vo/beat-${String(n.id).padStart(2, "0")}.mp3`)} volume={1} />
        </Sequence>
      </Sequence>
    ))}
    <Audio src={staticFile("hs-explainer/sfx/music.wav")} volume={musicVolume} loop />
    <SfxLong />
  </div>
);
