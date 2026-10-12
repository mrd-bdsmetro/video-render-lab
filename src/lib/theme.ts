import { loadFont } from "@remotion/google-fonts/BeVietnamPro";

// Be Vietnam Pro with the vietnamese subset so every diacritic renders.
export const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["vietnamese", "latin", "latin-ext"],
});

// Cloudflare Kumo orange brand variant, as used on openbtob.com
// (opentrade app/web/app/globals.css: brand = Tailwind v4 orange-700/800 over Kumo).
// Hex values are sRGB conversions of the browser-computed Tailwind v4 oranges.
export const C = {
  brand: "#ca3500", // orange-700: primary buttons, links, eyebrow text
  brandDark: "#9f2d00", // orange-800: Kumo brand token (focus, hover)
  accent: "#ff6900", // orange-500: highlights and glows
  tint: "#ffedd4", // orange-100
  bg: "#fafafa", // Kumo neutral-50
  card: "#ffffff",
  line: "#e5e5e5", // neutral-200
  text: "#171717", // neutral-900
  muted: "#737373", // neutral-500
};

export const FPS = 30;
export const TRANSITION = 15;
