import React from "react";
import { Backdrop, Wordmark, useIn } from "../lib/ui";
import { C, fontFamily } from "../lib/theme";
import { CTA } from "../lib/timing";

export const SceneCta: React.FC = () => {
  const logo = useIn(CTA.logo);
  const url = useIn(CTA.url);
  const btn = useIn(CTA.button, 12);
  const note = useIn(CTA.note);
  return (
    <Backdrop>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 34,
          fontFamily,
        }}
      >
        <div style={{ opacity: logo, transform: `scale(${0.85 + 0.15 * logo})` }}>
          <Wordmark size={190} />
        </div>
        <div style={{ fontSize: 56, fontWeight: 600, color: C.muted, opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>
          openbtob.com
        </div>
        <div
          style={{
            marginTop: 20,
            background: C.brand,
            color: "#fff",
            fontSize: 54,
            fontWeight: 800,
            padding: "30px 74px",
            borderRadius: 24,
            boxShadow: `0 20px 50px rgba(202,53,0,0.38), 0 0 0 ${10 * btn}px rgba(255,105,0,0.2)`,
            opacity: btn,
            transform: `scale(${0.8 + 0.2 * btn})`,
          }}
        >
          Dùng thử 14 ngày miễn phí
        </div>
        <div style={{ fontSize: 40, fontWeight: 600, color: C.text, opacity: note }}>Không cần thẻ.</div>
      </div>
    </Backdrop>
  );
};
