import React from "react";
import { interpolate } from "remotion";
import { ANTON, Arrow, BE, Fill, Greek, Halftone, P, PLAYFAIR, Piece, Pop, Scraps, SERIF, Stamp, Strip, Tape, Words, useStep, Layer } from "./collage";
import { B1, B10, B2, B3, B4, B5, B6, B7, B8, B9, DISCLAIMER_AT } from "./timing";

const Txt: React.FC<{ size: number; font?: string; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, font = ANTON, color = P.charcoal, style, children }) => (
  <div style={{ fontFamily: font, fontSize: size, color, lineHeight: 1.05, ...style }}>{children}</div>
);
const Center: React.FC<{ w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, children, style }) => (
  <div style={{ width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", ...style }}>{children}</div>
);

// ---------- coffee beans ----------
const Bean: React.FC<{ x: number; y: number; rot: number; fill: string; crease: string; s?: number; sx?: number }> = ({ x, y, rot, fill, crease, s = 1, sx = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s * sx},${s})`}>
    <ellipse rx="36" ry="24" fill={fill} stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
    <ellipse rx="22" ry="11" cx="-6" cy="-6" fill="rgba(255,255,255,0.14)" />
    <path d="M-34 0 Q-12 -9 0 0 T34 0" stroke={crease} strokeWidth="4" fill="none" strokeLinecap="round" />
  </g>
);
const BEAN_SPOTS = [[0, 0, 10], [-70, 20, -30], [70, 15, 40], [-35, -48, 70], [38, -50, -20], [-95, -30, 20], [100, -35, -60], [-10, 55, 0], [60, 62, 25], [-65, 70, -45]];
const BeanPile: React.FC<{ cx: number; cy: number; roast: boolean; sx?: number; s?: number }> = ({ cx, cy, roast, sx = 1, s = 1 }) => (
  <>
    {BEAN_SPOTS.map(([x, y, r], i) => (
      <Bean key={i} x={cx + x * s} y={cy + y * s} rot={r} s={s} sx={sx} fill={roast ? "#4A2A18" : "#7C9B3A"} crease={roast ? "#1B0E07" : "#4E6A1F"} />
    ))}
  </>
);

// ---------- beat 1 ----------
export const Beat1: React.FC = () => {
  return (
    <Fill color={P.mustard}>
      <Halftone x={1250} y={640} w={700} h={460} color={P.red} dot={16} dir="to top left" opacity={0.55} pulse />
      <Halftone x={-60} y={640} w={620} h={440} color={P.charcoal} dot={14} dir="to top right" opacity={0.35} pulse />
      <Scraps seed={11} n={9} area={[0, 0, 1920, 900]} />
      <Piece x={1010} y={110} w={780} h={690} rot={3} delay={B1.form} enter="drop" seed={21} z={2}>
        <div style={{ padding: "36px 44px" }}>
          <Txt size={52} font={PLAYFAIR} style={{ letterSpacing: 1 }}>TỜ KHAI HẢI QUAN</Txt>
          <div style={{ height: 6, background: P.charcoal, margin: "14px 0 24px" }} />
          <Txt size={30} font={BE} style={{ fontWeight: 800, marginBottom: 12 }}>MÃ SỐ HÀNG HÓA (HS)</Txt>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ width: 84, height: 112, border: `5px solid ${P.charcoal}`, background: P.rim, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 80, color: i % 2 ? P.red : P.charcoal }}>?</div>
            ))}
          </div>
          <div style={{ marginTop: 34 }}><Greek w={650} lines={9} seed={4} /></div>
        </div>
      </Piece>
      <Tape x={985} y={100} rot={-35} delay={B1.form + 3} />
      <Tape x={1660} y={100} rot={35} delay={B1.form + 3} />
      <Stamp x={1180} y={600} text="ĐÃ KHAI" size={96} rot={-9} delay={B1.stamp} />
      <Words words={["6", "CHỮ", "SỐ"]} x={80} y={70} size={140} delay={B1.words[0]} step={7} seed={31} />
      <Words words={["QUYẾT", "ĐỊNH"]} x={80} y={255} size={140} delay={B1.words[3]} step={8} seed={41} styles={[{ bg: P.red, fg: P.paper }, { bg: P.paper, fg: P.charcoal, font: PLAYFAIR }]} />
      <Words words={["THUẾ"]} x={80} y={440} size={140} delay={B1.words[5]} step={8} seed={51} styles={[{ bg: P.charcoal, fg: P.mustard }]} />
      <Piece x={70} y={660} w={400} h={160} rot={-2} delay={B1.words[5] + 8} seed={61} z={3}>
        <Center w={400} h={160}><Txt size={36} font={BE} style={{ fontWeight: 800, padding: "0 30px" }}>Mã HS trên lô hàng của bạn đang nói gì?</Txt></Center>
      </Piece>
      <Pop x={500} y={470} rot={-3} wobble={2.2} delay={B1.sack} z={4} origin="50% 90%">
        <svg width="460" height="430" viewBox="0 0 460 430">
          <path d="M150 50 Q230 20 310 50 L335 100 Q410 200 395 320 Q380 405 230 410 Q80 405 62 320 Q45 200 125 100 Z" fill="#B99A66" stroke="rgba(0,0,0,0.3)" strokeWidth="3" />
          <path d="M150 50 Q230 85 310 50" stroke="#6B5530" strokeWidth="8" fill="none" />
          <path d="M120 105 Q230 150 340 105" stroke="#6B5530" strokeWidth="10" fill="none" strokeDasharray="14 8" />
          <rect x="125" y="190" width="215" height="110" fill={P.paper} stroke={P.charcoal} strokeWidth="5" transform="rotate(-3 230 245)" />
          <text x="232" y="262" textAnchor="middle" fontFamily={ANTON} fontSize="64" fill={P.red} transform="rotate(-3 230 245)">CÀ PHÊ</text>
          <text x="232" y="296" textAnchor="middle" fontFamily={BE} fontWeight="800" fontSize="22" fill={P.charcoal} transform="rotate(-3 230 245)">HẠT XANH</text>
          <BeanPile cx={110} cy={385} roast={false} s={0.5} />
          <BeanPile cx={345} cy={392} roast={false} s={0.45} />
        </svg>
      </Pop>
      <Tape x={660} y={500} rot={-10} delay={B1.sack + 3} w={110} />
    </Fill>
  );
};

// ---------- beat 2 ----------
type LL = [number, number];
const LAND: LL[][] = [
  [[-168, 66], [-140, 70], [-100, 72], [-80, 68], [-62, 58], [-55, 48], [-70, 42], [-76, 35], [-81, 25], [-97, 26], [-105, 22], [-117, 32], [-125, 42], [-130, 55], [-152, 59], [-165, 60]],
  [[-97, 26], [-92, 17], [-83, 9], [-78, 8], [-90, 14], [-105, 20]],
  [[-55, 60], [-45, 60], [-20, 70], [-20, 82], [-60, 82], [-70, 76]],
  [[-78, 8], [-60, 10], [-50, 0], [-35, -6], [-40, -22], [-55, -35], [-66, -55], [-74, -50], [-72, -30], [-81, -5]],
  [[-10, 36], [-9, 44], [-2, 48], [5, 53], [10, 57], [20, 70], [30, 70], [40, 66], [40, 50], [28, 41], [20, 38], [12, 38], [0, 36]],
  [[-17, 21], [-10, 35], [10, 37], [32, 31], [43, 12], [51, 11], [40, -12], [35, -25], [20, -35], [12, -17], [9, 4], [-8, 5], [-17, 14]],
  [[40, 66], [60, 72], [100, 77], [140, 72], [170, 66], [160, 55], [142, 46], [130, 35], [122, 30], [122, 22], [108, 10], [104, 1], [98, 8], [92, 22], [80, 8], [72, 20], [58, 24], [48, 30], [36, 36], [28, 41], [40, 50]],
  [[114, -22], [130, -12], [142, -11], [153, -27], [146, -39], [135, -35], [115, -34]],
  [[95, 5], [105, -6], [120, -8], [140, -8], [130, -1], [110, 2]],
];
const mx = (lon: number) => ((lon + 180) / 360) * 1000;
const my = (lat: number) => ((90 - lat) / 180) * 500;
const inside = (x: number, y: number, p: LL[]) => {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = [mx(p[i][0]), my(p[i][1])];
    const [xj, yj] = [mx(p[j][0]), my(p[j][1])];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const DOTS = (() => {
  const out: [number, number, number][] = [];
  for (let y = 5; y < 500; y += 9) for (let x = 5; x < 1000; x += 9) {
    if (LAND.some((p) => inside(x, y, p))) out.push([x, y, 2.3 + 1.9 * Math.abs(Math.sin(y * 0.021 + x * 0.004))]);
  }
  return out;
})();
const FLAGS: [number, number, string][] = [[-100, 40, P.red], [-72, 46, P.mustard], [-60, -12, P.blue], [10, 48, P.mustard], [32, 55, P.red], [20, 4, P.blue], [-2, 12, P.red], [80, 33, P.mustard], [105, 33, P.blue], [136, 38, P.red], [100, 13, P.mustard], [106, 16, P.red], [135, -25, P.blue], [-48, -22, P.mustard]];

const Pennant: React.FC<{ x: number; y: number; color: string; delay: number; i: number }> = ({ x, y, color, delay, i }) => {
  const f = useStep();
  const t = f - delay;
  if (t < 0) return null;
  const s = Math.min(1, t / 5);
  const flap = Math.sin(f * 0.5 + i) * 5;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} style={{ filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.3))" }}>
      <line x1="0" y1="0" x2="0" y2="-58" stroke={P.charcoal} strokeWidth="4" />
      <polygon points={`0,-58 ${46 + flap},${-48} 0,-34`} fill={color} stroke={P.charcoal} strokeWidth="1.5" />
    </g>
  );
};

export const Beat2: React.FC = () => (
  <Fill color={P.paper}>
    <div style={{ position: "absolute", left: 0, top: 360, width: 1920, height: 190, background: P.red }} />
    <Halftone x={0} y={560} w={800} h={340} color={P.red} dot={14} dir="to bottom" opacity={0.2} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform="translate(210,90) scale(1.5)">
        {DOTS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={P.charcoal} opacity="0.9" />)}
      </g>
      <g transform="translate(210,90) scale(1.5)">
        {FLAGS.map(([lon, lat, c], i) => <Pennant key={i} x={mx(lon)} y={my(lat)} color={c} delay={B2.flags + i * 4} i={i} />)}
      </g>
    </svg>
    <Strip text="HS: NGÔN NGỮ" x={90} y={44} size={90} rot={-2} bg={P.charcoal} fg={P.paper} seed={3} delay={0} enter="left" />
    <Strip text="CHUNG CỦA HẢI QUAN" x={130} y={170} size={90} rot={1.5} bg={P.red} fg={P.paper} seed={4} delay={5} enter="left" k={0.5} />
    <Piece x={90} y={560} w={620} h={330} rot={-3} delay={B2.clip} enter="up" seed={12} z={4}>
      <div style={{ padding: "26px 34px" }}>
        <Txt size={24} font={SERIF} style={{ letterSpacing: 6 }}>BẢN TIN HẢI QUAN</Txt>
        <div style={{ height: 4, background: P.charcoal, margin: "8px 0 14px" }} />
        <Txt size={50} font={PLAYFAIR}>HỆ THỐNG HÀI HÒA</Txt>
        <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
          <Greek w={260} lines={8} seed={7} />
          <Greek w={260} lines={8} seed={9} />
        </div>
      </div>
    </Piece>
    <Tape x={110} y={545} rot={-20} delay={B2.clip + 3} w={120} />
    <Piece x={1470} y={60} w={330} h={170} rot={5} delay={B2.wco} enter="drop" seed={14} z={5}>
      <Center w={330} h={170}><Txt size={120}>WCO</Txt></Center>
    </Piece>
    <Tape x={1520} y={46} rot={4} delay={B2.wco + 3} w={150} color="rgba(190,60,50,0.75)" />
    <Piece x={1000} y={590} w={400} h={250} rot={-4} color={P.mustard} delay={B2.n200} seed={15} z={6}>
      <Center w={400} h={250}>
        <Txt size={170}>200+</Txt>
        <Txt size={30} font={BE} style={{ fontWeight: 800, marginTop: 6 }}>quốc gia và nền kinh tế</Txt>
      </Center>
    </Piece>
    <Piece x={1450} y={640} w={410} h={250} rot={3} color={P.charcoal} delay={B2.n98} seed={16} z={6}>
      <Center w={410} h={250}>
        <Txt size={150} color={P.paper}>98%+</Txt>
        <Txt size={25} font={BE} color={P.paper} style={{ fontWeight: 800, marginTop: 6 }}>hàng hóa thương mại quốc tế</Txt>
      </Center>
    </Piece>
  </Fill>
);

// ---------- beat 3 ----------
export const Beat3: React.FC = () => {
  const f = useStep();
  const uw = interpolate(f - B3.underline, [0, 10], [0, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cards = [
    { w: 540, y: 100, label: "CHƯƠNG · 2 SỐ", segs: [["09", P.charcoal]] },
    { w: 920, y: 350, label: "NHÓM · 4 SỐ", segs: [["09", P.charcoal], ["01", P.red]] },
    { w: 1360, y: 600, label: "PHÂN NHÓM · 6 SỐ", segs: [["09", P.charcoal], ["01", P.red], ["11", "#A8660A"]] },
  ] as const;
  return (
    <Fill color={P.blue}>
      <Halftone x={1150} y={-80} w={800} h={500} color={P.paper} dot={16} dir="to bottom left" opacity={0.22} />
      <Halftone x={-60} y={620} w={700} h={460} color={P.paper} dot={14} dir="to top right" opacity={0.18} />
      {cards.map((c, i) => (
        <React.Fragment key={i}>
          <Piece x={110} y={c.y} w={c.w} h={210} rot={i === 1 ? 0.8 : -0.8} color={i === 1 ? P.mustard : P.paper} delay={B3.cards[i]} enter="left" tear="rbt" seed={30 + i} z={3}>
            <div style={{ display: "flex", alignItems: "center", height: 210, padding: "0 50px", gap: 36 }}>
              <div style={{ fontFamily: ANTON, fontSize: 170, display: "flex", letterSpacing: 4 }}>
                {c.segs.map(([t, col], k) => <span key={k} style={{ color: col }}>{t}</span>)}
              </div>
              {i > 0 && <div style={{ fontFamily: BE, fontWeight: 800, fontSize: 38, color: P.charcoal, whiteSpace: "nowrap" }}>{c.label}</div>}
            </div>
            {i === 0 && <div style={{ position: "absolute", left: 290, top: 80, fontFamily: BE, fontWeight: 800, fontSize: 30, width: 240, lineHeight: 1.1 }}>{c.label}</div>}
          </Piece>
          <Tape x={90} y={c.y - 8} rot={-30} delay={B3.cards[i] + 3} w={110} />
        </React.Fragment>
      ))}
      <Arrow x={235} y={296} w={95} h={64} color={P.red} rot={90} delay={B3.cards[1] - 2} z={5} />
      <Arrow x={235} y={546} w={95} h={64} color={P.red} rot={90} delay={B3.cards[2] - 2} z={5} />
      <div style={{ position: "absolute", left: 160, top: 786, width: uw, height: 16, background: P.red, zIndex: 6, transform: "rotate(-0.8deg)" }} />
      <Strip text="Bản HS 2022 đang áp dụng" x={1130} y={110} size={34} rot={3} bg={P.mustard} fg={P.charcoal} font={BE} k={0.62} seed={9} delay={B3.cards[2]} />
      <Stamp x={1500} y={640} text="QUỐC TẾ" size={64} color={P.paper} rot={-7} delay={B3.ding + 6} />
    </Fill>
  );
};

// ---------- beat 4 ----------
const BeanCard: React.FC<{ x: number; y: number; rot: number; delay: number; roast: boolean; sx?: number; tag?: string; tagDelay: number; label?: string; seed: number }> = ({ x, y, rot, delay, roast, sx = 1, tag, tagDelay, label, seed }) => (
  <>
    <Piece x={x} y={y} w={640} h={570} rot={rot} delay={delay} enter="drop" seed={seed} z={4} wobble={0.4}>
      <svg width="640" height="330" viewBox="0 0 640 330"><BeanPile cx={320} cy={160} roast={roast} sx={sx} s={1.45} /></svg>
      <Center w={640} h={70} style={{ marginTop: 6 }}>
        {label && <Txt size={50} font={BE} style={{ fontWeight: 800 }}>{label}</Txt>}
      </Center>
    </Piece>
    <Tape x={x + 40} y={y - 14} rot={-24} delay={delay + 3} w={130} />
    <Tape x={x + 470} y={y - 14} rot={22} delay={delay + 3} w={130} />
    {tag && <Strip text={tag} x={x + 150} y={y + 440} size={100} rot={rot * 1.5} bg={P.mustard} fg={P.charcoal} seed={seed + 1} delay={tagDelay} z={7} />}
  </>
);

export const Beat4: React.FC = () => {
  const f = useStep();
  const t = f - B4.flip;
  const roast = t >= 0;
  const sx = Math.abs(t) < 6 ? 0.15 + (0.85 * Math.abs(t)) / 6 : 1;
  return (
    <Fill color={P.rust}>
      <Layer depth={0.3}>
        <div style={{ position: "absolute", left: 1450, top: 80, width: 250, height: 250, borderRadius: "50%", border: "20px solid rgba(60,28,10,0.35)", filter: "url(#rough)" }} />
        <div style={{ position: "absolute", left: 1520, top: 150, width: 120, height: 120, borderRadius: "50%", border: "12px solid rgba(60,28,10,0.25)", filter: "url(#rough)" }} />
        <Halftone x={0} y={600} w={900} h={480} color={P.charcoal} dot={14} dir="to top right" opacity={0.3} />
      </Layer>
      <Layer depth={0.6}>
        <Piece x={560} y={40} w={860} h={230} rot={-3} delay={B4.clip} enter="up" seed={44} z={2}>
          <div style={{ padding: "22px 40px" }}>
            <Txt size={26} font={SERIF} style={{ letterSpacing: 6 }}>THƯƠNG MẠI · NÔNG SẢN</Txt>
            <div style={{ height: 4, background: P.charcoal, margin: "6px 0 0" }} />
            <Txt size={140} style={{ marginTop: 10 }}>CÀ PHÊ: <span style={{ color: P.red }}>0901</span></Txt>
          </div>
        </Piece>
      </Layer>
      <Layer depth={1}>
        <BeanCard x={170} y={290} rot={-3} delay={B4.left} roast={false} tag="090111" tagDelay={B4.left + 8} label="CHƯA RANG" seed={52} />
        <BeanCard x={1110} y={310} rot={3} delay={B4.right} roast={roast} sx={sx} tag={roast ? "090121" : undefined} tagDelay={B4.flip + 4} label={roast ? "ĐÃ RANG" : "CHƯA RANG"} seed={62} />
      </Layer>
      <Layer depth={1.7}>
        <Scraps seed={7} n={3} area={[1780, 380, 110, 480]} z={8} colors={[P.mustard, P.paper, P.charcoal]} />
        <Scraps seed={8} n={2} area={[0, 800, 110, 80]} z={8} colors={[P.mustard, P.paper]} />
      </Layer>
    </Fill>
  );
};

// ---------- beat 5 ----------
export const Beat5: React.FC = () => {
  const f = useStep();
  const rows = [
    { code: "VN", y: 250, extra: ".xx", ew: 240, n: "8 SỐ", note: "0901.11" },
    { code: "EU", y: 450, extra: " xx", ew: 240, n: "8 SỐ", note: "0901 11" },
    { code: "US", y: 650, extra: ".xx.xx", ew: 420, n: "10 SỐ", note: "0901.11" },
  ];
  const ax = interpolate(f - B5.arrow, [0, 28], [-420, 2100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fill color={P.avocado}>
      <Halftone x={1200} y={-60} w={800} h={420} color={P.charcoal} dot={16} dir="to bottom left" opacity={0.3} />
      <Halftone x={-80} y={720} w={800} h={420} color={P.paper} dot={14} dir="to top right" opacity={0.2} />
      <Strip text="6 SỐ CHUNG, 8 SỐ CỦA TỪNG NƯỚC" x={110} y={56} size={86} rot={-1.5} bg={P.paper} fg={P.charcoal} seed={5} delay={0} enter="left" />
      {rows.map((r, i) => (
        <React.Fragment key={i}>
          <Stamp x={70} y={r.y - 4} text={r.code} size={66} color={P.paper} rot={-6} ring w={140} delay={B5.tapes[i]} />
          <Piece x={250} y={r.y} w={640} h={130} rot={-0.6} delay={B5.tapes[i]} enter="left" tear="rt" seed={70 + i} z={3}>
            <Center w={640} h={130}><Txt size={104} style={{ letterSpacing: 4 }}>{r.note}</Txt></Center>
          </Piece>
          <Piece x={890} y={r.y + 6} w={r.ew} h={124} rot={1.2} color={P.mustard} delay={B5.extras[i]} seed={80 + i} z={3} tear="lb">
            <Center w={r.ew} h={124}><Txt size={104} color={P.red} style={{ letterSpacing: 4 }}>{r.extra}</Txt></Center>
          </Piece>
          <Strip text={r.n} x={890 + r.ew + 50} y={r.y + 4} size={84} rot={-2} bg={P.red} fg={P.paper} seed={90 + i} delay={B5.extras[i] + 8} />
        </React.Fragment>
      ))}
      <Strip text="6 số đầu giống nhau toàn cầu" x={250} y={182} size={30} font={BE} k={0.62} rot={-1} bg={P.mustard} fg={P.charcoal} seed={13} delay={B5.tapes[0] + 4} />
      <div style={{ position: "absolute", left: ax, top: 835, zIndex: 9, width: 360, height: 100, opacity: f >= B5.arrow ? 1 : 0 }}>
        <Arrow x={0} y={0} w={360} h={100} color={P.red} enter="none" delay={B5.arrow} />
      </div>
    </Fill>
  );
};

// ---------- beat 6 ----------
export const Beat6: React.FC = () => {
  const f = useStep();
  const rowH = 72;
  const top = 250;
  const circleLen = 2 * Math.PI * 120;
  const dash = interpolate(f - B6.circle, [0, 14], [circleLen, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keys = Array.from({ length: 16 });
  return (
    <Fill color={P.red}>
      <Halftone x={1100} y={-80} w={900} h={500} color={P.charcoal} dot={16} dir="to bottom left" opacity={0.35} />
      <Halftone x={-80} y={680} w={800} h={420} color={P.mustard} dot={14} dir="to top right" opacity={0.3} />
      <Piece x={190} y={110} w={1140} h={700} rot={-2} delay={B6.clip} enter="up" seed={66} z={2}>
        <div style={{ padding: "30px 46px" }}>
          <Txt size={62} font={PLAYFAIR}>BIỂU THUẾ</Txt>
          <div style={{ height: 6, background: P.red, margin: "10px 0 0" }} />
        </div>
        {B6.rows.map((d, i) => {
          const hl = f - d >= 0 && f - d < 12;
          const circled = i === 3 && f >= B6.circle;
          return (
            <div key={i} style={{ position: "absolute", left: 40, top: top - 110 + 20 + i * rowH, width: 1060, height: rowH - 8, background: hl || circled ? "rgba(224,165,38,0.6)" : "transparent", borderBottom: "3px solid rgba(34,34,34,0.4)", display: "flex", alignItems: "center", gap: 30, padding: "0 20px" }}>
              <div style={{ width: 170, height: 12, background: P.charcoal, borderRadius: 3, opacity: 0.8 }} />
              <div style={{ width: 530 - i * 18, height: 8, background: "rgba(34,34,34,0.5)", borderRadius: 3 }} />
              <div style={{ marginLeft: "auto", width: 130, height: 44, border: `4px solid ${P.charcoal}`, background: P.rim }} />
            </div>
          );
        })}
      </Piece>
      <Tape x={170} y={96} rot={-28} delay={B6.clip + 3} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, zIndex: 8 }}>
        <ellipse cx="760" cy="500" rx="560" ry="46" fill="none" stroke={P.mustard} strokeWidth="14" strokeLinecap="round" strokeDasharray={circleLen * 4.6} strokeDashoffset={dash * 4.6} transform="rotate(-1.5 760 500)" />
      </svg>
      <Pop x={1090} y={440} wobble={1.5} delay={B6.magnifier} z={7}>
        <svg width="420" height="420" viewBox="0 0 420 420">
          <line x1="250" y1="250" x2="370" y2="370" stroke={P.charcoal} strokeWidth="36" strokeLinecap="round" />
          <circle cx="170" cy="170" r="125" fill="rgba(255,255,255,0.28)" stroke={P.charcoal} strokeWidth="24" />
          <path d="M95 140 Q120 90 180 80" stroke="rgba(255,255,255,0.7)" strokeWidth="12" fill="none" strokeLinecap="round" />
        </svg>
      </Pop>
      <Piece x={1420} y={130} w={380} h={470} rot={4} color={P.charcoal} delay={B6.magnifier + 4} enter="right" edge="cut" seed={77} z={3}>
        <div style={{ padding: 30 }}>
          <div style={{ height: 90, background: P.mustard, border: `5px solid ${P.paper}` }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 28 }}>
            {keys.map((_, i) => <div key={i} style={{ height: 62, background: i % 4 === 3 ? P.red : P.paper, borderRadius: 6 }} />)}
          </div>
        </div>
      </Piece>
      <Stamp x={720} y={655} text="KHAI MÃ" size={96} color={P.red} rot={-9} delay={B6.stamp} />
    </Fill>
  );
};

// ---------- beat 7 ----------
const Route: React.FC<{ x: number; y: number; barriers: boolean; color: string; arrowColor: string; delay: number; w: number }> = ({ x, y, barriers, color, arrowColor, delay, w }) => (
  <>
    <Piece x={x} y={y} w={130} h={130} rot={-4} color={P.mustard} edge="cut" delay={delay} seed={3} z={5}>
      <Center w={130} h={130}><Txt size={64}>VN</Txt></Center>
    </Piece>
    <Arrow x={x + 150} y={y + 20} w={w} h={92} color={arrowColor} delay={delay + 4} z={4} />
    {barriers && [0.3, 0.48, 0.66].map((p, i) => (
      <Piece key={i} x={x + 150 + w * p} y={y + 4} w={30} h={120} color={color} edge="cut" delay={delay + 8 + i * 3} seed={20 + i} z={6} />
    ))}
    <Piece x={x + 170 + w} y={y} w={190} h={130} rot={3} color={P.paper} edge="cut" delay={delay + 6} seed={9} z={5}>
      <Center w={190} h={130}><Txt size={28} font={BE} style={{ fontWeight: 800 }}>NƯỚC NHẬP KHẨU</Txt></Center>
    </Piece>
  </>
);

export const Beat7: React.FC = () => (
  <Fill color={P.paper}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 170, background: P.charcoal }} />
    <div style={{ position: "absolute", left: 0, top: 830, width: 1920, height: 250, background: P.charcoal }} />
    <Halftone x={0} y={800} w={1920} h={60} color={P.paper} dot={10} dir="to bottom" opacity={0.5} />
    <Words words={["THUẾ THƯỜNG", "VS", "THUẾ ƯU ĐÃI"]} x={170} y={22} size={100} delay={0} step={6} seed={101} styles={[{ bg: P.paper, fg: P.charcoal }, { bg: P.mustard, fg: P.charcoal, font: PLAYFAIR }, { bg: P.red, fg: P.paper }]} />
    <Piece x={110} y={210} w={790} h={580} rot={-1} color="#CFC8B8" delay={B7.left} enter="left" seed={71} z={2}>
      <Center w={790} h={250} style={{ justifyContent: "flex-start", paddingTop: 30 }}>
        <Txt size={124}>THUẾ MFN</Txt>
        <Txt size={34} font={BE} style={{ fontWeight: 800, marginTop: 10 }}>Mức thuế thường, áp cho mọi nước</Txt>
      </Center>
    </Piece>
    <Route x={150} y={560} barriers color={P.charcoal} arrowColor="#8C8678" delay={B7.arrow} w={330} />
    <Piece x={1020} y={210} w={790} h={580} rot={1} color={P.red} delay={B7.right} enter="right" seed={72} z={2}>
      <Center w={790} h={250} style={{ justifyContent: "flex-start", paddingTop: 30 }}>
        <Txt size={124} color={P.paper}>ƯU ĐÃI FTA</Txt>
        <Txt size={34} font={BE} color={P.paper} style={{ fontWeight: 800, marginTop: 10 }}>Mức ưu đãi theo hiệp định</Txt>
      </Center>
    </Piece>
    <Route x={1060} y={560} barriers={false} color={P.charcoal} arrowColor={P.mustard} delay={B7.arrow + 6} w={330} />
    <Stamp x={1090} y={430} text="EVFTA" size={74} color={P.paper} rot={-6} delay={B7.evfta} />
    <Stamp x={1420} y={440} text="CPTPP" size={74} color={P.mustard} rot={5} delay={B7.cptpp} />
  </Fill>
);

// ---------- beat 8 ----------
export const Beat8: React.FC = () => {
  const f = useStep();
  const pulse = f > B8.seal + 8 ? 1 + 0.03 * Math.sin(f * 0.5) : 1;
  return (
    <Fill color={P.mustard}>
      <Halftone x={1200} y={780} w={800} h={400} color={P.red} dot={16} dir="to top left" opacity={0.4} />
      <Halftone x={-60} y={-60} w={700} h={400} color={P.charcoal} dot={14} dir="to bottom right" opacity={0.2} />
      <Piece x={110} y={110} w={1010} h={720} rot={-2} delay={B8.cert} enter="drop" seed={88} z={2}>
        <div style={{ position: "absolute", inset: 30, border: `7px double ${P.red}` }} />
        <div style={{ padding: "58px 80px" }}>
          <Txt size={34} font={SERIF} style={{ letterSpacing: 5 }}>GIẤY CHỨNG NHẬN LƯU THÔNG</Txt>
          <Txt size={200} color={P.red} style={{ marginTop: 20 }}>EUR.1</Txt>
          <Txt size={34} font={BE} style={{ fontWeight: 800, margin: "6px 0 28px" }}>Do Bộ Công Thương cấp</Txt>
          <Greek w={560} lines={5} seed={5} gap={16} />
          <div style={{ height: 4, background: P.charcoal, width: 440, marginTop: 36 }} />
        </div>
      </Piece>
      <Tape x={90} y={95} rot={-32} delay={B8.cert + 3} />
      <svg width="90" height="200" viewBox="0 0 90 200" style={{ position: "absolute", left: 900, top: 70, zIndex: 8, transform: "rotate(8deg)" }}>
        <path d="M25 160 L25 40 Q25 10 50 10 Q75 10 75 40 L75 150 Q75 185 45 185 Q18 185 18 150 L18 60" fill="none" stroke="#8A8A8A" strokeWidth="7" strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 700, top: 500, zIndex: 9, transform: `scale(${pulse})` }}>
        <Stamp x={0} y={0} text="CHỨNG NHẬN" sub="✦ ✦ ✦" size={46} color={P.blue} rot={-12} ring w={290} delay={B8.seal} />
      </div>
      <Strip text="ƯU ĐÃI CẦN" x={1200} y={70} size={86} rot={-2} bg={P.charcoal} fg={P.paper} seed={3} delay={B8.head} enter="right" />
      <Strip text="CHỨNG TỪ" x={1260} y={190} size={86} rot={2} bg={P.red} fg={P.paper} seed={4} delay={B8.head + 5} enter="right" />
      <Strip text="XUẤT XỨ" x={1220} y={310} size={86} rot={-1} bg={P.paper} fg={P.charcoal} seed={5} delay={B8.head + 10} enter="right" />
      <Piece x={1170} y={520} w={640} h={310} rot={4} color={P.rim} delay={B8.slip} enter="right" seed={97} z={5}>
        <Center w={640} h={310}>
          <Txt size={74}>KHAI XUẤT XỨ</Txt>
          <Txt size={116} color={P.red} style={{ marginTop: 8 }}>≤ 6.000 €</Txt>
          <Txt size={28} font={BE} style={{ fontWeight: 800, marginTop: 6 }}>cho lô hàng nhỏ</Txt>
        </Center>
      </Piece>
      <Tape x={1500} y={500} rot={18} delay={B8.slip + 4} w={140} />
    </Fill>
  );
};

// ---------- beat 9 ----------
const Icon: React.FC<{ kind: number }> = ({ kind }) => {
  if (kind === 0) {
    return (
      <svg width="170" height="130" viewBox="0 0 170 130"><polygon points="10,65 45,10 160,10 160,120 45,120" fill={P.mustard} stroke={P.charcoal} strokeWidth="5" /><circle cx="42" cy="65" r="9" fill={P.charcoal} /><text x="102" y="82" textAnchor="middle" fontFamily={ANTON} fontSize="48" fill={P.charcoal}>0901</text></svg>
    );
  }
  if (kind === 1) {
    return (
      <svg width="170" height="130" viewBox="0 0 170 130"><rect x="10" y="10" width="150" height="110" fill={P.rim} stroke={P.charcoal} strokeWidth="5" />{[40, 70, 95].map((y) => <line key={y} x1="10" x2="160" y1={y} y2={y} stroke={P.charcoal} strokeWidth="4" />)}{[60, 110].map((x) => <line key={x} y1="10" y2="120" x1={x} x2={x} stroke={P.charcoal} strokeWidth="4" />)}<rect x="10" y="10" width="150" height="30" fill={P.red} /></svg>
    );
  }
  return (
    <svg width="170" height="130" viewBox="0 0 170 130"><rect x="25" y="8" width="110" height="114" fill={P.rim} stroke={P.charcoal} strokeWidth="5" /><rect x="40" y="22" width="80" height="8" fill={P.charcoal} /><rect x="40" y="40" width="60" height="6" fill={P.charcoal} opacity="0.5" /><circle cx="108" cy="92" r="22" fill={P.blue} stroke={P.charcoal} strokeWidth="4" /><text x="108" y="100" textAnchor="middle" fontFamily={ANTON} fontSize="24" fill={P.paper}>✦</text></svg>
  );
};

export const Beat9: React.FC = () => {
  const f = useStep();
  const tabs = [
    { t: "XÁC ĐỊNH MÃ HS", y: 235, x: 140, bg: "#E7D7AE" },
    { t: "TRA THUẾ NƯỚC NHẬP KHẨU", y: 445, x: 230, bg: P.mustard },
    { t: "CHUẨN BỊ CHỨNG TỪ XUẤT XỨ", y: 655, x: 320, bg: "#E7D7AE" },
  ];
  return (
    <Fill color={P.offwhite}>
      <Layer depth={0.4}>
        <Halftone x={1100} y={-80} w={900} h={460} color={P.red} dot={16} dir="to bottom left" opacity={0.28} />
        <Halftone x={-100} y={700} w={900} h={420} color={P.charcoal} dot={14} dir="to top right" opacity={0.18} />
      </Layer>
      <Layer depth={1}>
        <Strip text="3 BƯỚC CHO LÔ HÀNG" x={150} y={66} size={100} rot={-1.5} bg={P.charcoal} fg={P.paper} seed={9} delay={0} enter="left" />
        {tabs.map((tab, i) => {
          const cd = B9.checks[i];
          const len = 330;
          const off = interpolate(f - cd, [0, 8], [len, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <React.Fragment key={i}>
              <Piece x={tab.x} y={tab.y} w={1300} h={180} rot={i === 1 ? 0.6 : -0.5} color={tab.bg} delay={B9.tabs[i]} enter="left" tear="rb" seed={110 + i} z={3}>
                <div style={{ position: "absolute", left: 30, top: 25, width: 130, height: 130, background: P.red, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 110, color: P.paper }}>{i + 1}</div>
                <div style={{ position: "absolute", left: 200, top: 0, height: 180, width: 820, display: "flex", alignItems: "center", fontFamily: ANTON, fontSize: tab.t.length > 22 ? 62 : 74, color: P.charcoal, letterSpacing: 1 }}>{tab.t}</div>
                <div style={{ position: "absolute", left: 1090, top: 25 }}><Icon kind={i} /></div>
              </Piece>
              <svg width={200} height={150} style={{ position: "absolute", left: tab.x + 910, top: tab.y + 20, zIndex: 8, opacity: f >= cd ? 1 : 0 }}>
                <path d="M20 80 L70 125 L180 15" fill="none" stroke="#1F7A3A" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={off} />
              </svg>
            </React.Fragment>
          );
        })}
      </Layer>
      <Layer depth={1.8}>
        <Scraps seed={19} n={5} area={[1500, 120, 380, 100]} z={0} colors={[P.mustard, P.red, P.charcoal]} />
      </Layer>
    </Fill>
  );
};

// ---------- beat 10 ----------
export const Beat10: React.FC = () => {
  const f = useStep();
  const cursor = Math.floor(f / 7) % 2 === 0;
  const dis = DISCLAIMER_AT();
  return (
    <Fill color={P.paper}>
      <Halftone x={1150} y={560} w={800} h={520} color={P.red} dot={16} dir="to top left" opacity={0.3} />
      <Halftone x={-80} y={-60} w={700} h={360} color={P.mustard} dot={14} dir="to bottom right" opacity={0.5} />
      <Words words={["6", "CHỮ", "SỐ", "QUYẾT", "ĐỊNH", "THUẾ"]} x={60} y={26} size={46} delay={B10.browser + 4} step={2} gap={10} seed={131} />
      <Piece x={140} y={150} w={1030} h={620} rot={-2} delay={B10.browser} enter="left" seed={121} z={2}>
        <div style={{ height: 76, background: P.charcoal, display: "flex", alignItems: "center", gap: 14, padding: "0 26px" }}>
          {[P.red, P.mustard, P.avocado].map((c) => <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />)}
          <div style={{ marginLeft: 22, flex: 1, height: 44, background: P.paper, borderRadius: 22, display: "flex", alignItems: "center", padding: "0 22px", fontFamily: BE, fontWeight: 600, fontSize: 28, color: P.charcoal }}>openbtob.com/hs</div>
        </div>
        <div style={{ position: "absolute", top: 76, bottom: 0, left: 0, right: 0, background: P.offwhite, padding: "70px 60px" }}>
          <Txt size={64} font={PLAYFAIR} style={{ marginBottom: 36 }}>Tra mã HS</Txt>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1, height: 100, border: `6px solid ${P.charcoal}`, background: P.rim, borderRadius: 12, display: "flex", alignItems: "center", padding: "0 30px", fontFamily: BE, fontWeight: 800, fontSize: 48, color: "#8C8678" }}>
              mã HS<span style={{ display: "inline-block", width: 5, height: 56, marginLeft: 8, background: cursor ? P.charcoal : "transparent" }} />
            </div>
            <div style={{ width: 180, height: 100, background: P.red, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 50, color: P.paper }}>TRA</div>
          </div>
        </div>
      </Piece>
      <Tape x={120} y={135} rot={-30} delay={B10.browser + 3} />
      <Strip text="TRA MÃ HS" x={1210} y={190} size={130} rot={2} bg={P.charcoal} fg={P.paper} seed={7} delay={B10.head} enter="right" />
      <Piece x={1200} y={400} w={640} h={120} rot={-2} color={P.mustard} delay={B10.url} seed={8} z={4}>
        <Center w={640} h={120}><Txt size={62} font={BE} style={{ fontWeight: 800 }}>openbtob.com/hs</Txt></Center>
      </Piece>
      <Piece x={230} y={870} w={1460} h={110} rot={-0.6} color={P.mustard} delay={dis} enter="up" seed={9} z={9} tear="tb">
        <Center w={1460} h={110}><Txt size={46} font={BE} style={{ fontWeight: 800 }}>Thông tin tham khảo, không phải tư vấn pháp lý</Txt></Center>
      </Piece>
      <Tape x={200} y={860} rot={-20} delay={dis + 3} w={120} z={10} />
      <Tape x={1600} y={860} rot={18} delay={dis + 3} w={120} z={10} />
    </Fill>
  );
};

export const BEATS = [Beat1, Beat2, Beat3, Beat4, Beat5, Beat6, Beat7, Beat8, Beat9, Beat10];
// metadata per beat: camera move, source caption (verified-fact beats only)
export const META: { cam: "push_in" | "pan" | "tilt" | "parallax" | "pull_out" | "static"; origin?: string; src?: string }[] = [
  { cam: "push_in" },
  { cam: "pan", src: "Nguồn: Tổ chức Hải quan Thế giới (WCO), wcoomd.org" },
  { cam: "tilt", src: "Nguồn: WCO, HS Nomenclature 2022" },
  { cam: "parallax", src: "Nguồn: WCO, HS Nomenclature 2022" },
  { cam: "pull_out", src: "Nguồn: biểu thuế Việt Nam, EU (CN), Mỹ (HTS); chữ xx chỉ là minh họa" },
  { cam: "push_in", origin: "40% 46%" },
  { cam: "static" },
  { cam: "tilt", src: "Nguồn: Ủy ban châu Âu, hướng dẫn xuất xứ EVFTA" },
  { cam: "parallax" },
  { cam: "pull_out" },
];
