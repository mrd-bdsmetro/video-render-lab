import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, fontFamily } from "../lib/theme";
import { NARRATION } from "./narration.mjs";
import { BEAT_FRAMES, BEAT_START, TOTAL_FRAMES, VO_LEAD } from "./timing";

export const HS_DUTY_FRAMES = TOTAL_FRAMES;

// Real captures of openbtob.com/hs at 1920x1080 (see docs/hs-duty-vi-script.md for the exact URLs).
// The only duty figure on screen is the one the live page shows; no figure is written in overlays.
const HOME = staticFile("hs-duty/home.png");
const TYPED = staticFile("hs-duty/typed.png");
const RESULT = staticFile("hs-duty/result.png");
const TARIFF = staticFile("hs-duty/tariff.png");

type Box = { left: number; top: number; width: number; height: number };
type Beat = {
  shot: string;
  headline: string;
  focus: { x: number; y: number }; // screenshot pixel kept at the frame centre
  zoom: [number, number]; // scale at beat start and end
  highlight?: Box; // screenshot pixels, drawn inside the zoomed layer so it stays on the element
};

// Coordinates are screenshot pixels (1920x1080 images).
const BEATS: Beat[] = [
  { shot: HOME, headline: "Mã HS và thuế, trong vài giây", focus: { x: 960, y: 300 }, zoom: [1, 1.12] },
  { shot: TYPED, headline: "Gõ tên hàng bằng tiếng Việt", focus: { x: 851, y: 144 }, zoom: [1.6, 1.75], highlight: { left: 615, top: 126, width: 473, height: 36 } },
  { shot: RESULT, headline: "Danh sách mã hiện ngay", focus: { x: 960, y: 330 }, zoom: [1.35, 1.45] },
  { shot: RESULT, headline: "0901 21: cà phê đã rang", focus: { x: 960, y: 220 }, zoom: [1.8, 1.9], highlight: { left: 616, top: 205, width: 689, height: 31 } },
  { shot: RESULT, headline: "6 số đầu: mã quốc tế", focus: { x: 700, y: 220 }, zoom: [2, 2.15], highlight: { left: 616, top: 205, width: 84, height: 31 } },
  { shot: TARIFF, headline: "Việt Nam dùng 8 số", focus: { x: 900, y: 240 }, zoom: [1.8, 1.9], highlight: { left: 630, top: 188, width: 140, height: 48 } },
  { shot: TARIFF, headline: "Thuế nhập khẩu MFN", focus: { x: 700, y: 253 }, zoom: [2.2, 2.35], highlight: { left: 630, top: 238, width: 64, height: 30 } },
  { shot: TARIFF, headline: "Còn tùy xuất xứ", focus: { x: 860, y: 297 }, zoom: [1.9, 2], highlight: { left: 632, top: 288, width: 458, height: 18 } },
  { shot: TARIFF, headline: "Ước tính, cần xác nhận", focus: { x: 800, y: 281 }, zoom: [1.9, 2], highlight: { left: 632, top: 273, width: 290, height: 18 } },
  { shot: HOME, headline: "openbtob.com/hs", focus: { x: 960, y: 300 }, zoom: [1, 1.1] },
];

const TOP_ROOM = 260; // frame pixels above the page, room for the headline
const W = 1920;
const H = 1080;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const BeatView: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const b = BEATS[i];
  const n = NARRATION[i];
  const dur = BEAT_FRAMES[i];
  const s = interpolate(f, [0, dur], b.zoom, { extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });
  // Keep the focus point centred. The page may slide down below the headline band (TOP_ROOM),
  // but never sideways or up past its own edge.
  const tx = clamp(W / 2 - b.focus.x * s, W - W * s, 0);
  const ty = clamp(H / 2 - b.focus.y * s, H - H * s, TOP_ROOM);
  const fadeIn = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(f, [dur - 6, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const enter = interpolate(f, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hl = interpolate(f, [VO_LEAD, VO_LEAD + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden", fontFamily, opacity: Math.min(fadeIn, fadeOut) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
        <Img src={b.shot} style={{ width: W, height: H }} />
        {b.highlight && (
          <div
            style={{
              position: "absolute",
              left: b.highlight.left - 4,
              top: b.highlight.top - 4,
              width: b.highlight.width + 8,
              height: b.highlight.height + 8,
              border: `${4 / s}px solid ${C.accent}`,
              borderRadius: 6 / s,
              boxShadow: `0 0 0 ${(hl * 8) / s}px rgba(255,105,0,0.22)`,
              opacity: hl,
            }}
          />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 80,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 16}px)`,
          background: C.brand,
          color: "#fff",
          fontWeight: 800,
          fontSize: 68,
          lineHeight: 1.15,
          padding: "14px 32px 18px",
          borderRadius: 8,
          boxShadow: "0 8px 0 rgba(0,0,0,0.18)",
        }}
      >
        {b.headline}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, display: "flex", justifyContent: "center" }}>
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

export const HsDutyVi: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    {NARRATION.map((n, i) => (
      <Sequence key={n.id} from={BEAT_START[i]} durationInFrames={BEAT_FRAMES[i]} layout="none">
        <Sequence from={0} durationInFrames={BEAT_FRAMES[i]}>
          <BeatView i={i} />
        </Sequence>
        <Sequence from={VO_LEAD} layout="none">
          <Audio src={staticFile(`hs-duty/vo/beat-${String(n.id).padStart(2, "0")}.mp3`)} />
        </Sequence>
      </Sequence>
    ))}
  </AbsoluteFill>
);
