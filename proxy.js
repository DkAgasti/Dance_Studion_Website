import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { prisma } from "@/lib/db";

// Protects /admin routes and refreshes the Supabase auth session.
// Next.js 16 deprecated middleware.js in favor of proxy.js — same behavior, renamed export.
//
// This is the edge-level guard: it checks for a valid Supabase session AND a
// matching active AdminUser row. app/(admin)/layout.jsx's requireAdmin() is
// the defense-in-depth backup (see the Next.js proxy docs' warning that
// Server Functions must verify auth themselves, not rely on proxy alone).
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const { response, user } = await updateSession(request);

  const isLoginPage = pathname === "/login";
  let isAuthorized = false;

  if (user?.email) {
    const adminUser = await prisma.adminUser.findUnique({ where: { email: user.email } });
    isAuthorized = !!adminUser?.active;
  }

  if (!isLoginPage && !isAuthorized) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginPage && isAuthorized) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
