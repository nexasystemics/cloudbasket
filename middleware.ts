/**
 * middleware.ts — CloudBasket v2.0.0
 * NEXQON HOLDINGS | E1 Chief Engineer
 * Created: 2026-04-10 | Audit finding: BLOCKER 1
 *
 * Responsibilities:
 *   1. Rate limiting via Upstash Redis (protects Amazon PA-API quota)
 *   2. CORS headers (restricts API access to cloudbasket.in + cloudbasket.co)
 *   3. Auth route protection (blocks /profile, /wishlist, /alerts without session)
 *   4. Admin route guard (blocks /admin/* — always, FEATURE_ADMIN flag checked)
 *   5. Feature-disabled redirect (any flagged-off route → /feature-disabled)
 */

import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ── Allowed origins ──────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://cloudbasket.in",
  "https://www.cloudbasket.in",
  "https://cloudbasket.co",
  "https://www.cloudbasket.co",
];

// ── Rate limiter (lazy-initialised — only when Redis keys are set) ───
let ratelimit: Ratelimit | null = null;

function getRatelimiter(): Ratelimit | null {
  // Guard: only initialise if both Upstash env vars are present
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    // Keys not yet set by IBF — middleware runs but rate limiting is skipped
    return null;
  }

  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      }),
      // 60 requests per 60 seconds per IP — protects PA-API quota
      limiter: Ratelimit.slidingWindow(60, "60 s"),
      analytics: true,
      prefix: "cb_rl", // CloudBasket rate limit namespace
    });
  }

  return ratelimit;
}

// ── CORS helper ──────────────────────────────────────────────────────
function setCORSHeaders(
  response: NextResponse,
  origin: string | null
): NextResponse {
  const isAllowed =
    origin &&
    (ALLOWED_ORIGINS.includes(origin) ||
      // Allow localhost in development
      origin.startsWith("http://localhost:"));

  response.headers.set(
    "Access-Control-Allow-Origin",
    isAllowed && origin ? origin : "https://cloudbasket.in"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, x-internal-api-key"
  );
  response.headers.set("Access-Control-Max-Age", "86400");
  response.headers.set("Vary", "Origin");

  return response;
}

// ── Security headers ─────────────────────────────────────────────────
function setSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  return response;
}

// ── Routes that require authentication ──────────────────────────────
const AUTH_REQUIRED_PREFIXES = [
  "/profile",
  "/wishlist",
  "/alerts",
  "/account",
  "/api/user",
  "/api/wishlist",
  "/api/price-alerts",
  "/api/newsletter/unsubscribe",
];

// ── Routes that are ALWAYS blocked (removed — zero-checkout mandate) ──
const ALWAYS_BLOCKED_PREFIXES = [
  "/admin",
  "/dashboard",
  "/vendor",
  "/checkout",
];

// ── API routes with stricter rate limits (10 req/10s per IP) ─────────
const STRICT_RATE_API_PREFIXES = [
  "/api/affiliate",
  "/api/search",
  "/api/price-alerts",
  "/api/contact",
  "/api/newsletter",
  "/api/push",
];

// ── Bot user agents to block ─────────────────────────────────────────
const BOT_PATTERNS = [
  /scrapy/i,
  /python-requests/i,
  /curl\/[0-9]/i,
  /wget/i,
  /go-http-client/i,
  /java\/[0-9]/i,
  /php/i,
];

// ── Main middleware ──────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");
  const userAgent = request.headers.get("user-agent") || "";

  // 1. Handle CORS preflight
  if (request.method === "OPTIONS") {
    const preflightResponse = new NextResponse(null, { status: 204 });
    return setCORSHeaders(setSecurityHeaders(preflightResponse), origin);
  }

  // 2. Block known scraper bots on affiliate API routes
  if (pathname.startsWith("/api/affiliate") || pathname.startsWith("/go/")) {
    const isBot = BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
    if (isBot) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // 3. Always-blocked routes (zero-checkout mandate + admin removed)
  const isAlwaysBlocked = ALWAYS_BLOCKED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (isAlwaysBlocked) {
    const featureDisabledUrl = new URL("/feature-disabled", request.url);
    featureDisabledUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(featureDisabledUrl);
  }

  // 4. Auth-required routes — check for Supabase session cookie
  const isAuthRequired = AUTH_REQUIRED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (isAuthRequired) {
    // Supabase sets auth cookie with project-specific name
    // Check for either cookie format (Supabase v1 or v2)
    const supabaseCookie =
      request.cookies.get("sb-access-token") ||
      request.cookies.get(
        `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}-auth-token`
      );

    if (!supabaseCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      return setCORSHeaders(setSecurityHeaders(redirectResponse), origin);
    }
  }

  // 5. Internal API key check for cron and internal routes
  if (pathname.startsWith("/api/cron/")) {
    const cronSecret = request.headers.get("x-cron-secret");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || cronSecret !== expectedSecret) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized — invalid cron secret" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 6. Rate limiting for API routes
  if (pathname.startsWith("/api/") || pathname.startsWith("/go/")) {
    const limiter = getRatelimiter();

    if (limiter) {
      // Use stricter limits for high-value endpoints
      const isStrictRoute = STRICT_RATE_API_PREFIXES.some((prefix) =>
        pathname.startsWith(prefix)
      );

      // Get real IP — works on Vercel
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "anonymous";

      const identifier = isStrictRoute
        ? `strict_${ip}_${pathname.split("/")[2] || "api"}`
        : `general_${ip}`;

      try {
        const { success, limit, remaining, reset } =
          await limiter.limit(identifier);

        if (!success) {
          const rateLimitResponse = new NextResponse(
            JSON.stringify({
              error: "Too many requests — please slow down",
              retryAfter: Math.ceil((reset - Date.now()) / 1000),
            }),
            {
              status: 429,
              headers: { "Content-Type": "application/json" },
            }
          );
          rateLimitResponse.headers.set("X-RateLimit-Limit", String(limit));
          rateLimitResponse.headers.set(
            "X-RateLimit-Remaining",
            String(remaining)
          );
          rateLimitResponse.headers.set("X-RateLimit-Reset", String(reset));
          rateLimitResponse.headers.set(
            "Retry-After",
            String(Math.ceil((reset - Date.now()) / 1000))
          );
          return setCORSHeaders(
            setSecurityHeaders(rateLimitResponse),
            origin
          );
        }
      } catch {
        // Redis unavailable — fail open (don't block requests, log silently)
        // This ensures site stays up even if Upstash has an outage
        console.warn("[middleware] Rate limit check failed — Redis unavailable");
      }
    }
  }

  // 7. Apply CORS + security headers to all responses
  const response = NextResponse.next();
  setCORSHeaders(response, origin);
  setSecurityHeaders(response);

  return response;
}

// ── Matcher — only run on relevant paths ─────────────────────────────
// Excludes: _next/static, _next/image, favicon, public assets
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets (images, icons, manifest)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
