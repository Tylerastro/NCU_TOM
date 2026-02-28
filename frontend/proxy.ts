import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/", "/about"];

export default auth(async function proxy(req) {
  // When using auth() as middleware wrapper, session is available on req.auth
  const isAuthenticated = !!req.auth?.user;
  const { pathname } = req.nextUrl;

  // Allow access to public routes without authentication
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access protected routes
  if (!isAuthenticated) {
    const signInUrl = new URL("/auth/signin", req.url);
    // Add the original URL as a callback parameter
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

// Matcher configuration - specify which routes need authentication
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - /auth/* (authentication pages)
     * - /api/auth/* (authentication API routes)
     * - /_next/* (Next.js internals)
     * - Static files (images, fonts, etc.)
     */
    "/((?!auth|api/auth|_next/static|_next/image|favicon.ico|robots.txt|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$|.*\\.ico$|.*\\.webp$).*)",
  ],
};
