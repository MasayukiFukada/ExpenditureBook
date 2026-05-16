export const CATEGORIES = [
  "食費",
  "日用",
  "趣味",
  "交通",
  "交際",
  "医療",
  "教育",
  "通信",
  "水道光熱",
  "住居",
  "被覆",
  "保険",
  "特別",
  "雑費",
  "未設定"
] as const;

export type Category = typeof CATEGORIES[number];
