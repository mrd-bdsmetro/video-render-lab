// Synthesizes every sound effect with ffmpeg (no downloaded audio, no licensing).
// Usage: node scripts/make-sfx.mjs   -> public/sfx/*.wav (44.1 kHz, 16-bit, peak -6 dBFS)
// Needs a full ffmpeg on PATH (or FFMPEG=/path/to/ffmpeg): Remotion's bundled ffmpeg lacks the aevalsrc, anoisesrc and volumedetect filters.
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = fileURLToPath(new URL("../public/sfx/", import.meta.url));
mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), "sfx-"));
const PEAK_DB = -6;

const run = (args) => {
  const r = spawnSync(process.env.FFMPEG || "ffmpeg", args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}\n${r.stderr?.slice(-600)}`);
  return r.stderr ?? "";
};

// src: lavfi source; filters: processing chain applied before normalisation.
const make = (name, src, filters, fadeOut) => {
  const raw = join(tmp, `${name}.wav`);
  run(["-y", "-f", "lavfi", "-i", src, "-af", `${filters},aresample=44100`, "-ac", "1", raw]);
  const log = run(["-i", raw, "-af", "volumedetect", "-f", "null", "-"]);
  const max = parseFloat(/max_volume: (-?[\d.]+) dB/.exec(log)[1]);
  const gain = PEAK_DB - max;
  run([
    "-y", "-i", raw, "-af",
    `volume=${gain.toFixed(2)}dB,afade=t=out:st=${fadeOut.st}:d=${fadeOut.d}`,
    "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", join(outDir, `${name}.wav`),
  ]);
  console.log(`ok: ${name}.wav (gain ${gain.toFixed(1)} dB)`);
};

const noise = (d, color = "pink") => `anoisesrc=d=${d}:c=${color}:r=44100:a=0.8`;
const synth = (expr, d) => `aevalsrc='${expr}':d=${d}:s=44100`;

// Whoosh: pink noise, band-limited below 6 kHz, swelling in and out.
make("whoosh", noise(0.8), "highpass=f=250,lowpass=f=5500,afade=t=in:st=0:d=0.35,afade=t=out:st=0.35:d=0.45", { st: 0.6, d: 0.2 });
// Short whoosh for screenshot swaps.
make("whoosh-short", noise(0.45), "highpass=f=300,lowpass=f=5000,afade=t=in:st=0:d=0.18,afade=t=out:st=0.18:d=0.27", { st: 0.35, d: 0.1 });
// Soft pop for callouts.
make("pop", synth("sin(2*PI*(500+700*exp(-t*45))*t)*exp(-t*30)", 0.2), "lowpass=f=6000", { st: 0.15, d: 0.05 });
// Chat incoming message: two-step bubble pop.
make("msg", synth("sin(2*PI*(620+500*exp(-t*40))*t)*exp(-t*22)+if(gt(t,0.07),0.8*sin(2*PI*(930+400*exp(-(t-0.07)*40))*(t-0.07))*exp(-(t-0.07)*25),0)", 0.3), "lowpass=f=6000", { st: 0.22, d: 0.08 });
// Keyboard tick: tiny noise burst plus a short body tone.
make("tick", synth("(random(0)*2-1)*0.5*exp(-t*220)+0.6*sin(2*PI*1400*t)*exp(-t*170)", 0.08), "highpass=f=800,lowpass=f=7000", { st: 0.06, d: 0.02 });
// Button click: slightly lower and fuller than the tick.
make("click", synth("(random(0)*2-1)*0.4*exp(-t*180)+0.8*sin(2*PI*(900-300*t)*t)*exp(-t*90)", 0.12), "highpass=f=400,lowpass=f=6500", { st: 0.09, d: 0.03 });
// Chat send swoosh: quick rising noise.
make("send", noise(0.35), "highpass=f=500,lowpass=f=4500,afade=t=in:st=0:d=0.2,afade=t=out:st=0.2:d=0.15", { st: 0.28, d: 0.07 });
// Low boom with a pitch drop and a soft noise riser underneath.
make("boom", synth("sin(2*PI*(40+110*exp(-t*7))*t)*exp(-t*3.2)", 1.4), "lowpass=f=500", { st: 1.0, d: 0.4 });
// Two-note chime (G5 then C6) with a soft third harmonic.
make(
  "chime",
  synth(
    "(sin(2*PI*784*t)+0.25*sin(2*PI*1568*t))*exp(-t*3.2)*0.7+if(gt(t,0.16),(sin(2*PI*1046.5*(t-0.16))+0.25*sin(2*PI*2093*(t-0.16)))*exp(-(t-0.16)*2.6),0)",
    2.0,
  ),
  "lowpass=f=6000",
  { st: 1.5, d: 0.5 },
);

// ---- VnTradeVi additions ----
// Bar grow: soft low thump with a quick pitch drop.
make("vn-bar", synth("sin(2*PI*(170+240*exp(-t*28))*t)*exp(-t*16)", 0.35), "lowpass=f=900", { st: 0.28, d: 0.07 });
// Arc launch: rising band-passed noise sweep.
make("vn-sweep", noise(0.7), "highpass=f=400,lowpass=f=3800,afade=t=in:st=0:d=0.45,afade=t=out:st=0.45:d=0.25,tremolo=f=9:d=0.4", { st: 0.55, d: 0.15 });
// Arc arrival: short glassy ping (E6 plus a soft fifth).
make("vn-ping", synth("(sin(2*PI*1318.5*t)+0.3*sin(2*PI*1975.5*t))*exp(-t*9)", 0.6), "lowpass=f=7000", { st: 0.5, d: 0.1 });

// Background bed: soft A-minor pad (A2, E3, A3, C4, E4) with slow beating and a gentle swell, 90 s.
{
  const D = 90;
  const notes = [110, 164.81, 220, 261.63, 329.63];
  const expr = notes
    .map((f, i) => `(0.6/${i + 1})*sin(2*PI*${f}*t)*(0.75+0.25*sin(2*PI*${(0.05 + i * 0.013).toFixed(3)}*t+${i}))+(0.6/${i + 1})*sin(2*PI*${(f * 1.004).toFixed(2)}*t)*0.5`)
    .join("+");
  const raw = join(tmp, "bed.wav");
  run(["-y", "-f", "lavfi", "-i", synth(expr, D), "-af", "lowpass=f=1400,aresample=44100", "-ac", "2", raw]);
  const log = run(["-i", raw, "-af", "volumedetect", "-f", "null", "-"]);
  const max = parseFloat(/max_volume: (-?[\d.]+) dB/.exec(log)[1]);
  run([
    "-y", "-i", raw, "-af",
    `volume=${(PEAK_DB - max).toFixed(2)}dB,afade=t=in:st=0:d=3,afade=t=out:st=${D - 4}:d=4`,
    "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", join(outDir, "bed-vn.wav"),
  ]);
  console.log("ok: bed-vn.wav");
}

rmSync(tmp, { recursive: true, force: true });
