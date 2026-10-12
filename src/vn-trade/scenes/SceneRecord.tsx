import React from "react";
import { Bg, SourceCaption, Title, fmt, useProg } from "../ui";
import { V } from "../theme";
import { TOTALS } from "../data";
import * as TM from "../timing";

const MAXW = 1000; // px for 475 tỷ USD

const Row: React.FC<{ label: string; value: number; at: number; color: string; chip?: string }> = ({ label, value, at, color, chip }) => {
  const p = useProg(at, 34);
  const w = (value / TOTALS.exportBn) * MAXW * p;
  return (
    <div style={{ display: "flex", alignItems: "center", height: 120 }}>
      <div style={{ width: 250, fontSize: 40, fontWeight: 600, color: V.muted }}>{label}</div>
      <div style={{ width: w, height: 72, background: color, borderRadius: "0 8px 8px 0" }} />
      <div style={{ marginLeft: 20, fontSize: 56, fontWeight: 800, opacity: p }}>{fmt(value * p, 2)}</div>
      {chip && <div style={{ marginLeft: 20, fontSize: 36, fontWeight: 800, color: V.accent, opacity: p }}>{chip}</div>}
    </div>
  );
};

export const SceneRecord: React.FC = () => {
  const bal = useProg(TM.RECORD.balance, 24);
  return (
    <Bg>
      <Title eyebrow="Xuất nhập khẩu 2025" title="Kỷ lục mới, vẫn xuất siêu" />
      <div style={{ position: "absolute", left: 110, top: 330 }}>
        <Row label="Xuất khẩu" value={TOTALS.exportBn} at={TM.RECORD.exportBar} color={V.accent} chip={`+${fmt(TOTALS.exportGrowthPct)}%`} />
        <Row label="Nhập khẩu" value={TOTALS.importBn} at={TM.RECORD.importBar} color="#6f87b3" chip={`+${fmt(TOTALS.importGrowthPct)}%`} />
        <div style={{ marginTop: 40, marginLeft: 250, opacity: bal, transform: `translateY(${(1 - bal) * 16}px)` }}>
          <span style={{ fontSize: 40, color: V.muted }}>Xuất siêu </span>
          <span style={{ fontSize: 96, fontWeight: 800, color: V.accent }}>{fmt(TOTALS.balanceBn, 2)}</span>
          <span style={{ fontSize: 48, fontWeight: 800 }}> tỷ USD</span>
        </div>
      </div>
      <div style={{ position: "absolute", right: 110, top: 150, fontSize: 28, color: V.muted, textAlign: "right" }}>tỷ USD, so sánh cùng một thang</div>
      <SourceCaption text="Nguồn: Cục Thống kê (Bộ Tài chính), họp báo 05/01/2026. Tăng trưởng so với năm 2024." />
    </Bg>
  );
};
