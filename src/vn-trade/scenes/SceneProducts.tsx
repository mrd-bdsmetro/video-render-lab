import React from "react";
import { Bg, SourceCaption, Title, fmt, useProg } from "../ui";
import { V } from "../theme";
import { PRODUCTS } from "../data";
import { ICONS } from "../icons";
import * as TM from "../timing";

const X0 = 650; // bar origin
const PX = 8.2; // px per tỷ USD
const ROW = 84;

const Bar: React.FC<{ i: number }> = ({ i }) => {
  const item = PRODUCTS[i];
  const at = TM.PRODUCTS.bar(i);
  const p = useProg(at, 22);
  const icon = useProg(at, 24);
  const Icon = ICONS[item.key];
  return (
    <div style={{ position: "absolute", left: 0, top: i * ROW, height: ROW - 14, display: "flex", alignItems: "center", opacity: Math.min(1, p * 4) }}>
      <div style={{ width: 76 }}>
        <Icon draw={icon} size={60} />
      </div>
      <div style={{ width: X0 - 110 - 76, fontSize: 33, fontWeight: 600 }}>{item.label}</div>
      <div style={{ width: item.bn * PX * p, height: 56, background: V.accent, borderRadius: "0 8px 8px 0" }} />
      <div style={{ marginLeft: 16, fontSize: 40, fontWeight: 800 }}>{fmt(item.bn * p, 1)}</div>
    </div>
  );
};

export const SceneProducts: React.FC = () => {
  const mark = useProg(TM.PRODUCTS.hundred, 18);
  return (
    <Bg>
      <Title eyebrow="Việt Nam bán gì?" title="8 nhóm hàng xuất khẩu lớn nhất, tỷ USD" />
      <div style={{ position: "absolute", left: 110, top: 220 }}>
        {PRODUCTS.map((_, i) => (
          <Bar key={i} i={i} />
        ))}
      </div>
      {/* 100 tỷ USD marker */}
      <div style={{ position: "absolute", left: X0 + 100 * PX, top: 210, height: 8 * ROW + 20, opacity: mark }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, borderLeft: `3px dashed ${V.muted}` }} />
        <div style={{ position: "absolute", left: 14, bottom: 0, fontSize: 28, color: V.muted, whiteSpace: "nowrap" }}>mốc 100 tỷ USD</div>
      </div>
      <SourceCaption text="Nguồn: Cục Thống kê (Bộ Tài chính), xuất khẩu năm 2025, số sơ bộ." />
    </Bg>
  );
};
