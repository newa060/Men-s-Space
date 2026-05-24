import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// In-memory rate limiting map (IP -> array of timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15; // 15 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps outside the current window
  const activeTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
  
  if (activeTimestamps.length >= MAX_REQUESTS) {
    return true;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

  // 1. Rate limiting on auth API routes
  if (pathname.startsWith("/api/auth/") && pathname !== "/api/auth/session") {
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Too many authentication requests. Please try again in a minute." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 2. Refresh the session using Supabase SSR helper
  const { supabaseResponse, user, supabase } = await updateSession(request);

  // 3. Admin routes protection (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // If already logged in as admin, skip the login page
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          const redirect = request.nextUrl.searchParams.get("redirect") || "/admin/dashboard";
          return NextResponse.redirect(new URL(redirect, request.url));
        }
      }
    } else {
      if (!user) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Fetch user profile to verify role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        // Redirect customers attempting to reach admin dashboard to homepage
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  // 4. Customer profile & settings protection
  const protectedCustomerRoutes = ["/profile", "/order-history", "/shipping-addresses"];
  if (protectedCustomerRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/sign-in", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Admin API routes protection (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Unauthenticated. Session missing." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Unauthorized. Admin role required." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
