// Prints the matrix JSON for the workflow: node scripts/list-jobs.mjs [slug|all|<changed files...>]
// Validates every selected job, so a bad spec fails the plan job before any render minutes are spent.
import { listJobFiles, loadJob, validateJob } from "./job-lib.mjs";

const args = process.argv.slice(2).filter(Boolean);
const all = listJobFiles();
let picked = all;
if (args.length && args[0] !== "all") {
  const named = new Set(args.map((a) => a.replace(/^jobs\//, "").replace(/\.yaml$/, "")));
  picked = all.filter((f) => named.has(f.replace(/^jobs\//, "").replace(/\.yaml$/, "")));
  if (!picked.length) {
    console.error(`no job matches ${args.join(",")}`);
    process.exit(args.every((a) => !a.startsWith("jobs/")) ? 1 : 0); // a push that only deleted a spec renders nothing
  }
}
const bad = picked.flatMap((f) => validateJob(loadJob(f)).map((e) => `${f}: ${e}`));
if (bad.length) {
  console.error(bad.join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({ include: picked.map((f) => ({ slug: loadJob(f).slug, file: f })) }));
