import { NextResponse } from "next/server";
import { generateRequestId, logger } from "@/lib/logger";
import { ZodError } from "zod";

// 構造化APIレスポンス
interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  requestId: string;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  requestId: string;
}

// セキュリティヘッダー
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function createHeaders(requestId: string): Record<string, string> {
  return {
    ...SECURITY_HEADERS,
    "X-Request-Id": requestId,
  };
}

// 成功レスポンス
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
  const requestId = generateRequestId();
  return NextResponse.json(
    { success: true as const, data, requestId },
    { status, headers: createHeaders(requestId) }
  );
}

// エラーレスポンス
export function apiError(
  code: string,
  message: string,
  status: number,
  details?: Record<string, string[]>
): NextResponse<ApiErrorResponse> {
  const requestId = generateRequestId();
  logger.error(`API Error: ${code}`, { requestId, message, status });
  return NextResponse.json(
    {
      success: false as const,
      error: { code, message, ...(details && { details }) },
      requestId,
    },
    { status, headers: createHeaders(requestId) }
  );
}

// Zodバリデーションエラー用
export function apiValidationError(error: ZodError): NextResponse<ApiErrorResponse> {
  const details = error.flatten().fieldErrors as Record<string, string[]>;
  return apiError("VALIDATION_ERROR", "入力内容に問題があります", 400, details);
}

// 共通エラーハンドラ（try-catch用）
export function apiServerError(err: unknown, context?: string): NextResponse<ApiErrorResponse> {
  const message = err instanceof Error ? err.message : "不明なエラー";
  logger.error(`Server error${context ? ` in ${context}` : ""}`, {
    error: message,
    stack: err instanceof Error ? err.stack : undefined,
  });
  return apiError(
    "INTERNAL_ERROR",
    "サーバーエラーが発生しました。もう一度お試しください。",
    500
  );
}

// 認証エラー
export function apiUnauthorized(): NextResponse<ApiErrorResponse> {
  return apiError("UNAUTHORIZED", "認証が必要です", 401);
}

// 権限エラー
export function apiForbidden(): NextResponse<ApiErrorResponse> {
  return apiError("FORBIDDEN", "権限がありません", 403);
}

// 未発見エラー
export function apiNotFound(resource = "リソース"): NextResponse<ApiErrorResponse> {
  return apiError("NOT_FOUND", `${resource}が見つかりません`, 404);
}

// レート制限エラー
export function apiRateLimited(): NextResponse<ApiErrorResponse> {
  return apiError(
    "RATE_LIMITED",
    "リクエストが多すぎます。しばらくしてからお試しください。",
    429
  );
}
