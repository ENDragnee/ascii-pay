import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const routeAccessRules = [
  // Super Admin: System-wide management
  { prefix: "/admin", allowedRoles: ["SUPER_ADMIN"] },
  { prefix: "/api/admin", allowedRoles: ["SUPER_ADMIN"] },

  // Agent Owners: Can manage products and agency settings
  { prefix: "/dashboard/agency", allowedRoles: ["AGENT_OWNER"] },
  { prefix: "/products", allowedRoles: ["AGENT_OWNER"] },

  // Shared Agent Access: Owners and Staff can handle customers/transactions
  {
    prefix: "/dashboard",
    allowedRoles: ["SUPER_ADMIN", "AGENT_OWNER", "AGENT_STAFF"],
  },
  { prefix: "/customers", allowedRoles: ["AGENT_OWNER", "AGENT_STAFF"] },
  { prefix: "/transactions", allowedRoles: ["AGENT_OWNER", "AGENT_STAFF"] },
  { prefix: "/api/agent", allowedRoles: ["AGENT_OWNER", "AGENT_STAFF"] },
];

/**
 * MiddlewareProxy logic for route protection and RBAC
 */
export default withAuth(
  function ProxyMiddleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token;
    const pathname = request.nextUrl.pathname;
    const isApiRoute = pathname.startsWith("/api");

    // In our auth-options, role is stored as a string array
    const userRoles = (token?.role as string[]) || [];

    // Find if the current path matches any of our defined rules
    const matchingRule = routeAccessRules.find((rule) =>
      pathname.startsWith(rule.prefix),
    );

    if (matchingRule) {
      const hasAccess = matchingRule.allowedRoles.some((requiredRole) =>
        userRoles.includes(requiredRole),
      );

      if (!hasAccess) {
        if (isApiRoute) {
          return NextResponse.json(
            { error: "Forbidden: Insufficient permissions" },
            { status: 403 },
          );
        }

        // Redirect to a clean Lyra-styled access denied page
        return NextResponse.redirect(
          new URL("/auth/access-denied", request.url),
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Logic from your auth-options: check if JWT exists and hasn't been invalidated in DB
      authorized: ({ token }) => !!token && token.invalid !== true,
    },
  },
);

/**
 * Matcher configuration for Next.js Middleware
 */
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/products/:path*",
    "/customers/:path*",
    "/transactions/:path*",
    "/api/agent/:path*",
  ],
};
