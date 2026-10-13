# HS explainer long: WIP (2026-10-13)

Branch: `feat/hs-long-explainer`. Composition `HsExplainerLong` (old `HsExplainerVi` untouched).

Done
- Script: `docs/hs-explainer-long-script.md` (55 scenes, 8 chapters, about 8:55, chapter timestamps for the YouTube description).
- Source of truth: `src/hs-explainer-long/narration.mjs` (spoken text, caption, scene data). Scenes: `scenes.tsx`. Composition: `HsExplainerLong.tsx`.
- Voice-over: `node scripts/make-vo-hs-long.mjs` (edge-tts vi-VN-HoaiMyNeural, +5%, resumable; the service throttles, rerun on failure). Durations in `vo-durations.json`.
- After editing narration: rerun the VO script (use `--force` for changed text), then `node scripts/make-script-doc-hs-long.mjs`.
- Draft render of the first 3 minutes: `out/hs-explainer-long-draft.mp4`.
- Workflow `render-hs-long.yml` (manual, no secrets) renders the full video as an artifact.

Next
- Founder checks the pacing on the draft.
- Full render: run the workflow, or `npx remotion render src/index.ts HsExplainerLong out/hs-explainer-long.mp4`.
- Polish: scenes are template-driven (cards, digits, compare, search); add richer collage art (coffee beans, wood, cashew) if wanted.
- Verify facts once more against the WCO HS and the HTS before publishing.

Status 2026-10-13: local draft (first 3:00) rendered to `out/hs-explainer-long-draft.mp4` in the lab clone (out/ is git-ignored). Full render running in Actions: run 38343393458 (workflow `render-hs-long`, artifact `hs-explainer-long`, 14 days). Download: `gh run download 38343393458 -n hs-explainer-long`. If it failed, check the render step log, then render locally (about 27 min).
