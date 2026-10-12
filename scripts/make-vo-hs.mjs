// Generates one MP3 per beat of the HS explainer with edge-tts (vi-VN-HoaiMyNeural), measures durations with ffprobe,
// and writes src/hs-explainer/vo-durations.json (seconds per beat id).
// Usage: node scripts/make-vo-hs.mjs
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { NARRATION } from "../src/hs-explainer/narration.mjs";

const outDir = fileURLToPath(new URL("../public/hs-explainer/vo/", import.meta.url));
const durFile = fileURLToPath(new URL("../src/hs-explainer/vo-durations.json", import.meta.url));
mkdirSync(outDir, { recursive: true });

const durations = {};
for (const n of NARRATION) {
  const file = `${outDir}beat-${String(n.id).padStart(2, "0")}.mp3`;
  let r;
  for (let attempt = 0; attempt < 4; attempt++) {
    r = spawnSync("py", ["-m", "edge_tts", "--voice", "vi-VN-HoaiMyNeural", "--rate=+22%", "--text", n.tts, "--write-media", file], { encoding: "utf8" });
    if (r.status === 0) break;
  }
  if (r.status !== 0) throw new Error(`edge_tts failed for beat ${n.id}: ${r.stderr?.slice(-300)}`);
  const p = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file], { encoding: "utf8" });
  durations[n.id] = Math.round(parseFloat(p.stdout) * 1000) / 1000;
  console.log(`beat ${n.id}: ${durations[n.id]} s`);
}
writeFileSync(durFile, JSON.stringify(durations, null, 2) + "\n");
console.log("total VO", Object.values(durations).reduce((a, b) => a + b, 0).toFixed(1), "s");
