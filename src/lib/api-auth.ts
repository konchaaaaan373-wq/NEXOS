import { auth } from "@/lib/auth";

/**
 * Get the authenticated user from the session.
 * Returns null in MVP mode (no DATABASE_URL) or if not authenticated.
 * In MVP mode, returns a mock Neco admin user.
 */
export async function getApiUser() {
  const hasDB =
    !!process.env.DATABASE_URL || !!process.env.NETLIFY_DATABASE_URL;

  if (!hasDB) {
    // MVP mode — return mock user so APIs still work
    return {
      id: "user-neco-1",
      name: "Neco 管理者",
      email: "admin@necofindjob.com",
      role: "neco_admin" as const,
    };
  }

  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    return {
      id: session.user.id,
      name: session.user.name ?? "Unknown",
      email: session.user.email ?? "",
      role: (session.user as { role?: string }).role ?? "clinic_editor",
    };
  } catch {
    return null;
  }
}
