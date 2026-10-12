import React from "react";
import { Bg, SourceCaption, Title, fmt, useProg } from "../ui";
import { V } from "../theme";
import { TOTALS } from "../data";
import { IconChip, IconCup, IconFish, IconShirt, IconShoe, IconWood } from "../icons";
import * as TM from "../timing";

// HS headings shown as examples (standard 4-digit headings).
const CHIPS = [
  { code: "8542", name: "Vi mạch điện tử", Icon: IconChip },
  { code: "6403", name: "Giày da", Icon: IconShoe },
  { code: "6109", name: "Áo phông", Icon: IconShirt },
  { code: "0306", name: "Tôm, cua", Icon: IconFish },
  { code: "0901", name: "Cà phê", Icon: IconCup },
  { code: "9403", name: "Đồ nội thất", Icon: IconWood },
];

const Chip: React.FC<{ i: number }> = ({ i }) => {
  const c = CHIPS[i];
  const p = useProg(TM.INSIGHT.chips(i), 16);
  return (
    <div style={{ width: 232, height: 200, borderRadius: 16, border: `2px solid ${V.line}`, background: V.panel, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
      <c.Icon draw={p} size={64} />
      <div style={{ fontSize: 40, fontWeight: 800 }}>HS {c.code}</div>
      <div style={{ fontSize: 26, color: V.muted }}>{c.name}</div>
    </div>
  );
};

export const SceneInsight: React.FC = () => {
  const bar = useProg(TM.INSIGHT.bar + 6, 50);
  const barW = 1500;
  return (
    <Bg>
      <Title eyebrow="Điều đáng chú ý" title="Việt Nam xuất khẩu hàng chế tạo" />
      <div style={{ position: "absolute", left: 210, top: 250 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, opacity: Math.min(1, bar * 3) }}>
          <div style={{ fontSize: 160, fontWeight: 800, color: V.accent, lineHeight: 1 }}>{fmt(TOTALS.industrialSharePct * bar, 1)}%</div>
          <div style={{ fontSize: 40, fontWeight: 600, width: 800 }}>xuất khẩu là hàng công nghiệp chế biến</div>
        </div>
        <div style={{ marginTop: 28, width: barW, height: 44, background: "#1c3157", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ width: (TOTALS.industrialSharePct / 100) * barW * bar, height: "100%", background: V.accent }} />
        </div>
        <div style={{ marginTop: 10, fontSize: 26, color: V.muted }}>Phần còn lại: các nhóm hàng khác</div>
      </div>
      <div style={{ position: "absolute", left: 210, top: 610, display: "flex", gap: 28 }}>
        {CHIPS.map((_, i) => (
          <Chip key={i} i={i} />
        ))}
      </div>
      <SourceCaption text="Nguồn: Cục Thống kê (Bộ Tài chính), 2025: hàng công nghiệp chế biến 421,47 tỷ USD, 88,7% xuất khẩu. Mã HS chỉ minh họa." />
    </Bg>
  );
};
