import React from "react";
import { Sequence, useCurrentFrame, interpolate } from "remotion";
import { CAPTIONS } from "./timing";
import { fontFamily } from "./theme";

const Cue: React.FC<{ text: string; len: number }> = ({ text, len }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 5, len - 5, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 84, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          maxWidth: 1720,
          textAlign: "center",
          fontFamily,
          fontSize: 42,
          fontWeight: 600,
          lineHeight: 1.3,
          color: "#fff",
          background: "rgba(6,12,26,0.78)",
          padding: "10px 30px",
          borderRadius: 14,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Burned-in Vietnamese subtitles, timed from the measured narration line boundaries.
export const Captions: React.FC = () => (
  <>
    {CAPTIONS.map((c, i) => (
      <Sequence key={i} from={c.from} durationInFrames={c.to - c.from} layout="none">
        <Cue text={c.text} len={c.to - c.from} />
      </Sequence>
    ))}
  </>
);
