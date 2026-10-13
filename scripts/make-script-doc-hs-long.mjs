// Writes docs/hs-explainer-long-script.md from the narration source (chapters, timestamps when VO durations exist).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { NARRATION, CHAPTERS } from "../src/hs-explainer-long/narration.mjs";

const durFile = fileURLToPath(new URL("../src/hs-explainer-long/vo-durations.json", import.meta.url));
const dur = existsSync(durFile) ? JSON.parse(readFileSync(durFile, "utf8")) : {};
const VO_LEAD = 12 / 30, HOLD = 24 / 30, CH_HOLD = 14 / 30;
let t = 0;
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const rows = NARRATION.map((n) => {
  const start = t;
  t += VO_LEAD + (dur[n.id] ?? 0) + (n.kind === "chapter" ? CH_HOLD : HOLD);
  return { n, start };
});
const words = NARRATION.reduce((a, n) => a + n.text.split(/\s+/).length, 0);
let out = `# Mã HS code là gì? Cách tra mã HS chuẩn khi xuất khẩu sang Mỹ (A-Z)\n\nKịch bản video dài (composition \`HsExplainerLong\`). Giọng vi-VN-HoaiMyNeural, tốc độ +5%, giữ 0,8 giây sau mỗi ý chính. ${NARRATION.length} cảnh, khoảng ${words} từ thoại, tổng ${mmss(t)}.\n\nNguyên tắc: không nêu tên nhà cung cấp dữ liệu, không nêu mức thuế cụ thể, openbtob.com chỉ xuất hiện ở phần cuối.\n\n## Chapters cho YouTube (dán vào mô tả)\n\n`;
let lastCh = 0;
for (const { n, start } of rows) if (n.ch !== lastCh) { out += `${mmss(start)} ${CHAPTERS[n.ch - 1]}\n`; lastCh = n.ch; }
lastCh = 0;
out += `\n## Lời thoại theo cảnh\n`;
for (const { n, start } of rows) {
  if (n.ch !== lastCh) { out += `\n### ${n.ch}. ${CHAPTERS[n.ch - 1]}\n\n`; lastCh = n.ch; }
  out += `**[${mmss(start)}] Cảnh ${n.id} (${n.kind})** ${n.text}\n\n`;
}
writeFileSync(fileURLToPath(new URL("../docs/hs-explainer-long-script.md", import.meta.url)), out);
console.log("doc written", mmss(t), words, "words");
