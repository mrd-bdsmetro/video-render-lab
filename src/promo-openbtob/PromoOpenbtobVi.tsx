import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, fontFamily } from "../lib/theme";
import { NARRATION } from "./narration.mjs";
import { BEAT_FRAMES, BEAT_START, TOTAL_FRAMES, VO_LEAD } from "./timing";

export const PROMO_OPENBTOB_FRAMES = TOTAL_FRAMES;

// Real captures of openbtob.com/hs (see public/promo-openbtob/). No prices or rates are on screen.
const HOME = staticFile("promo-openbtob/hs-home.png");
const RESULT = staticFile("promo-openbtob/hs-result.png");

type Beat = {
  shot: string;
  headline: string;
  zoom: boolean;
  highlight?: { left: number; top: number; width: number; height: number };
};

// Screenshot coordinates are 1:1 with the 1920x1080 frame, so highlights line up with the page.
const BEATS: Beat[] = [
  { shot: HOME, headline: "Tra mã HS miễn phí", zoom: true },
  { shot: RESULT, headline: "Gõ tên hàng, nhận mã", zoom: true },
  { shot: RESULT, headline: "6 số đầu: mã quốc tế", zoom: false, highlight: { left: 626, top: 226, width: 64, height: 26 } },
  { shot: RESULT, headline: "Không cần đăng ký", zoom: true },
  { shot: HOME, headline: "Thử ngay: openbtob.com/hs", zoom: true },
];

const Beat: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const b = BEATS[i];
  const n = NARRATION[i];
  const dur = BEAT_FRAMES[i];
  const scale = b.zoom ? interpolate(f, [0, dur], [1, 1.07], { extrapolateRight: "clamp" }) : 1;
  const enter = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const hl = b.highlight && interpolate(f, [VO_LEAD, VO_LEAD + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden", fontFamily }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "640px 300px" }}>
        <Img src={b.shot} style={{ width: 1920, height: 1080 }} />
      </AbsoluteFill>
      {b.highlight && hl !== undefined && (
        <div
          style={{
            position: "absolute",
            ...b.highlight,
            border: `5px solid ${C.accent}`,
            borderRadius: 6,
            boxShadow: `0 0 0 ${Math.round(hl * 10)}px rgba(255,105,0,0.25)`,
            opacity: hl,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 600,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 16}px)`,
          background: C.brand,
          color: "#fff",
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.15,
          padding: "16px 34px 20px",
          borderRadius: 8,
          boxShadow: "0 8px 0 rgba(0,0,0,0.18)",
        }}
      >
        {b.headline}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 56,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 1640,
            padding: "14px 34px 16px",
            background: C.text,
            color: "#fff",
            fontWeight: 600,
            fontSize: 40,
            lineHeight: 1.25,
            textAlign: "center",
            borderRadius: 6,
          }}
        >
          {n.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PromoOpenbtobVi: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    {NARRATION.map((n, i) => (
      <Sequence key={n.id} from={BEAT_START[i]} durationInFrames={BEAT_FRAMES[i]} layout="none">
        <Sequence from={0} durationInFrames={BEAT_FRAMES[i]}>
          <Beat i={i} />
        </Sequence>
        <Sequence from={VO_LEAD} layout="none">
          <Audio src={staticFile(`promo-openbtob/vo/beat-${String(n.id).padStart(2, "0")}.mp3`)} />
        </Sequence>
      </Sequence>
    ))}
  </AbsoluteFill>
);
