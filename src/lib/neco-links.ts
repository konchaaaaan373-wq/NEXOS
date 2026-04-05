// Neco社サービスとの連携URL定数
// NEXOSとNeco本体サイトを横断的に連携するための設定

// Neco本体サイト
export const NECO_BASE_URL = "https://necofindjob.com";

// 医療機関向けページ（求職者がNeco経由で求人を探す入口）
export const NECO_FOR_MEDICAL_URL = `${NECO_BASE_URL}/for-medical`;

// Neco管理ダッシュボード（将来的にNEXOSと統合管理画面を共有）
export const NECO_ADMIN_URL = `${NECO_BASE_URL}/admin`;

// NEXOS本体のURL
export const NEXOS_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nexos.necofindjob.com";
