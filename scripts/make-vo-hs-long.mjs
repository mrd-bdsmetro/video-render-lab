// VO for the long HS explainer: edge-tts vi-VN-HoaiMyNeural at +5% (the short version's +22% felt too fast).
// Skips beats whose mp3 exists unless --force. Usage: node scripts/make-vo-hs-long.mjs [--force]
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { NARRATION } from "../src/hs-explainer-long/narration.mjs";

const outDir = fileURLToPath(new URL("../public/hs-explainer-long/vo/", import.meta.url));
const durFile = fileURLToPath(new URL("../src/hs-explainer-long/vo-durations.json", import.meta.url));
mkdirSync(outDir, { recursive: true });
const force = process.argv.includes("--force");
const durations = existsSync(durFile) ? JSON.parse(readFileSync(durFile, "utf8")) : {};
for (const n of NARRATION) {
  const file = `${outDir}beat-${String(n.id).padStart(2, "0")}.mp3`;
  if (!force && existsSync(file) && durations[n.id]) continue;
  let r;
  for (let attempt = 0; attempt < 4; attempt++) {
    r = spawnSync("py", ["-m", "edge_tts", "--voice", "vi-VN-HoaiMyNeural", "--rate=+5%", "--text", n.tts, "--write-media", file], { encoding: "utf8" });
    if (r.status === 0) break;
  }
  if (r.status !== 0) throw new Error(`edge_tts failed for beat ${n.id}: ${r.stderr?.slice(-300)}`);
  const p = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file], { encoding: "utf8" });
  durations[n.id] = Math.round(parseFloat(p.stdout) * 1000) / 1000;
  writeFileSync(durFile, JSON.stringify(durations, null, 2) + "\n");
  console.log(`beat ${n.id}: ${durations[n.id]} s`);
}
console.log("total VO", Object.values(durations).reduce((a, b) => a + b, 0).toFixed(1), "s");
