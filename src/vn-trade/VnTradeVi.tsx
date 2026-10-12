import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SceneHook } from "./scenes/SceneHook";
import { SceneRecord } from "./scenes/SceneRecord";
import { SceneProducts } from "./scenes/SceneProducts";
import { SceneMarkets } from "./scenes/SceneMarkets";
import { SceneCoffee } from "./scenes/SceneCoffee";
import { SceneInsight } from "./scenes/SceneInsight";
import { SceneEnd } from "./scenes/SceneEnd";
import { Captions } from "./Captions";
import { VnSfx } from "./VnSfx";
import { V } from "./theme";
import { ORDER, SCENE_FRAMES, TOTAL_FRAMES, TRANSITION } from "./timing";

export const VN_TRADE_FRAMES = TOTAL_FRAMES;

const t = linearTiming({ durationInFrames: TRANSITION });
const SCENES = { hook: SceneHook, record: SceneRecord, products: SceneProducts, markets: SceneMarkets, coffee: SceneCoffee, insight: SceneInsight, cta: SceneEnd };
const PRES = [fade(), slide({ direction: "from-right" }), fade(), slide({ direction: "from-bottom" }), fade(), slide({ direction: "from-right" })];

export const VnTradeVi: React.FC = () => (
  <AbsoluteFill style={{ background: V.bg }}>
    <VnSfx />
    <TransitionSeries>
      {ORDER.flatMap((id, i) => {
        const S = SCENES[id];
        const seq = (
          <TransitionSeries.Sequence key={id} durationInFrames={SCENE_FRAMES[id]}>
            <S />
          </TransitionSeries.Sequence>
        );
        return i === 0 ? [seq] : [<TransitionSeries.Transition key={`t${i}`} presentation={PRES[i - 1]} timing={t} />, seq];
      })}
    </TransitionSeries>
    <Captions />
  </AbsoluteFill>
);
