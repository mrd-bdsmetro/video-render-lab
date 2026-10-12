# hs-duty-vi: Mã HS và thuế trong vài giây

Video 10 cảnh, tiếng Việt, ước tính 55-60 s (thời lượng thật đo từ giọng đọc), 1920x1080, 30 fps.
Dùng cho gallery Product Hunt và kênh tiếng Việt. Không giá, không đối thủ, không tên nhà cung cấp.

## Render (Haiku builder: không sửa kịch bản)

1. Chuyển `drafts/hs-duty-vi.yaml` sang `jobs/hs-duty-vi.yaml` (git mv) trên main; một push chạm `jobs/**` sẽ khởi động `render-jobs`.
2. Không sửa `tts`, `text`, headline, tọa độ hay ảnh. Validator (`scripts/job-lib.mjs`) phải báo 0 lỗi, 614 ký tự giọng đọc.
3. Giọng: ElevenLabs `eleven_v3`, voice Roger, fallback edge-tts HoaiMy rate 0 (cap +5%).
4. Nhịp: mỗi cảnh = 8 frame lặng + giọng đọc + 27 frame giữ hình (0.9 s) để người xem đọc màn hình (`src/hs-duty/timing.ts`).
5. Artifact `hs-duty-vi`. Nếu thời lượng thật > 60 s: báo lại, đừng tăng tốc giọng.

## Cảnh

| # | Ảnh | Headline (overlay) | Giọng đọc (tts) | Phụ đề (text) | Highlight |
|---|---|---|---|---|---|
| 1 | home | Mã HS và thuế, trong vài giây | Mã hát ét là gì, thuế nhập khẩu bao nhiêu? | Mã HS là gì, thuế nhập khẩu bao nhiêu? | - |
| 2 | typed | Gõ tên hàng bằng tiếng Việt | Vào open bi tu bi chấm com, gạch chéo hát ét, gõ tên hàng bằng tiếng Việt. | Vào openbtob.com/hs, gõ tên hàng bằng tiếng Việt. | ô tìm kiếm |
| 3 | result | Danh sách mã hiện ngay | Ví dụ cà phê rang xay. Danh sách mã hiện ra ngay. | (giống tts) | - |
| 4 | result | 0901 21: cà phê đã rang | Dòng đầu, không chín không một hai một: cà phê đã rang. | Dòng đầu, 0901 21: cà phê đã rang. | dòng 090121 |
| 5 | result | 6 số đầu: mã quốc tế | Sáu số này dùng chung toàn cầu. Mỗi nước chia tiếp dòng riêng. | (giống tts) | ô mã 090121 |
| 6 | tariff | Việt Nam dùng 8 số | Việt Nam dùng tám số. Gõ mã cà phê rang đã xay. | Việt Nam dùng tám số. Gõ mã cà phê rang đã xay: 0901 21 20. | tiêu đề thẻ "Vietnam — 09012120" + "Đã xay" |
| 7 | tariff | Thuế nhập khẩu MFN | Thuế nhập khẩu ưu đãi em ép en hiện ngay trên thẻ biểu thuế. | Thuế nhập khẩu ưu đãi MFN hiện ngay trên thẻ biểu thuế. | ô "MFN duty" |
| 8 | tariff | Còn tùy xuất xứ | Ưu đãi hiệp định và thuế bổ sung còn tùy xuất xứ. | (giống tts) | dòng "National tariff reference..." |
| 9 | tariff | Ước tính, cần xác nhận | Đây là ước tính, hãy xác nhận với đại lý hải quan. | (giống tts) | dòng "Estimate, not legal advice..." |
| 10 | home | openbtob.com/hs | Miễn phí, không cần đăng ký. Thử tại open bi tu bi chấm com, gạch chéo hát ét. Thông tin tham khảo, không phải tư vấn pháp lý. | Miễn phí, không cần đăng ký. Thử tại openbtob.com/hs. Thông tin tham khảo, không phải tư vấn pháp lý. | - |

Mức thuế chỉ xuất hiện trong ảnh chụp trang thật (cảnh 6-9); giọng đọc và overlay không đọc hay viết con số thuế nào.

## Ảnh chụp (đã chụp 2026-10-12 ~15:10Z, đã commit trong `public/hs-duty/`)

Trình duyệt 1920x1080, không đăng nhập. Tọa độ highlight trong `src/hs-duty/HsDutyVi.tsx` khớp với các ảnh này; chụp lại thì phải đo lại tọa độ.

| File | URL | Trạng thái |
|---|---|---|
| `home.png` | https://openbtob.com/hs | ô tìm kiếm trống |
| `typed.png` | https://openbtob.com/hs | gõ `cà phê rang xay` vào ô, chưa bấm |
| `result.png` | https://openbtob.com/hs?q=c%C3%A0+ph%C3%AA+rang+xay | dòng đầu 090121 "Coffee; roasted, not decaffeinated" |
| `tariff.png` | https://openbtob.com/hs?q=09012120 | thẻ "Vietnam — 09012120", "- - - Đã xay", MFN duty 30%, VAT Not available |

## Số liệu đã kiểm tra trực tiếp (2026-10-12)

| Điều khẳng định | Truy vấn chính xác | Kết quả |
|---|---|---|
| Gõ tiếng Việt ra mã | `GET https://openbtob.com/hs?q=cà phê rang xay` | dòng đầu 090121; tra cứu ~0.8 s (Enter tới bảng) |
| Thuế MFN Việt Nam của 0901.21.20 hiển thị 30% (chỉ trong ảnh) | `GET https://openbtob.com/hs?q=09012120` và `GET https://api.openbtob.com/api/hs?q=09012120` | `exact_tariff.VN.mfn_pct = 30` ("NK ưu đãi": "30"), desc_vi "- - - Đã xay" |
| Không cần đăng ký | cả hai URL mở được khi chưa đăng nhập | đúng |
| Câu "ước tính" | thẻ biểu thuế | "Estimate, not legal advice: verify with a licensed customs broker." |

"Vài giây" thay cho "10 giây": tốc độ mạng khác nhau, không cam kết con số.
