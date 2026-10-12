// Every number used in the VnTradeVi video, with its source. Values are for calendar year 2025.
// "nso" = Cục Thống kê (Bộ Tài chính; formerly Tổng cục Thống kê, nso.gov.vn / gso.gov.vn).
// Full list with notes: docs/vn-trade-sources.md

export type Source = { name: string; url: string; date: string; note?: string };

export const SRC = {
  // NSO xlsx table "28. Hàng hóa xuất khẩu" (sheet "28.XK tháng"), column "Năm 2025", preliminary, million USD.
  nsoTable: {
    name: "Cục Thống kê (Bộ Tài chính), biểu 28 Hàng hóa xuất khẩu, báo cáo KT-XH quý IV và năm 2025",
    url: "https://www.nso.gov.vn/wp-content/uploads/2026/01/02.-Bieu-12.2025-4.xlsx",
    date: "2026-01-05 (họp báo), trang 2026-01",
  },
  nsoReport: {
    name: "Cục Thống kê (Bộ Tài chính), Báo cáo tình hình kinh tế - xã hội quý IV và năm 2025",
    url: "https://www.nso.gov.vn/bai-top/2026/01/bao-cao-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2025/",
    date: "2026-01-05",
  },
  nsoTrade: {
    name: "Cục Thống kê (Bộ Tài chính), Kết quả hoạt động xuất, nhập khẩu hàng hóa năm 2025",
    url: "https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2026/01/ket-qua-hoat-dong-xuat-nhap-khau-hang-hoa-nam-2025-but-pha-ky-luc-va-chuyen-dich-manh-me-sang-cong-nghe-cao/",
    date: "2026-01-08",
  },
  nsoViaPress: {
    name: "Cục Thống kê (Bộ Tài chính) số liệu cán cân theo thị trường, đăng lại bởi VnEconomy",
    url: "https://vneconomy.vn/xuat-nhap-khau-nam-2025-can-dich-ky-luc-hon-930-ty-usd.htm",
    date: "2026-01-05",
    note: "Secondary reproduction of the NSO release: China imports 186.0, China deficit 115.6, EU surplus 38.6",
  },
  eu: {
    name: "Báo Đầu tư, Việt Nam xuất siêu sang EU 38,6 tỷ USD (số liệu thương mại 2025 của Bộ Tài chính)",
    url: "https://baodautu.vn/viet-nam-xuat-sieu-sang-eu-386-ty-usd-d485752.html",
    date: "2026-01-07",
    note: "Secondary source; consistent with the NSO EU surplus of 38.6 (56.2 exports - 17.6 imports)",
  },
  korea: {
    name: "Cổng thông tin Công Thương (Bộ Công Thương), Thương mại Việt Nam - Hàn Quốc năm 2025",
    url: "https://thongtincongthuong.vn/thuong-mai-viet-nam-han-quoc-nam-2025-tang-truong-tot-song-muc-tham-hut-van-cao/",
    date: "2026-01",
    note: "Ministry of Industry and Trade information portal; 28.94 = 6.09% of 475.04, consistent",
  },
  usda: {
    name: "USDA FAS, Coffee: World Markets and Trade (Brazil #1, Vietnam #2 exporter, 2025/26) and Coffee Annual, Vietnam",
    url: "https://apps.fas.usda.gov/psdonline/circulars/coffee.pdf",
    date: "2026-07 circular; Coffee Annual VM2026-0016 dated 2026-05",
    note: "Ranking read from the circular tables via search extract; the PDF itself could not be opened (HTTP 403 / DNS)",
  },
} satisfies Record<string, Source>;

export const TOTALS = {
  year: 2025,
  exportBn: 475.04, // tỷ USD, +17.0% yoy
  exportGrowthPct: 17.0,
  importBn: 455.01, // +19.4% yoy
  importGrowthPct: 19.4,
  balanceBn: 20.03, // surplus
  industrialSharePct: 88.7, // "nhóm hàng công nghiệp chế biến" 421.47 bn, 88.7% of exports
  fdiSharePct: 77.3,
  // Derived: 475.04e9 USD / (365 * 86400 s) = 15,063 USD per second.
  usdPerSecond: Math.round((475.04e9) / (365 * 86400)),
  sources: [SRC.nsoReport, SRC.nsoTrade],
};

export type ProductKey = "electronics" | "machinery" | "phones" | "textiles" | "footwear" | "transport" | "wood" | "seafood";

// Top 8 export groups by value, million USD from the NSO table (sheet 28), shown in tỷ USD.
export const PRODUCTS: { key: ProductKey; label: string; bn: number }[] = [
  { key: "electronics", label: "Điện tử, máy tính, linh kiện", bn: 107.7484 },
  { key: "machinery", label: "Máy móc, thiết bị, phụ tùng", bn: 59.0469 },
  { key: "phones", label: "Điện thoại và linh kiện", bn: 56.7098 },
  { key: "textiles", label: "Dệt, may", bn: 39.6418 },
  { key: "footwear", label: "Giày dép", bn: 24.2035 },
  { key: "transport", label: "Vận tải và phụ tùng", bn: 17.5297 },
  { key: "wood", label: "Gỗ và sản phẩm gỗ", bn: 17.2049 },
  { key: "seafood", label: "Thủy sản", bn: 11.2858 },
];
export const PRODUCTS_SOURCE = SRC.nsoTable;

export type MarketKey = "us" | "cn" | "eu" | "kr";

// Export markets, tỷ USD. cn is derived from NSO figures: imports from China 186.0 minus deficit 115.6 = 70.4.
export const MARKETS: {
  key: MarketKey;
  label: string;
  bn: number;
  lonLat: [number, number]; // destination marker on the map
  source: Source;
  derived?: boolean;
}[] = [
  { key: "us", label: "Hoa Kỳ", bn: 153.2, lonLat: [-98, 39], source: SRC.nsoReport },
  { key: "cn", label: "Trung Quốc", bn: 70.4, lonLat: [110, 34], source: SRC.nsoViaPress, derived: true },
  { key: "eu", label: "EU", bn: 56.2, lonLat: [10, 50], source: SRC.eu },
  { key: "kr", label: "Hàn Quốc", bn: 28.94, lonLat: [127.8, 36.5], source: SRC.korea },
];
export const VIETNAM_LONLAT: [number, number] = [105.8, 16.5];

// Coffee (NSO table sheet 28, "Cà phê"): 1,581.7 nghìn tấn, 8,923.7 triệu USD, value 158.8% of 2024 (+58.8%), volume 117.5% of 2024.
export const COFFEE = {
  volumeMt: 1.5817, // triệu tấn
  valueBn: 8.9237,
  valueGrowthPct: 58.8, // year-on-year, value index 158.77 in the table; volume +17.5%
  hsHeading: "0901",
  source: SRC.nsoTable,
  // USDA FAS: Vietnam is the world's #2 coffee exporter (after Brazil) and the largest robusta producer.
  rankExporter: 2,
  rankRobustaProducer: 1,
  rankSource: SRC.usda,
};
