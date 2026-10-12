import React from "react";
import { Bg, useProg } from "../ui";
import { V } from "../theme";
import * as TM from "../timing";

export const SceneEnd: React.FC = () => {
  const logo = useProg(TM.CTA.logo, 22);
  const url = useProg(TM.CTA.url, 22);
  const btn = useProg(TM.CTA.button, 18);
  return (
    <Bg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 6, color: V.accent, opacity: logo }}>OPENBTOB</div>
        <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -2, marginTop: 10, opacity: url, transform: `translateY(${(1 - url) * 24}px)` }}>openbtob.com</div>
        <div style={{ marginTop: 40, display: "inline-block", opacity: btn, transform: `scale(${0.94 + btn * 0.06})`, background: V.deep, borderRadius: 18, padding: "20px 56px", fontSize: 54, fontWeight: 800 }}>
          Tra mã HS và tìm người mua
        </div>
      </div>
    </Bg>
  );
};
