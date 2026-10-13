import React from "react";
import { ANTON, Arrow, BE, Fill, Halftone, P, PLAYFAIR, Piece, Scraps, Stamp, Tape, Words, Strip } from "../hs-explainer/collage";

// Data-driven scene templates for the long explainer. Same paper-collage language as the short version.
// `vo` is the narration length in frames; item entrances are spread across it so visuals follow the voice.
export type Scene = {
  kind: "big" | "cards" | "digits" | "compare" | "rule" | "search" | "route" | "check" | "chapter" | "url";
  [k: string]: any;
};
export type SceneProps = { s: Scene; vo: number; ch: number };

const BG = [P.mustard, P.rust, P.blue, P.avocado, P.red, P.charcoal, P.mustard, P.rust];
const Txt: React.FC<{ size: number; font?: string; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, font = ANTON, color = P.charcoal, style, children }) => (
  <div style={{ fontFamily: font, fontSize: size, color, lineHeight: 1.1, ...style }}>{children}</div>
);
const at = (i: number, n: number, vo: number) => 10 + Math.round((i * vo * 0.62) / Math.max(1, n));
const Backdrop: React.FC<{ ch: number; seed: number }> = ({ ch, seed }) => (
  <>
    <Halftone x={1300} y={620} w={700} h={460} color={P.charcoal} dot={16} dir="to top left" opacity={0.28} pulse />
    <Scraps seed={seed} n={7} area={[0, 0, 1920, 880]} />
    <div style={{ position: "absolute", left: 90, top: 40, zIndex: 8 }}>
      <Strip text={`Phần ${ch}`} x={0} y={0} size={34} bg={P.charcoal} fg={P.paper} seed={3} rot={-2} delay={2} />
    </div>
  </>
);
const Heading: React.FC<{ text: string; delay?: number }> = ({ text, delay = 4 }) => (
  <Strip text={text} x={110} y={90} size={86} bg={P.paper} fg={P.charcoal} seed={5} rot={-1.5} delay={delay} k={0.46} />
);

export const SceneBig: React.FC<SceneProps> = ({ s, vo, ch }) => (
  <Fill color={BG[ch - 1]}>
    <Backdrop ch={ch} seed={11} />
    <Words words={s.lines[0].split(" ")} x={120} y={170} size={200} delay={8} step={9} seed={31} />
    <Words words={s.lines[1].split(" ")} x={120} y={440} size={200} delay={30} step={9} seed={41} styles={[{ bg: P.red, fg: P.paper }, { bg: P.paper, fg: P.charcoal, font: PLAYFAIR }]} />
    <Piece x={120} y={730} w={1100} h={110} rot={-1} delay={52} seed={61} z={3}>
      <div style={{ height: 110, display: "flex", alignItems: "center", padding: "0 34px" }}><Txt size={44} font={BE} style={{ fontWeight: 800 }}>{s.sub}</Txt></div>
    </Piece>
    <Stamp x={1350} y={300} text={ch === 1 && s.lines[0] === "MÃ SAI" ? "KHAI SAI" : "ĐÃ KIỂM"} size={96} rot={-9} delay={Math.round(vo * 0.6)} />
  </Fill>
);

export const SceneCards: React.FC<SceneProps> = ({ s, vo, ch }) => {
  const n = s.cards.length;
  const wCard = n === 4 ? 410 : 540;
  const gap = n === 4 ? 36 : 48;
  const x0 = (1920 - (n * wCard + (n - 1) * gap)) / 2;
  return (
    <Fill color={BG[ch - 1]}>
      <Backdrop ch={ch} seed={13} />
      <Heading text={s.head} />
      {s.cards.map((c: string[], i: number) => (
        <React.Fragment key={i}>
          <Piece x={x0 + i * (wCard + gap)} y={340 + (i % 2) * 28} w={wCard} h={440} rot={i % 2 ? 1.6 : -1.8} delay={at(i, n, vo)} seed={21 + i} z={3} enter={i % 2 ? "up" : "drop"} wobble={0.8}>
            <div style={{ width: wCard, height: 440, padding: "46px 36px", boxSizing: "border-box" }}>
              <Txt size={n === 4 ? 54 : 62} style={{ color: i % 2 ? P.red : P.charcoal }}>{c[0]}</Txt>
              <div style={{ height: 6, background: P.charcoal, margin: "20px 0 22px", width: 120 }} />
              <Txt size={n === 4 ? 38 : 44} font={BE} style={{ fontWeight: 600, lineHeight: 1.3 }}>{c[1]}</Txt>
            </div>
          </Piece>
          <Tape x={x0 + i * (wCard + gap) + wCard / 2 - 70} y={326 + (i % 2) * 28} rot={i % 2 ? 5 : -4} delay={at(i, n, vo) + 3} />
        </React.Fragment>
      ))}
    </Fill>
  );
};

