import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Headline, useIn } from "../lib/ui";
import { C, fontFamily } from "../lib/theme";
import { Q as QT } from "../lib/timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Sack: React.FC = () => (
  <svg width="340" height="400" viewBox="0 0 340 400">
    <path
      d="M90 70 Q170 20 250 70 L300 130 Q330 220 300 330 Q170 390 40 330 Q10 220 40 130 Z"
      fill="#c68a4d"
      stroke="#8a5a2b"
      strokeWidth="8"
      strokeLinejoin="round"
    />
    <path d="M90 70 Q170 110 250 70" fill="none" stroke="#8a5a2b" strokeWidth="8" strokeLinecap="round" />
    <path d="M110 55 Q170 20 230 55" fill="none" stroke="#8a5a2b" strokeWidth="10" strokeLinecap="round" />
    <rect x="95" y="185" width="150" height="100" rx="14" fill="#f7e9d3" stroke="#8a5a2b" strokeWidth="5" />
    <ellipse cx="170" cy="235" rx="26" ry="38" fill="#4a2c14" />
    <path d="M170 200 Q160 235 170 270" stroke="#c68a4d" strokeWidth="6" fill="none" strokeLinecap="round" />
    <text x="170" y="320" textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize="30" fill="#4a2c14">
      CÀ PHÊ
    </text>
  </svg>
);

const Region: React.FC<{ points: string; label: string; progress: number }> = ({ points, label, progress }) => (
  <div style={{ position: "relative", width: 340, height: 220, opacity: progress, transform: `scale(${0.8 + 0.2 * progress})` }}>
    <svg width="340" height="220" viewBox="0 0 300 180">
      <polygon points={points} fill={C.tint} stroke={C.brand} strokeWidth="5" strokeLinejoin="round" />
    </svg>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: 54,
        color: C.brandDark,
        fontFamily,
      }}
    >
      {label}
    </div>
  </div>
);

const Arrow: React.FC<{ d: string; progress: number }> = ({ d, progress }) => (
  <path
    d={d}
    fill="none"
    stroke={C.accent}
    strokeWidth="10"
    strokeLinecap="round"
    strokeDasharray="1"
    pathLength={1}
    strokeDashoffset={1 - progress}
    markerEnd={progress > 0.98 ? "url(#head)" : undefined}
  />
);

const Q: React.FC<{ x: number; y: number; delay: number; size: number }> = ({ x, y, delay, size }) => {
  const frame = useCurrentFrame();
  const a = useIn(delay, 12);
  const bob = Math.sin((frame + delay * 3) / 9) * 8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        fontSize: size,
        fontWeight: 800,
        color: C.brand,
        opacity: a,
        transform: `scale(${a}) rotate(${Math.sin((frame + delay) / 12) * 8}deg)`,
        fontFamily,
      }}
    >
      ?
    </div>
  );
};

export const SceneQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const sack = useIn(QT.sack);
  const us = useIn(QT.us);
  const eu = useIn(QT.eu);
  const arrowUs = interpolate(frame, [QT.arrowUs, QT.arrowUs + 30], [0, 1], clamp);
  const arrowEu = interpolate(frame, [QT.arrowEu, QT.arrowEu + 30], [0, 1], clamp);
  return (
    <Backdrop>
      <Headline text="Xuất cà phê đi Mỹ, EU… ai đang mua?" sub="Thuế bao nhiêu?" subDelay={50} size={68} />
      <div style={{ position: "absolute", left: 250, top: 400, opacity: sack, transform: `translateY(${(1 - sack) * 80}px) rotate(${(1 - sack) * -8}deg)` }}>
        <Sack />
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <marker id="head" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 z" fill={C.accent} />
          </marker>
        </defs>
        <Arrow d="M610 560 Q 900 400 1180 440" progress={arrowUs} />
        <Arrow d="M610 640 Q 900 800 1180 800" progress={arrowEu} />
      </svg>
      <div style={{ position: "absolute", left: 1240, top: 320 }}>
        <Region
          points="10,40 60,20 140,25 200,15 250,30 285,55 270,90 240,100 235,140 205,150 180,120 120,125 90,100 50,95 20,70"
          label="MỸ"
          progress={us}
        />
      </div>
      <div style={{ position: "absolute", left: 1240, top: 700 }}>
        <Region
          points="20,60 50,30 90,15 130,25 170,10 215,35 230,80 200,120 160,100 130,140 90,160 70,120 30,110"
          label="EU"
          progress={eu}
        />
      </div>
      <Q x={1560} y={300} delay={QT.marks[0]} size={90} />
      <Q x={1180} y={330} delay={QT.marks[1]} size={64} />
      <Q x={1570} y={690} delay={QT.marks[2]} size={90} />
      <Q x={1190} y={720} delay={QT.marks[3]} size={64} />
      <Q x={640} y={380} delay={QT.marks[4]} size={70} />
    </Backdrop>
  );
};
