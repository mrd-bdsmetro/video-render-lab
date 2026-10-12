import React, { useMemo } from "react";
import { LAND, Poly } from "./landmass";
import { V } from "./theme";

export const MAP_W = 1700;
export const MAP_H = 634;
const LON0 = -25;
const LAT_TOP = 78;
const LAT_SPAN = 134;

const norm = (lon: number) => (lon < LON0 ? lon + 360 : lon);
export const px = (lon: number, lat: number): [number, number] => [((norm(lon) - LON0) / 360) * MAP_W, ((LAT_TOP - lat) / LAT_SPAN) * MAP_H];

const inside = (x: number, y: number, poly: [number, number][]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

const STEP = 10.6; // px between dots

/** Dotted land mask, computed once. */
export const LandDots: React.FC = () => {
  const dots = useMemo(() => {
    const polys = LAND.map((p: Poly) => p.map(([lo, la]) => px(lo, la)));
    const out: [number, number][] = [];
    for (let y = STEP / 2; y < MAP_H; y += STEP) {
      for (let x = STEP / 2; x < MAP_W; x += STEP) {
        if (polys.some((p) => inside(x, y, p))) out.push([x, y]);
      }
    }
    return out;
  }, []);
  return (
    <g fill={V.dot}>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} />
      ))}
    </g>
  );
};
