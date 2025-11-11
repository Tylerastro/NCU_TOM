import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
  const token = await auth();
  const isAuthenticated = !!token?.user;
  const { pathname } = req.nextUrl;

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
     * - /favicon.ico, /robots.txt, etc. (static files)
     */
    "/((?!auth|api/auth|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
