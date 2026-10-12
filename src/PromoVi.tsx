import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SceneQuestion } from "./scenes/SceneQuestion";
import { SceneHs } from "./scenes/SceneHs";
import { SceneBuyers } from "./scenes/SceneBuyers";
import { SceneChat } from "./scenes/SceneChat";
import { SceneCta } from "./scenes/SceneCta";
import { TRANSITION } from "./lib/theme";
import { Sfx } from "./Sfx";
import { SCENE_FRAMES } from "./lib/timing";

// 135 + 255 + 255 + 165 + 150 - 4 * 15 = 900 frames (30 s at 30 fps)
export const PROMO_FRAMES = 900;

const t = linearTiming({ durationInFrames: TRANSITION });

export const PromoVi: React.FC = () => (
  <AbsoluteFill>
    {/* Music / voiceover slot: put the track in public/audio/ and add
        <Audio src={staticFile("audio/promo-vi.mp3")} volume={0.25} /> here (staticFile from "remotion"). */}
    <Sfx />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.q}>
        <SceneQuestion />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.hs}>
        <SceneHs />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.buyers}>
        <SceneBuyers />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.chat}>
        <SceneChat />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.cta}>
        <SceneCta />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
