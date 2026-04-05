import { z } from "zod";

// 環境変数のスキーマ定義（本番環境で必須な項目を明示）
const envSchema = z.object({
  // データベース（本番では必須）
  DATABASE_URL: z.string().optional(),
  DIRECT_DATABASE_URL: z.string().optional(),
  NETLIFY_DATABASE_URL: z.string().optional(),

  // 認証（本番では必須）
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(16).optional(),

  // AI機能（オプション）
  ANTHROPIC_API_KEY: z.string().optional(),

  // メール送信（オプション）
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().optional(),
  NEXT_PUBLIC_CONTACT_EMAIL: z.string().email().optional(),

  // S3ストレージ（オプション）
  S3_REGION: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_PUBLIC_URL: z.string().optional(),

  // サイト
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  // 実行環境
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

// 環境変数の検証結果をキャッシュ
let _env: Env | null = null;

// 環境変数を検証して返す
export function getEnv(): Env {
  if (_env) return _env;
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("環境変数の検証に失敗しました:", result.error.flatten().fieldErrors);
    throw new Error("環境変数の設定が不正です");
  }
  _env = result.data;
  return _env;
}

// DBが利用可能かどうか
export function hasDatabaseUrl(): boolean {
  return !!(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
}

// 本番モードかどうか
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

// 各サービスの設定状態を返す（起動時ログ用）
export function getServiceStatus() {
  return {
    database: hasDatabaseUrl(),
    auth: !!(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL),
    ai: !!process.env.ANTHROPIC_API_KEY,
    email: !!process.env.RESEND_API_KEY,
    storage: !!(process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY),
  };
}
