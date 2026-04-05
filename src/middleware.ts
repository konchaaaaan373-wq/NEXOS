import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// セキュリティヘッダー（全レスポンスに付与）
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 全レスポンスにセキュリティヘッダーを付与
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // ダッシュボード以外はそのまま通過
  if (!pathname.startsWith("/dashboard")) {
    return response;
  }

  // MVPモード：DBなしの場合はデモアクセスを許可
  const hasDB = !!(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
  if (!hasDB) {
    return response;
  }

  // 本番モード：NextAuthセッションを確認
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // ダッシュボード（認証必須）
    "/dashboard/:path*",
    // 公開ページ（セキュリティヘッダーのみ）
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
