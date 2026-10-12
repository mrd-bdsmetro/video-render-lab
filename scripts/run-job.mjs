// Runs one job spec end to end: node scripts/run-job.mjs <stage> jobs/<slug>.yaml
// Stages: validate | voice | render | post. The key is read from env and is never printed or written to disk.
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, statSync, copyFileSync, rmSync } from "node:fs";
import { ADAPTERS, MAX_MB, charCount, loadJob, validateJob } from "./job-lib.mjs";

const [stage, file] = process.argv.slice(2);
const job = loadJob(file);
const ad = ADAPTERS[job.composition];
const out = `out/${job.slug}`;
const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", stdio: opts.capture ? "pipe" : "inherit" });
  if (r.status !== 0) throw new Error(`${cmd} failed (${r.status}) ${opts.capture ? (r.stderr ?? "").slice(-300) : ""}`);
  return r.stdout;
};
const duration = (f) => Math.round(parseFloat(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", f], { capture: true })) * 1000) / 1000;

function validate() {
  const errs = validateJob(job);
  if (errs.length) throw new Error(`${job.slug ?? file}: ${errs.join("; ")}`);
  console.log(`ok ${job.slug}: ${job.scenes.length} scenes, ${charCount(job)} voice chars`);
}

async function elevenLabs(text, dest) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return false;
  const voiceId = job.voice?.voice_id ?? "21m00Tcm4TlvDq8ikWAM";
  mkdirSync(out, { recursive: true });
  const bodyFile = `${out}/tts-request.json`;
  writeFileSync(bodyFile, JSON.stringify({ text, model_id: "eleven_v3", voice_settings: { stability: 0.5 } }), "utf8");
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json; charset=utf-8", accept: "audio/mpeg" },
    body: readFileSync(bodyFile),
  });
  if (!res.ok) {
    console.log(`elevenlabs status ${res.status}, falling back to edge-tts`);
    return false;
  }
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return true;
}

function edge(text, dest) {
  const rate = job.voice?.rate ?? 0;
  const voice = job.voice?.edge_voice ?? "vi-VN-HoaiMyNeural";
  for (let i = 0; i < 4; i++) {
    const r = spawnSync("edge-tts", ["--voice", voice, `--rate=+${rate}%`, "--text", text, "--write-media", dest], { encoding: "utf8" });
    if (r.status === 0) return;
  }
  throw new Error("edge-tts failed after 4 attempts");
}

async function voice() {
  validate(); // the char cap is enforced here, before any API call
  mkdirSync(ad.voDir, { recursive: true });
  const durations = {};
  let provider = "elevenlabs";
  for (const s of job.scenes) {
    const dest = `${ad.voDir}/${ad.voName(s.id)}`;
    let ok = provider === "elevenlabs" && (await elevenLabs(s.tts, dest));
    if (!ok) {
      provider = "edge-tts";
      edge(s.tts, dest);
    }
    durations[s.id] = duration(dest);
    console.log(`scene ${s.id}: ${durations[s.id]} s via ${provider}`);
  }
  rmSync(`${out}/tts-request.json`, { force: true });
  writeFileSync(ad.durationsFile, JSON.stringify(durations, null, 2) + "\n");
  const narration = job.scenes.map(({ id, tts, text }) => ({ id, tts, text }));
  writeFileSync(ad.narrationFile, `// Generated from ${file} by scripts/run-job.mjs\nexport const NARRATION = ${JSON.stringify(narration, null, 2)};\n`, "utf8");
}

function render() {
  mkdirSync(out, { recursive: true });
  run("npx", ["remotion", "render", "src/index.ts", job.composition, `${out}/raw.mp4`, "--concurrency=2"]);
}

// ffmpeg: optional extra SFX from the spec, loudness normalisation, then a size cap.
function post() {
  const sfx = job.sfx ?? [];
  const inputs = ["-i", `${out}/raw.mp4`, ...sfx.flatMap((x) => ["-i", x.file])];
  const mix = sfx.map((x, i) => `[${i + 1}:a]adelay=${Math.round((x.at ?? 0) * 1000)}|${Math.round((x.at ?? 0) * 1000)},volume=${x.volume ?? 0.6}[s${i}]`);
  const labels = ["[0:a]", ...sfx.map((_, i) => `[s${i}]`)].join("");
  const graph = [...mix, `${labels}amix=inputs=${sfx.length + 1}:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[a]`].join(";");
  const final = `out/${job.slug}.mp4`;
  const encode = (crf) => run("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", graph, "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-crf", String(crf), "-preset", "medium", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", final]);
  let mb = 0;
  for (const crf of [20, 24, 28, 32]) {
    encode(crf);
    mb = statSync(final).size / 1048576;
    console.log(`crf ${crf}: ${mb.toFixed(1)} MB`);
    if (mb <= MAX_MB) break;
  }
  if (mb > MAX_MB) throw new Error(`${final} is ${mb.toFixed(1)} MB, cap is ${MAX_MB}`);
  console.log(`done ${final} ${mb.toFixed(1)} MB ${duration(final)} s`);
}

const stages = { validate, voice, render, post };
if (!stages[stage]) throw new Error("usage: run-job.mjs validate|voice|render|post jobs/<slug>.yaml");
await stages[stage]();
