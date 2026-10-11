# video-render-lab

Remotion project. The workflow `render.yml` asks Claude to edit the video, then renders `out/video.mp4`.

- Edit only files under `src/`. The composition id stays `Main` (used by the render step).
- `src/Root.tsx` sets duration, fps and size; `src/Video.tsx` is the scene. Split into more components under `src/` if needed.
- Use only `remotion`, `react` and inline styles; no new npm packages, no network assets (fonts, images) unless the prompt provides a URL.
- Keep videos short (default 5-15 s, 1920x1080, 30 fps) so a render fits in a few runner minutes.
