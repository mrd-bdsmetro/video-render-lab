import React from "react";
import { Bg, SourceCaption, Title, fmt, useProg } from "../ui";
import { V } from "../theme";
import { COFFEE } from "../data";
import { IconCup } from "../icons";
import * as TM from "../timing";

const Tile: React.FC<{ at: number; value: string; unit: string; label: string }> = ({ at, value, unit, label }) => {
  const p = useProg(at, 20);
  return (
    <div style={{ width: 330, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, borderTop: `4px solid ${V.accent}`, paddingTop: 14 }}>
      <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 34, fontWeight: 800, color: V.accent }}>{unit}</div>
      <div style={{ fontSize: 28, color: V.muted, marginTop: 6 }}>{label}</div>
    </div>
  );
};

const Badge: React.FC<{ at: number; rank: string; text: string }> = ({ at, rank, text }) => {
  const p = useProg(at, 18);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: p, transform: `scale(${0.9 + p * 0.1})`, transformOrigin: "left center" }}>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: V.accent, color: "#fff", fontSize: 58, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {rank}
      </div>
      <div style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.25, width: 440 }}>{text}</div>
    </div>
  );
};

export const SceneCoffee: React.FC = () => {
  const cup = useProg(TM.COFFEE.cup, 36);
  const hs = useProg(TM.COFFEE.hs, 20);
  return (
    <Bg>
      <Title eyebrow="Tiêu điểm: cà phê" title="Hạt cà phê Việt Nam ra thế giới" at={TM.COFFEE.title} />
      <div style={{ position: "absolute", left: 130, top: 300, width: 380, height: 380, borderRadius: 190, border: `3px solid ${V.line}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, cup * 3) }}>
        <IconCup draw={cup} size={250} />
      </div>
      <div style={{ position: "absolute", left: 620, top: 300, display: "flex", gap: 56 }}>
        <Tile at={TM.COFFEE.tiles[0]} value={fmt(COFFEE.volumeMt, 2)} unit="triệu tấn" label="khối lượng xuất khẩu" />
        <Tile at={TM.COFFEE.tiles[1]} value={fmt(COFFEE.valueBn, 1)} unit="tỷ USD" label="kim ngạch xuất khẩu" />
        <Tile at={TM.COFFEE.tiles[2]} value={`+${fmt(COFFEE.valueGrowthPct, 1)}%`} unit="so với 2024" label="tăng về giá trị" />
      </div>
      <div style={{ position: "absolute", left: 620, top: 560, display: "flex", gap: 70 }}>
        <Badge at={TM.COFFEE.rank2} rank="#2" text="xuất khẩu cà phê lớn thứ hai thế giới, sau Brazil" />
        <Badge at={TM.COFFEE.rank1} rank="#1" text="nước trồng robusta nhiều nhất thế giới" />
      </div>
      <div style={{ position: "absolute", left: 620, top: 760, opacity: hs, transform: `translateY(${(1 - hs) * 16}px)`, display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ background: V.deep, borderRadius: 12, padding: "10px 26px", fontSize: 46, fontWeight: 800 }}>HS {COFFEE.hsHeading}</div>
        <div style={{ fontSize: 38, fontWeight: 600 }}>ngành hàng đầu tiên của OpenBtoB</div>
      </div>
      <SourceCaption text="Nguồn: Cục Thống kê (Bộ Tài chính), 2025; xếp hạng theo USDA FAS, niên vụ 2025/26." />
    </Bg>
  );
};
