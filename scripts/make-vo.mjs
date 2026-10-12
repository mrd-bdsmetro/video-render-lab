// Generates one Vietnamese narration MP3 per scene with edge-tts, from src/vn-trade/narration.json.
// Usage: node scripts/make-vo.mjs   (needs `py -m edge_tts`, ffmpeg and ffprobe on PATH)
// Outputs: public/vn-trade/vo/<scene>.mp3 (peak normalised to VO_PEAK_DB) and
//          src/vn-trade/vo-timing.json (clip duration + per-line start/end seconds).
// Scene lengths in the video are derived from vo-timing.json, never guessed.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const outDir = join(root, "public/vn-trade/vo");
mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), "vo-"));
const VO_PEAK_DB = -2.5; // pre-mix peak; the rendered mix peaks around -3 to -5 dBFS

const narr = JSON.parse(readFileSync(join(root, "src/vn-trade/narration.json"), "utf8"));
const py = process.platform === "win32" ? "py" : "python3";

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${cmd} failed: ${args.join(" ").slice(0, 200)}\n${(r.stderr || "").slice(-500)}`);
  return (r.stdout || "") + (r.stderr || "");
};
const probe = (f) =>
  parseFloat(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).trim());

// "00:00:04,550" -> seconds
const ts = (s) => {
  const m = /(\d+):(\d+):(\d+)[,.](\d+)/.exec(s);
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
};
const parseVtt = (txt) =>
  txt
    .split(/\r?\n\r?\n/)
    .map((b) => /(\S+)\s+-->\s+(\S+)/.exec(b))
    .filter(Boolean)
    .map((m) => ({ start: ts(m[1]), end: ts(m[2]) }));

const timing = {};
for (const scene of narr.scenes) {
  const text = scene.lines.map((l) => l.tts).join(" ");
  const raw = join(tmp, `${scene.id}.mp3`);
  const sub = join(tmp, `${scene.id}.vtt`);
  run(py, ["-m", "edge_tts", "--voice", narr.voice, `--rate=${narr.rate}`, "--text", text, "--write-media", raw, "--write-subtitles", sub]);
  const log = run("ffmpeg", ["-i", raw, "-af", "volumedetect", "-f", "null", "-"]);
  const max = parseFloat(/max_volume: (-?[\d.]+) dB/.exec(log)[1]);
  const gain = VO_PEAK_DB - max;
  const out = join(outDir, `${scene.id}.mp3`);
  run("ffmpeg", ["-y", "-i", raw, "-af", `highpass=f=70,acompressor=threshold=0.1:ratio=3:attack=5:release=90:makeup=2,volume=${gain.toFixed(2)}dB,alimiter=limit=0.75:level=disabled`, "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "128k", out]);
  const duration = probe(out);
  let cues = parseVtt(await (await import("node:fs/promises")).readFile(sub, "utf8"));
  if (cues.length !== scene.lines.length) {
    // Fallback: spread lines over the clip by character count.
    const total = scene.lines.reduce((a, l) => a + l.tts.length, 0);
    let at = 0;
    cues = scene.lines.map((l) => {
      const start = (at / total) * duration;
      at += l.tts.length;
      return { start, end: (at / total) * duration };
    });
    console.warn(`warn: ${scene.id}: subtitle cue count mismatch, used character spread`);
  }
  timing[scene.id] = {
    duration: +duration.toFixed(3),
    lines: cues.map((c) => ({ start: +c.start.toFixed(3), end: +Math.min(c.end, duration).toFixed(3) })),
  };
  console.log(`ok: ${scene.id}.mp3 ${duration.toFixed(2)} s (gain ${gain.toFixed(1)} dB)`);
}
writeFileSync(join(root, "src/vn-trade/vo-timing.json"), JSON.stringify(timing, null, 2) + "\n");
const sum = Object.values(timing).reduce((a, t) => a + t.duration, 0);
console.log(`total voice ${sum.toFixed(1)} s`);
rmSync(tmp, { recursive: true, force: true });
