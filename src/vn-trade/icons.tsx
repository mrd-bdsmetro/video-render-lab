import React from "react";
import { V } from "./theme";

// Line icons drawn in SVG (64x64). `draw` 0..1 draws the strokes on.
type P = { draw: number; size?: number; color?: string };

const Wrap: React.FC<P & { children: (s: React.SVGProps<SVGElement>) => React.ReactNode }> = ({ draw, size = 64, color = V.accent, children }) => {
  const s = { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw } as unknown as React.SVGProps<SVGElement>;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      {children(s)}
    </svg>
  );
};

const path = (d: string, s: object, k?: string | number) => <path key={k ?? d} d={d} {...(s as object)} />;

export const IconChip: React.FC<P> = (p) => (
  <Wrap {...p}>
    {(s) => (
      <>
        <rect x={18} y={18} width={28} height={28} rx={4} {...(s as object)} />
        <rect x={26} y={26} width={12} height={12} rx={2} {...(s as object)} />
        {path("M24 18V10M32 18V10M40 18V10M24 46V54M32 46V54M40 46V54M18 24H10M18 32H10M18 40H10M46 24H54M46 32H54M46 40H54", s)}
      </>
    )}
  </Wrap>
);

export const IconGear: React.FC<P> = (p) => {
  const teeth = Array.from({ length: 8 }, (_, k) => {
    const a = (k * Math.PI) / 4;
    const c = Math.cos(a), sn = Math.sin(a);
    return `M${32 + c * 18} ${32 + sn * 18}L${32 + c * 25} ${32 + sn * 25}`;
  }).join("");
  return (
    <Wrap {...p}>
      {(s) => (
        <>
          <circle cx={32} cy={32} r={18} {...(s as object)} />
          <circle cx={32} cy={32} r={7} {...(s as object)} />
          {path(teeth, s)}
        </>
      )}
    </Wrap>
  );
};

export const IconPhone: React.FC<P> = (p) => (
  <Wrap {...p}>
    {(s) => (
      <>
        <rect x={20} y={7} width={24} height={50} rx={5} {...(s as object)} />
        <circle cx={32} cy={50} r={2} {...(s as object)} />
        {path("M28 13H36", s)}
      </>
    )}
  </Wrap>
);

export const IconShirt: React.FC<P> = (p) => (
  <Wrap {...p}>{(s) => path("M24 10L11 18L16 29L22 26V54H42V26L48 29L53 18L40 10C38 16 26 16 24 10Z", s)}</Wrap>
);

export const IconShoe: React.FC<P> = (p) => (
  <Wrap {...p}>
    {(s) => (
      <>
        {path("M7 40C7 33 11 31 16 31L22 27L27 33L36 35C46 36 57 38 57 44V49H7Z", s, "a")}
        {path("M7 49H57M25 38L29 33", s, "b")}
      </>
    )}
  </Wrap>
);

export const IconTruck: React.FC<P> = (p) => (
  <Wrap {...p}>
    {(s) => (
      <>
        <rect x={5} y={20} width={31} height={26} rx={2} {...(s as object)} />
        {path("M36 29H48L58 38V46H36", s)}
        <circle cx={18} cy={48} r={5} {...(s as object)} />
        <circle cx={47} cy={48} r={5} {...(s as object)} />
      </>
    )}
  </Wrap>
);

export const IconWood: React.FC<P> = (p) => (
  <Wrap {...p}>
    {(s) => (
      <>
        {path("M22 20H48A12 12 0 0 1 48 44H22", s, "a")}
        <circle cx={22} cy={32} r={12} {...(s as object)} />
        <circle cx={22} cy={32} r={6} {...(s as object)} />
        <circle cx={22} cy={32} r={1.5} {...(s as object)} />
      </>
    )}
  </Wrap>
);

export const IconFish: React.FC<P> = (p) => (
  <Wrap {...p}>
    {(s) => (
      <>
        {path("M8 32C16 19 34 19 43 32C34 45 16 45 8 32Z", s, "a")}
        {path("M43 32L58 21V43Z", s, "b")}
        <circle cx={18} cy={30} r={1.8} {...(s as object)} />
      </>
    )}
  </Wrap>
);

export const IconCup: React.FC<P> = (p) => (
  <Wrap {...p}>
    {(s) => (
      <>
        {path("M12 27H44V38A12 12 0 0 1 32 50H24A12 12 0 0 1 12 38Z", s, "a")}
        {path("M44 30H48A6 6 0 0 1 48 42H43", s, "b")}
        {path("M20 8C16 13 24 15 20 21M30 8C26 13 34 15 30 21", s, "c")}
        {path("M10 56H50", s, "d")}
      </>
    )}
  </Wrap>
);

export const ICONS = {
  electronics: IconChip,
  machinery: IconGear,
  phones: IconPhone,
  textiles: IconShirt,
  footwear: IconShoe,
  transport: IconTruck,
  wood: IconWood,
  seafood: IconFish,
} as const;
