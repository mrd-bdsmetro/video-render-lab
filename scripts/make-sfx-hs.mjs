// Synthesizes the collage sound effects and the music bed with ffmpeg (no downloaded audio).
// Usage: node scripts/make-sfx-hs.mjs -> public/hs-explainer/sfx/*.wav and music.wav (44.1 kHz, 16-bit)
// Needs a full ffmpeg on PATH.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = fileURLToPath(new URL("../public/hs-explainer/sfx/", import.meta.url));
mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), "sfxhs-"));

const run = (args) => {
  const r = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}\n${r.stderr?.slice(-500)}`);
  return r.stderr ?? "";
};
const peakOf = (file) => parseFloat(/max_volume: (-?[\d.]+) dB/.exec(run(["-i", file, "-af", "volumedetect", "-f", "null", "-"]))[1]);

// graph: filter_complex string producing [out]; normalised to peak dB.
const make = (name, inputs, graph, peak = -6) => {
  const raw = join(tmp, `${name}.wav`);
  run(["-y", ...inputs.flatMap((i) => ["-f", "lavfi", "-i", i]), "-filter_complex", graph, "-map", "[out]", "-ar", "44100", "-ac", "1", raw]);
  const gain = peak - peakOf(raw);
  run(["-y", "-i", raw, "-af", `volume=${gain.toFixed(2)}dB`, "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", join(outDir, `${name}.wav`)]);
  console.log(`ok: ${name}.wav`);
};
const noise = (d, c = "white") => `anoisesrc=d=${d}:c=${c}:r=44100:a=0.8`;
const synth = (expr, d) => `aevalsrc='${expr}':d=${d}:s=44100`;

// Paper slap: broadband noise with a sharp attack and a fast decay, plus a tiny low thud.
make("paper-slap", [noise(0.3, "pink"), synth("sin(2*PI*120*t)*exp(-t*50)", 0.3)],
  "[0]highpass=f=400,lowpass=f=7000,afade=t=in:d=0.004,afade=t=out:st=0.01:d=0.25:curve=exp[a];[1]volume=0.5[b];[a][b]amix=inputs=2:normalize=0[out]");
// Paper rustle: band-limited noise with fast random-ish tremolo, soft envelope.
make("paper-rustle", [noise(1.0)],
  "[0]highpass=f=2500,lowpass=f=9000,tremolo=f=23:d=0.9,afade=t=in:d=0.15,afade=t=out:st=0.5:d=0.5[out]", -9);
// Tape rip: noise whose amplitude flutters quickly, falling off at the end.
make("tape-rip", [noise(0.7, "brown")],
  "[0]highpass=f=900,lowpass=f=8000,tremolo=f=70:d=1,tremolo=f=11:d=0.6,afade=t=in:d=0.03,afade=t=out:st=0.35:d=0.35[out]", -8);
// Stamp thump: low body with a short noise click on top.
make("stamp-thump", [synth("sin(2*PI*(52+90*exp(-t*35))*t)*exp(-t*9)", 0.6), noise(0.1, "pink")],
  "[1]lowpass=f=2500,afade=t=out:st=0:d=0.08:curve=exp,volume=0.5[n];[0][n]amix=inputs=2:normalize=0[out]");
// Ding: bell-like two partials.
make("ding", [synth("sin(2*PI*1568*t)*exp(-t*5)+0.5*sin(2*PI*2352*t)*exp(-t*7)+0.25*sin(2*PI*3136*t)*exp(-t*9)", 1.4)], "[0]acopy[out]", -8);
// Marker scribble: narrow-band noise swept by tremolo.
make("scribble", [noise(0.35, "pink")],
  "[0]highpass=f=1500,lowpass=f=6000,tremolo=f=30:d=0.8,afade=t=in:d=0.04,afade=t=out:st=0.2:d=0.15[out]", -12);

// Music bed: slow chord pads (Am7, Fmaj7, Cmaj7, G6) with a soft pluck arpeggio, each chord 4.8 s, 16 chords = 76.8 s.
const chords = [
  [220, 261.63, 329.63, 392],
  [174.61, 220, 261.63, 329.63],
  [196, 261.63, 329.63, 392],
  [196, 246.94, 293.66, 329.63],
];
const seg = (i) => {
  const c = chords[i % 4];
  const pad = c.map((f) => `0.18*sin(2*PI*${f}*t)+0.05*sin(2*PI*${f * 2}*t)`).join("+");
  const arp = c.map((f, k) => `0.22*sin(2*PI*${f * 2}*t)*exp(-8*mod(t-${k * 0.3},1.2))*gt(mod(t-${k * 0.3},1.2),0)`).join("+");
  const file = join(tmp, `seg${i}.wav`);
  run(["-y", "-f", "lavfi", "-i", `aevalsrc='(${pad})*0.6+${arp}':d=4.8:s=44100`, "-af", "lowpass=f=2400,afade=t=in:d=0.5,afade=t=out:st=4.2:d=0.6", "-ar", "44100", "-ac", "1", file]);
  return file;
};
const segs = Array.from({ length: 16 }, (_, i) => seg(i));
const list = segs.flatMap((s) => ["-i", s]);
const concat = segs.map((_, i) => `[${i}]`).join("") + `concat=n=${segs.length}:v=0:a=1[out]`;
const rawMusic = join(tmp, "music.wav");
run(["-y", ...list, "-filter_complex", concat, "-map", "[out]", "-ar", "44100", "-ac", "1", rawMusic]);
run(["-y", "-i", rawMusic, "-af", `volume=${(-12 - peakOf(rawMusic)).toFixed(2)}dB`, "-c:a", "pcm_s16le", join(outDir, "music.wav")]);
console.log("ok: music.wav");
