import React from "react";
import { Bg, SourceCaption, Title, fmt, useProg } from "../ui";
import { V } from "../theme";
import { MARKETS, VIETNAM_LONLAT, MarketKey } from "../data";
import { LandDots, MAP_H, MAP_W, px } from "../WorldMap";
import * as TM from "../timing";

const MAP_LEFT = 110;
const MAP_TOP = 205;
const MAX_BN = 153.2;
const widthFor = (bn: number) => 3 + (bn / MAX_BN) * 17; // stroke px, by value

// Label offset from the destination marker (px) and anchor side.
const LABEL: Record<MarketKey, { dx: number; dy: number; side: "left" | "right" }> = {
  us: { dx: 30, dy: -24, side: "left" },
  cn: { dx: -110, dy: -100, side: "left" },
  eu: { dx: -60, dy: -92, side: "left" },
  kr: { dx: 40, dy: 4, side: "left" },
};

const Arc: React.FC<{ i: number }> = ({ i }) => {
  const m = MARKETS[i];
  const at = TM.MARKETS.arc[i];
  const draw = useProg(at, TM.MARKETS.arcDur);
  const land = useProg(at + TM.MARKETS.arcDur - 4, 14);
  const [x0, y0] = px(...VIETNAM_LONLAT);
  const [x1, y1] = px(...m.lonLat);
  const dist = Math.hypot(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2;
  const cy = Math.min(y0, y1) - dist * 0.32 - 20;
  const d = `M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}`;
  const w = widthFor(m.bn);
  // Point on the curve at t for the travelling dot.
  const t = draw;
  const bx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
  const by = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
  const lab = LABEL[m.key];
  return (
    <g>
      <path d={d} fill="none" stroke={V.accent} strokeOpacity={0.22} strokeWidth={w + 10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <path d={d} fill="none" stroke={V.accent} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {draw > 0 && draw < 1 && <circle cx={bx} cy={by} r={w / 2 + 3} fill="#fff" />}
      <circle cx={x1} cy={y1} r={(9 + w / 3) * land} fill={V.accent} stroke="#fff" strokeWidth={3} />
      <circle cx={x1} cy={y1} r={(9 + w / 3) * (1 + (1 - land) * 2)} fill="none" stroke={V.accent} strokeWidth={3} opacity={land * (1 - land) * 2} />
      <foreignObject x={lab.side === "left" ? x1 + lab.dx : x1 + lab.dx - 360} y={y1 + lab.dy} width={360} height={100}>
        <div style={{ textAlign: lab.side === "left" ? "left" : "right", opacity: land, transform: `translateY(${(1 - land) * 10}px)` }}>
          <div style={{ display: "inline-block", fontSize: 36, fontWeight: 800, lineHeight: 1.15, color: "#fff", background: "rgba(10,19,37,0.88)", border: `2px solid ${V.line}`, borderRadius: 10, padding: "2px 14px" }}>{m.label}</div>
        </div>
      </foreignObject>
    </g>
  );
};

const LegendRow: React.FC<{ i: number }> = ({ i }) => {
  const m = MARKETS[i];
  const p = useProg(TM.MARKETS.arc[i] + TM.MARKETS.arcDur - 4, 14);
  return (
    <div style={{ display: "flex", alignItems: "center", height: 62, opacity: p, transform: `translateX(${(1 - p) * 20}px)` }}>
      <div style={{ width: 90, height: widthFor(m.bn), background: V.accent, borderRadius: 4 }} />
      <div style={{ marginLeft: 22, width: 220, fontSize: 36, fontWeight: 600 }}>{m.label}</div>
      <div style={{ fontSize: 44, fontWeight: 800 }}>
        {m.derived ? "~" : ""}
        {fmt(m.bn, 1)}
      </div>
      <div style={{ marginLeft: 10, fontSize: 30, color: V.muted }}>tỷ USD</div>
    </div>
  );
};

export const SceneMarkets: React.FC = () => {
  const vn = useProg(TM.MARKETS.vietnam, 18);
  const mapIn = useProg(TM.MARKETS.map, 24);
  const note = useProg(60, 20);
  const [x0, y0] = px(...VIETNAM_LONLAT);
  return (
    <Bg>
      <Title eyebrow="Hàng Việt đi đâu?" title="Thị trường xuất khẩu lớn, tỷ USD" />
      <svg width={MAP_W} height={MAP_H} style={{ position: "absolute", left: MAP_LEFT, top: MAP_TOP, overflow: "visible" }}>
        <g opacity={mapIn}>
          <LandDots />
        </g>
        {MARKETS.map((_, i) => (
          <Arc key={i} i={i} />
        ))}
        <circle cx={x0} cy={y0} r={11 * vn} fill="#fff" />
        <circle cx={x0} cy={y0} r={11 + 16 * (1 - vn)} fill="none" stroke="#fff" strokeWidth={3} opacity={vn} />
        <foreignObject x={x0 - 80} y={y0 + 22} width={220} height={50}>
          <div style={{ fontSize: 34, fontWeight: 800, textShadow: "0 2px 8px #0a1325", opacity: vn }}>Việt Nam</div>
        </foreignObject>
      </svg>
      <div style={{ position: "absolute", left: 1010, top: 560 }}>
        {MARKETS.map((_, i) => (
          <LegendRow key={i} i={i} />
        ))}
      </div>
      <div style={{ position: "absolute", left: MAP_LEFT, top: MAP_TOP + MAP_H - 20, fontSize: 26, color: V.muted, opacity: note }}>
        Độ dày cung tỷ lệ với kim ngạch xuất khẩu. Trung Quốc tính từ nhập khẩu 186,0 trừ nhập siêu 115,6.
      </div>
      <SourceCaption text="Nguồn: Cục Thống kê (Bộ Tài chính), số liệu hải quan tổng hợp, 2025; Bộ Công Thương (Hàn Quốc). Bản đồ chỉ minh họa." />
    </Bg>
  );
};
