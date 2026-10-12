# video-render-lab

Remotion project. Videos are built from job specs: `jobs/<slug>.yaml` (composition, scenes with `tts` and `text`, optional `images` and `sfx` under `public/`). Workflow `render-jobs.yml` runs on dispatch (input `job` = slug or all) and on pushes to `jobs/**`: validate, voice (ElevenLabs `eleven_v3` with key from secret `ELEVENLABS_API_KEY`, edge-tts fallback at rate <= +5%), Remotion render, ffmpeg SFX + loudness + 60 MB cap, artifact named `<slug>`. A job fails before any API call above 1500 voice chars; content rules (no prices, rates, competitors, vendor names) are checked in `scripts/job-lib.mjs`. No Claude runs in Actions. Adding a composition = one entry in `ADAPTERS` there.

- Edit only files under `src/` (plus assets in `public/`). `PromoVi` is the 30 s Vietnamese promo (`src/PromoVi.tsx`, scenes in `src/scenes/`).
- `src/Root.tsx` sets duration, fps and size; `src/Video.tsx` is the scene. Split into more components under `src/` if needed.
- Use `remotion`, `react`, inline styles, and the Remotion-matched packages `@remotion/google-fonts` and `@remotion/transitions` (both pinned to the same version as `remotion`; Be Vietnam Pro for Vietnamese text). No other new npm packages; no network assets unless the prompt provides a URL. Local assets go in `public/` (screenshots in `public/shots/`).
- Keep videos short (default 5-15 s, 1920x1080, 30 fps) so a render fits in a few runner minutes.
