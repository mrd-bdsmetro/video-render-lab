// Job spec loading and validation. Pure functions, no network, no secrets.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { parse } from "yaml";

export const CHAR_CAP = 1500; // ElevenLabs free tier is 10k chars/month; fail a job above this before any API call
export const MAX_RATE = 5; // edge-tts fallback rate, percent
export const MAX_MB = 60;

// Per-composition adapters: where its narration, voice files and durations live.
export const ADAPTERS = {
  HsExplainerVi: {
    scenes: 10,
    narrationFile: "src/hs-explainer/narration.mjs",
    durationsFile: "src/hs-explainer/vo-durations.json",
    voDir: "public/hs-explainer/vo",
    voName: (id) => `beat-${String(id).padStart(2, "0")}.mp3`,
  },
};

// Content rules: no prices, no competitors, no unverified duty rates, no vendor names.
const BANNED = [
  [/\d[\d.,]*\s*(%|usd|vnd|eur|đ\b|đồng)|[$€£]\s*\d|\b(usd|vnd|price|pricing)\b/iu, "price or rate figure"],
  [/\b(panjiva|volza|importgenius|import genius|zauba|seair|tridge)\b/iu, "competitor name"],
  [/\b(importyeti|gtis|apify|elevenlabs|scrapecreators|cloudflare|anthropic|claude|remotion)\b/iu, "vendor name"],
];

export function listJobFiles(dir = "jobs") {
  return readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort().map((f) => `${dir}/${f}`);
}

export function loadJob(file) {
  const job = parse(readFileSync(file, "utf8"));
  job.__file = file;
  return job;
}

export function validateJob(job) {
  const errs = [];
  const slug = job.slug;
  if (!/^[a-z0-9][a-z0-9-]{0,60}$/.test(slug ?? "")) errs.push("slug must match [a-z0-9-]");
  else if (job.__file && !job.__file.endsWith(`/${slug}.yaml`)) errs.push("slug must equal the file name");
  const ad = ADAPTERS[job.composition];
  if (!ad) errs.push(`unknown composition ${job.composition}`);
  const scenes = Array.isArray(job.scenes) ? job.scenes : [];
  if (!scenes.length) errs.push("scenes is empty");
  if (ad && scenes.length !== ad.scenes) errs.push(`${job.composition} needs ${ad.scenes} scenes, got ${scenes.length}`);
  scenes.forEach((s, i) => {
    if (s.id !== i + 1) errs.push(`scene ${i + 1}: id must be ${i + 1}`);
    if (!s.tts?.trim() || !s.text?.trim()) errs.push(`scene ${i + 1}: tts and text are required`);
    for (const [re, what] of BANNED) {
      if (re.test(s.tts ?? "") || re.test(s.text ?? "")) errs.push(`scene ${i + 1}: ${what}`);
    }
  });
  const chars = charCount(job);
  if (chars > CHAR_CAP) errs.push(`voice text is ${chars} chars, cap is ${CHAR_CAP}`);
  const rate = job.voice?.rate ?? 0;
  if (!(rate >= 0 && rate <= MAX_RATE)) errs.push(`voice.rate must be 0..${MAX_RATE}`);
  for (const p of [...(job.images ?? []), ...(job.sfx ?? []).map((x) => x.file)]) {
    if (!p || p.includes("..") || !p.startsWith("public/") || !existsSync(p)) errs.push(`missing asset ${p}`);
  }
  return errs;
}

export const charCount = (job) => (job.scenes ?? []).reduce((a, s) => a + (s.tts ?? "").length, 0);
