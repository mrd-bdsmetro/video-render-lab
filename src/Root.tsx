import { Composition } from "remotion";
import { Video } from "./Video";
import { PromoVi, PROMO_FRAMES } from "./PromoVi";
import { VnTradeVi, VN_TRADE_FRAMES } from "./vn-trade/VnTradeVi";
import { HsExplainerVi, HS_FRAMES } from "./hs-explainer/HsExplainerVi";

export const Root = () => (
  <>
    <Composition
      id="Main"
      component={Video}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="PromoVi"
      component={PromoVi}
      durationInFrames={PROMO_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition id="HsExplainerVi" component={HsExplainerVi} durationInFrames={HS_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="VnTradeVi" component={VnTradeVi} durationInFrames={VN_TRADE_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
