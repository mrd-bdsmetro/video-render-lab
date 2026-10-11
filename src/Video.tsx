import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Video = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1020", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ color: "white", fontSize: 120, fontFamily: "sans-serif", opacity }}>Hello from Remotion</h1>
    </AbsoluteFill>
  );
};
