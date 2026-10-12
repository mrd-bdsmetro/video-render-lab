import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Bg, SourceCaption, fmt, fmtInt, outCubic, useProg } from "../ui";
import { V } from "../theme";
import { TOTALS, SRC } from "../data";
import * as TM from "../timing";

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { bigNumber } = TM.HOOK;
  // Phase A: USD per second counts up; phase B: the yearly total takes over.
  const a = useProg(TM.HOOK.perSec, 40);
  const swap = useProg(bigNumber - 6, 16);
  const count = useProg(bigNumber, Math.max(30, TM.HOOK.bigDone - bigNumber));
  const perSecShown = TOTALS.usdPerSecond * a;
  const total = TOTALS.exportBn * count;
  const heroA = (1 - swap) * a;
  return (
    <Bg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
        {/* phase A */}
        <div style={{ position: "absolute", left: 0, right: 0, opacity: heroA, transform: `translateY(${-swap * 40}px)` }}>
          <div style={{ fontSize: 40, fontWeight: 600, color: V.muted }}>Mỗi giây, Việt Nam xuất khẩu</div>
          <div style={{ fontSize: 250, fontWeight: 800, lineHeight: 1.05, color: V.accent, letterSpacing: -4 }}>
            {fmtInt(perSecShown)}
          </div>
          <div style={{ fontSize: 64, fontWeight: 800 }}>USD hàng hóa</div>
        </div>
        {/* phase B */}
        <div style={{ position: "absolute", left: 0, right: 0, opacity: swap, transform: `translateY(${(1 - swap) * 40}px)` }}>
          <div style={{ fontSize: 40, fontWeight: 600, color: V.muted }}>Xuất khẩu hàng hóa của Việt Nam năm {TOTALS.year}</div>
          <div style={{ fontSize: 250, fontWeight: 800, lineHeight: 1.05, color: V.accent, letterSpacing: -4 }}>
            {fmt(total, total < TOTALS.exportBn ? 0 : 0)}
          </div>
          <div style={{ fontSize: 64, fontWeight: 800 }}>tỷ USD</div>
          <div style={{ fontSize: 34, color: V.muted, marginTop: 14, opacity: outCubic(Math.min(1, Math.max(0, (frame - bigNumber - 40) / 20))) }}>
            tương đương khoảng {fmtInt(TOTALS.usdPerSecond)} USD mỗi giây
          </div>
        </div>
      </div>
      <SourceCaption text={`Nguồn: Cục Thống kê (Bộ Tài chính), ${TOTALS.year}. Số USD mỗi giây tính từ tổng xuất khẩu ${fmt(TOTALS.exportBn, 2)} tỷ USD / số giây trong năm.`} at={interpolate(frame, [0, 1], [8, 8])} />
    </Bg>
  );
};
void SRC;
