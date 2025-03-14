import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For demo purposes, we'll skip authentication checks
  return NextResponse.next()

  /* Original middleware code (commented out for now)
  // Get the auth token from session storage instead of cookies
  const authToken = request.cookies.get("authToken")?.value || 
                    request.headers.get("Authorization")?.split(" ")[1] || 
                    null;

  // Check if the user is authenticated
  const isAuthenticated = !!authToken;

  // Define protected routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/prompts/new") ||
    request.nextUrl.pathname.match(/^\/prompts\/[^/]+\/edit$/) ||
    request.nextUrl.pathname.startsWith("/templates/new") ||
    request.nextUrl.pathname.match(/^\/templates\/[^/]+\/edit$/);

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if accessing auth pages while authenticated
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  */
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/prompts/new", "/prompts/:id/edit", "/templates/new", "/templates/:id/edit", "/login", "/register"],
}