export const SceneDigits: React.FC<SceneProps> = ({ s, vo, ch }) => {
  const n = s.groups.length;
  const w = 540, gap = 48, x0 = (1920 - (n * w + (n - 1) * gap)) / 2;
  return (
    <Fill color={BG[ch - 1]}>
      <Backdrop ch={ch} seed={15} />
      <Heading text={s.head} />
      {s.groups.map((g: string[], i: number) => (
        <Piece key={i} x={x0 + i * (w + gap)} y={330 + (i % 2) * 24} w={w} h={470} rot={i % 2 ? 1.5 : -1.5} delay={at(i, n, vo)} seed={31 + i} z={3} enter="drop" wobble={0.8}>
          <div style={{ width: w, height: 470, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", boxSizing: "border-box" }}>
            <Txt size={g[0].length > 5 ? 108 : 150} style={{ color: i === 1 ? P.red : P.charcoal }}>{g[0]}</Txt>
            <div style={{ height: 6, background: P.charcoal, margin: "22px 0", width: 160 }} />
            <Txt size={50}>{g[1]}</Txt>
            <Txt size={34} font={BE} style={{ fontWeight: 600, marginTop: 14 }}>{g[2]}</Txt>
          </div>
        </Piece>
      ))}
      {n === 3 && <Arrow x={x0 + w - 10} y={720} w={90} h={60} color={P.paper} delay={at(1, n, vo)} z={6} />}
    </Fill>
  );
};

export const SceneCompare: React.FC<SceneProps> = ({ s, vo, ch }) => {
  const side = (a: string[], i: number) => (
    <Piece x={150 + i * 860} y={340} w={760} h={460} rot={i ? 1.6 : -1.6} delay={at(i, 2, vo) + 4} seed={41 + i} z={3} enter={i ? "right" : "left"} wobble={0.8}>
      <div style={{ width: 760, height: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 30, boxSizing: "border-box" }}>
        <Txt size={a[0].length > 6 ? 96 : 140} style={{ color: i ? P.red : P.charcoal }}>{a[0]}</Txt>
        <div style={{ height: 6, background: P.charcoal, margin: "22px 0", width: 160 }} />
        <Txt size={54}>{a[1]}</Txt>
        <Txt size={36} font={BE} style={{ fontWeight: 600, marginTop: 14 }}>{a[2]}</Txt>
      </div>
    </Piece>
  );
  return (
    <Fill color={BG[ch - 1]}>
      <Backdrop ch={ch} seed={17} />
      <Heading text={s.head} />
      {side(s.left, 0)}
      {side(s.right, 1)}
      <Strip text="≠" x={886} y={520} size={120} bg={P.charcoal} fg={P.mustard} seed={9} delay={Math.round(vo * 0.5)} z={7} />
    </Fill>
  );
};

export const SceneRule: React.FC<SceneProps> = ({ s, vo, ch }) => (
  <Fill color={BG[ch - 1]}>
    <Backdrop ch={ch} seed={19} />
    <Heading text={s.head} />
    <Strip text={s.n} x={150} y={300} size={260} bg={P.charcoal} fg={P.mustard} seed={7} rot={-3} delay={10} k={0.6} />
    <Piece x={620} y={330} w={1150} h={290} rot={0.8} delay={at(1, 3, vo)} seed={51} z={3} enter="right">
      <div style={{ width: 1150, height: 290, padding: "40px 46px", boxSizing: "border-box" }}>
        <Txt size={52} font={BE} style={{ fontWeight: 800, lineHeight: 1.25 }}>{s.body}</Txt>
      </div>
    </Piece>
    <Piece x={620} y={660} w={1150} h={150} rot={-0.8} delay={at(2, 3, vo)} seed={53} z={3} color={P.offwhite} enter="up">
      <div style={{ width: 1150, height: 150, display: "flex", alignItems: "center", padding: "0 46px", boxSizing: "border-box" }}>
        <Txt size={38} font={BE} style={{ fontWeight: 600, color: P.red }}>{s.ex}</Txt>
      </div>
    </Piece>
  </Fill>
);

// Screen-style scene: a generic free HS search page (no site name until the outro).
const Browser: React.FC<{ delay: number; children: React.ReactNode; h?: number }> = ({ delay, children, h = 620 }) => (
  <Piece x={210} y={240} w={1500} h={h + 80} rot={-0.4} delay={delay} seed={71} z={3} edge="cut" enter="up">
    <div style={{ width: 1500, height: h + 80 }}>
      <div style={{ height: 64, background: P.charcoal, display: "flex", alignItems: "center", gap: 12, padding: "0 22px" }}>
        {[P.red, P.mustard, P.avocado].map((c, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />)}
        <div style={{ marginLeft: 24, flex: 1, height: 36, background: P.paper, borderRadius: 18, display: "flex", alignItems: "center", padding: "0 20px", fontFamily: BE, fontWeight: 600, fontSize: 24, color: P.charcoal }}>Tra mã HS miễn phí</div>
      </div>
      <div style={{ padding: "34px 50px" }}>{children}</div>
    </div>
  </Piece>
);

export const SceneSearch: React.FC<SceneProps> = ({ s, vo, ch }) => {
  return (
    <Fill color={BG[ch - 1]}>
      <Backdrop ch={ch} seed={23} />
      <Strip text="TÌM THEO MÔ TẢ HÀNG" x={210} y={110} size={64} bg={P.paper} seed={5} rot={-1} delay={4} k={0.46} />
      <Browser delay={8}>
        <div style={{ height: 86, border: `5px solid ${P.charcoal}`, background: P.rim, display: "flex", alignItems: "center", padding: "0 28px", fontFamily: BE, fontWeight: 800, fontSize: 42, color: P.charcoal }}>{s.q}</div>
        <div style={{ marginTop: 26, position: "relative", height: 400 }}>
          {s.rows.map((r: string[], i: number) => {
            const hi = i === s.hi;
            return (
              <Piece key={i} x={0} y={i * 120} w={1400} h={104} rot={0} delay={at(i, 4, vo) + 24} seed={80 + i} z={4} edge="cut" shadow={false} color={hi ? P.mustard : P.offwhite} style={{ position: "relative", marginBottom: 14, left: 0, top: 0 }} enter="left">
                <div style={{ height: 104, display: "flex", alignItems: "center", gap: 36, padding: "0 28px" }}>
                  <Txt size={58} style={{ color: hi ? P.red : P.charcoal, minWidth: 250 }}>{r[0]}</Txt>
                  <Txt size={36} font={BE} style={{ fontWeight: 600 }}>{r[1]}</Txt>
                </div>
              </Piece>
            );
          })}
        </div>
      </Browser>
      <Stamp x={1380} y={150} text="KHỚP" size={72} rot={-8} delay={Math.round(vo * 0.7)} color={P.red} />
    </Fill>
  );
};

export const SceneRoute: React.FC<SceneProps> = ({ s, vo, ch }) => (
  <Fill color={BG[ch - 1]}>
    <Backdrop ch={ch} seed={29} />
    <Heading text={s.head} />
    <Piece x={150} y={360} w={520} h={300} rot={-2} delay={10} seed={91} z={3} enter="left">
      <div style={{ width: 520, height: 300, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Txt size={34} font={BE} style={{ fontWeight: 800 }}>XUẤT TỪ</Txt>
        <Txt size={90}>{s.from}</Txt>
      </div>
    </Piece>
    <Arrow x={700} y={440} w={240} h={150} color={P.paper} delay={at(1, 4, vo)} z={6} />
    <Piece x={970} y={360} w={520} h={300} rot={2} delay={at(1, 4, vo) + 6} seed={93} z={3} enter="right">
      <div style={{ width: 520, height: 300, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Txt size={34} font={BE} style={{ fontWeight: 800 }}>NHẬP VÀO</Txt>
        <Txt size={90} style={{ color: P.red }}>{s.to}</Txt>
      </div>
    </Piece>
    <Piece x={1520} y={420} w={330} h={180} rot={-3} delay={at(2, 4, vo)} seed={95} z={4} color={P.mustard} enter="drop">
      <div style={{ width: 330, height: 180, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Txt size={64}>{s.code}</Txt>
      </div>
    </Piece>
    <Piece x={420} y={730} w={1080} h={110} rot={0.6} delay={at(3, 4, vo)} seed={97} z={3} color={P.offwhite} enter="up">
      <div style={{ width: 1080, height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}><Txt size={42} font={BE} style={{ fontWeight: 800 }}>{s.note}</Txt></div>
    </Piece>
  </Fill>
);

export const SceneCheck: React.FC<SceneProps> = ({ s, vo, ch }) => (
  <Fill color={BG[ch - 1]}>
    <Backdrop ch={ch} seed={37} />
    <Heading text={s.head} />
    <Piece x={260} y={250} w={1400} h={620} rot={-0.5} delay={8} seed={101} z={3} enter="up">
      <div style={{ width: 1400, height: 620, padding: "36px 56px", boxSizing: "border-box" }}>
        {s.items.map((t: string, i: number) => (
          <Strip key={i} text={`${i + 1}. ${t}`} x={0} y={i * 92} size={40} bg={i % 2 ? P.offwhite : P.paper} fg={P.charcoal} font={BE} delay={at(i, s.items.length, vo) + 12} seed={110 + i} k={0.56} z={5} />
        ))}
      </div>
    </Piece>
  </Fill>
);

export const SceneChapter: React.FC<SceneProps> = ({ s, ch }) => (
  <Fill color={BG[ch - 1]}>
    <Backdrop ch={ch} seed={43} />
    <Strip text={String(s.n)} x={150} y={250} size={400} bg={P.charcoal} fg={P.mustard} seed={7} rot={-3} delay={4} k={0.6} />
    <Words words={s.title.split(" ")} x={150} y={720} size={96} delay={12} step={5} seed={61} k={0.48} />
  </Fill>
);

export const SceneUrl: React.FC<SceneProps> = ({ s, vo, ch }) => (
  <Fill color={BG[ch - 1]}>
    <Backdrop ch={ch} seed={47} />
    <Heading text={s.head} />
    <Browser delay={10} h={440}>
      <div style={{ height: 86, border: `5px solid ${P.charcoal}`, background: P.rim, display: "flex", alignItems: "center", padding: "0 28px", fontFamily: BE, fontWeight: 800, fontSize: 42 }}>Mô tả hàng của bạn...</div>
      <div style={{ marginTop: 34, display: "flex", gap: 24 }}>
        {["Tìm mã HS", "Xem thuế theo tuyến", "Đối chiếu nguồn"].map((t, i) => (
          <div key={i} style={{ flex: 1, background: i === 0 ? P.mustard : P.offwhite, padding: "30px 24px", fontFamily: BE, fontWeight: 800, fontSize: 36, textAlign: "center", color: P.charcoal }}>{t}</div>
        ))}
      </div>
    </Browser>
    <Strip text={s.url} x={560} y={800} size={110} bg={P.charcoal} fg={P.mustard} seed={13} rot={-1.5} delay={Math.round(vo * 0.45)} z={8} k={0.55} />
  </Fill>
);

export const SCENES: Record<Scene["kind"], React.FC<SceneProps>> = {
  big: SceneBig, cards: SceneCards, digits: SceneDigits, compare: SceneCompare, rule: SceneRule,
  search: SceneSearch, route: SceneRoute, check: SceneCheck, chapter: SceneChapter, url: SceneUrl,
};
