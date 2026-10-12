import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Backdrop, BrowserShot, Disclaimer, Headline, Highlight, Shot } from "../lib/ui";
import { C } from "../lib/theme";
import { HS } from "../lib/timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Types "0901" into the real HS lookup input (image coordinates).
const TypeIn: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(4, Math.floor((frame - HS.typeStart) / HS.typeStep)));
  const text = "0901".slice(0, n);
  const show = interpolate(frame, [0, 4, HS.swapList + 6, HS.swapList + 14], [0, 1, 1, 0], clamp);
  const caret = Math.floor(frame / 8) % 2 === 0;
  const press = interpolate(frame, [HS.click, HS.click + 6, HS.click + 14], [0, 1, 0], clamp);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 538,
          top: 166,
          width: 572,
          height: 30,
          background: "#fff",
          opacity: show,
          fontSize: 17,
          color: C.text,
          display: "flex",
          alignItems: "center",
          paddingLeft: 15,
          fontFamily: "Be Vietnam Pro, sans-serif",
        }}
      >
        {text}
        <span style={{ opacity: caret ? 1 : 0, marginLeft: 1, color: C.brand }}>|</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1114,
          top: 160,
          width: 92,
          height: 44,
          borderRadius: 10,
          border: `6px solid ${C.accent}`,
          opacity: press,
          transform: `scale(${1 + press * 0.1})`,
        }}
      />
    </>
  );
};

export const SceneHs: React.FC = () => {
  return (
    <Backdrop>
      <Headline text="Tra mã HS và thuế theo tuyến." sub="Có nguồn, có ngày." subDelay={30} size={64} />
      <BrowserShot
        url="openbtob.com/hs"
        focus={[
          { f: 0, x: 860, y: 190, z: 1.0 },
          { f: 70, x: 860, y: 230, z: 1.03 },
          { f: 100, x: 800, y: 380, z: 1.0 },
          { f: 135, x: 800, y: 420, z: 1.0 },
          { f: 150, x: 960, y: 330, z: 1.04 },
          { f: 195, x: 960, y: 560, z: 1.04 },
          { f: 215, x: 960, y: 330, z: 1.04 },
          { f: 255, x: 960, y: 340, z: 1.06 },
        ]}
      >
        <Shot file="hs-empty.png" to={HS.swapList + 12} />
        <TypeIn />
        <Shot file="hs-0901.png" from={HS.swapList} to={HS.swapUs + 12} />
        <Shot file="guide-us.png" from={HS.swapUs} to={HS.swapEu + 12} />
        <Shot file="guide-eu.png" from={HS.swapEu} />
        <Highlight x={545} y={286} w={64} h={34} from={HS.popCode} to={HS.swapUs + 4} label="Mã HS" labelSide="left" />
        <Highlight x={545} y={443} w={470} h={30} from={HS.popSubCode} to={HS.swapUs + 4} />
        <Highlight x={872} y={289} w={50} h={20} from={HS.popFree} to={HS.swapEu + 12} label="Thuế Việt Nam → Mỹ" labelSide="bottom" />
        <Highlight x={976} y={248} w={300} h={22} from={HS.popDate} to={HS.swapEu + 12} label="Có ngày" labelSide="top" />
        <Highlight x={576} y={572} w={765} h={58} from={HS.popSource} to={HS.swapEu + 12} label="Có nguồn" labelSide="bottom" />
        <Highlight x={578} y={282} w={768} h={20} from={HS.popEu} label="Việt Nam → EU" labelSide="top" />
        <Highlight x={576} y={140} w={372} h={18} from={HS.popEuDate} label="Có ngày" labelSide="top" />
      </BrowserShot>
      <Disclaimer from={HS.popFree - 2} />
    </Backdrop>
  );
};
