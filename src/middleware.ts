import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware: protect /dashboard routes
// In MVP mode (no DB), skip auth checks
// When DATABASE_URL is set, NextAuth session will be validated

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // MVP mode: allow all access when no DATABASE_URL
  // In production: check for auth session
  const hasDB = !!process.env.DATABASE_URL;

  if (!hasDB) {
    // MVP mode — no auth required, use mock user switcher
    return NextResponse.next();
  }

  // Production mode — check for NextAuth session token
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
