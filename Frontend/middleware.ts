import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get the cookie value properly
  const token = request.cookies.get("token")?.value;

  // Protect /admin and /welcome routes if no token
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/welcome")) &&
    !token
  ) {
    // Redirect to /login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow request to continue if token exists or route is unprotected
  return NextResponse.next();
}

// Specify which routes this middleware applies to
export const config = {
  matcher: ["/admin/:path*", "/welcome/:path*"],
};
