import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Disclaimer, Headline, useIn } from "../lib/ui";
import { C, fontFamily } from "../lib/theme";
import { CHAT } from "../lib/timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const SceneChat: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(0);
  const user = useIn(CHAT.send);
  const dots = interpolate(frame, [CHAT.dots, CHAT.dots + 5, CHAT.answer - 3, CHAT.answer + 2], [0, 1, 1, 0], clamp);
  const ans = useIn(CHAT.answer);
  const chip = useIn(CHAT.chips);
  return (
    <Backdrop>
      <Headline text="Hỏi thẳng từ Claude." size={72} />
      <div
        style={{
          position: "absolute",
          left: 260,
          top: 230,
          width: 1400,
          height: 700,
          borderRadius: 24,
          background: C.card,
          border: `1px solid ${C.line}`,
          boxShadow: "0 40px 90px rgba(23,23,23,0.18)",
          opacity: card,
          transform: `translateY(${(1 - card) * 50}px)`,
          padding: 48,
          fontFamily,
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", opacity: user, transform: `translateY(${(1 - user) * 24}px)` }}>
          <div
            style={{
              maxWidth: 880,
              background: C.text,
              color: "#fff",
              fontSize: 36,
              fontWeight: 600,
              lineHeight: 1.35,
              padding: "24px 32px",
              borderRadius: "28px 28px 6px 28px",
            }}
          >
            Mã HS cà phê rang xuất đi Mỹ thuế bao nhiêu?
          </div>
        </div>

        <div style={{ marginTop: 40, display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: C.brand,
              color: "#fff",
              fontWeight: 800,
              fontSize: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              opacity: Math.max(dots, ans),
            }}
          >
            OB
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ position: "relative", height: 0 }}>
              <div style={{ position: "absolute", top: 4, display: "flex", gap: 10, opacity: dots }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      background: C.accent,
                      transform: `translateY(${Math.sin((frame - i * 4) / 4) * 6}px)`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ opacity: ans, transform: `translateY(${(1 - ans) * 24}px)` }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.brand, marginBottom: 12 }}>
                Trả lời từ OpenBtoB qua MCP
              </div>
              <div
                style={{
                  background: C.tint,
                  border: `2px solid ${C.accent}`,
                  borderRadius: "6px 28px 28px 28px",
                  padding: "26px 32px",
                  fontSize: 33,
                  lineHeight: 1.45,
                  fontWeight: 400,
                }}
              >
                Cà phê rang, chưa khử caffeine thuộc nhóm <b>HS 0901.21</b>. Xem mức thuế theo tuyến Việt Nam → Mỹ, kèm nguồn chính thức và ngày kiểm tra.
              </div>
              <div style={{ marginTop: 22, display: "flex", gap: 14, opacity: chip, transform: `translateY(${(1 - chip) * 16}px)` }}>
                {["Nguồn chính thức", "Ngày cập nhật", "Tuyến VN → Mỹ"].map((t) => (
                  <div
                    key={t}
                    style={{
                      fontSize: 26,
                      fontWeight: 600,
                      color: C.brandDark,
                      background: "#fff",
                      border: `2px solid ${C.accent}`,
                      borderRadius: 999,
                      padding: "8px 22px",
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Disclaimer from={CHAT.answer + 12} />
    </Backdrop>
  );
};
