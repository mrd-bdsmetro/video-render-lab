import React from "react";
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BE, Camera, Defs, Grain, P } from "./collage";
import { BEATS, META } from "./beats";
import { NARRATION } from "./narration.mjs";
import { Sfx } from "./Sfx";
import { BEAT_FRAMES, BEAT_START, TOTAL_FRAMES, VO_LEAD, cuesFor, voFrames } from "./timing";

export const HS_FRAMES = TOTAL_FRAMES;

const Captions: React.FC<{ beat: number }> = ({ beat }) => {
  const f = useCurrentFrame();
  const cues = cuesFor(beat);
  // beat 10 shows its last sentence (the disclaimer) as a taped strip instead
  const shown = beat === 9 ? cues.slice(0, -1) : cues;
  const cue = shown.find((c) => f >= c.from && f < c.to + 2);
  if (!cue) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, display: "flex", justifyContent: "center", zIndex: 60 }}>
      <div style={{ maxWidth: 1780, padding: "12px 34px 14px", background: P.charcoal, color: P.paper, fontFamily: BE, fontWeight: 800, fontSize: 40, lineHeight: 1.25, textAlign: "center", transform: "rotate(-0.4deg)", boxShadow: "5px 6px 0 rgba(0,0,0,0.3)" }}>{cue.text}</div>
    </div>
  );
};

const Footer: React.FC<{ src?: string; disclaimer: boolean }> = ({ src, disclaimer }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, height: 40, zIndex: 60, fontFamily: BE, fontWeight: 600, fontSize: 22, color: P.paper }}>
    {src && <div style={{ position: "absolute", left: 30, background: "rgba(34,34,34,0.88)", padding: "5px 14px" }}>{src}</div>}
    {disclaimer && <div style={{ position: "absolute", right: 30, background: "rgba(34,34,34,0.88)", padding: "5px 14px" }}>Thông tin tham khảo, không phải tư vấn pháp lý</div>}
  </div>
);

const Beat: React.FC<{ i: number }> = ({ i }) => {
  const Body = BEATS[i];
  const m = META[i];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Defs />
      <Camera kind={m.cam} frames={BEAT_FRAMES[i]} origin={m.origin}>
        <Body />
      </Camera>
      <Grain />
      <Captions beat={i} />
      <Footer src={m.src} disclaimer={i !== 9} />
    </div>
  );
};

// Music ducks to a low level while narration plays, with short ramps.
const musicVolume = (f: number) => {
  let duck = 1;
  for (let i = 0; i < NARRATION.length; i++) {
    const a = BEAT_START[i] + VO_LEAD;
    const b = a + voFrames(i);
    const d = interpolate(f, [a - 6, a, b, b + 10], [1, 0.3, 0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    duck = Math.min(duck, d);
  }
  const fade = interpolate(f, [0, 20, TOTAL_FRAMES - 45, TOTAL_FRAMES - 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return 0.55 * duck * fade;
};

export const VO_VOL = 1;

export const HsExplainerVi: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: P.paper }}>
    {NARRATION.map((n, i) => (
      <Sequence key={n.id} from={BEAT_START[i]} durationInFrames={BEAT_FRAMES[i]} layout="none">
        <Sequence from={0} durationInFrames={BEAT_FRAMES[i]}>
          <Beat i={i} />
        </Sequence>
        <Sequence from={VO_LEAD} layout="none">
          <Audio src={staticFile(`hs-explainer/vo/beat-${String(n.id).padStart(2, "0")}.mp3`)} volume={VO_VOL} />
        </Sequence>
      </Sequence>
    ))}
    <Audio src={staticFile("hs-explainer/sfx/music.wav")} volume={musicVolume} />
    <Sfx />
  </div>
);
