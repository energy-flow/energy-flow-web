import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PROTECTED_ROUTES } from "@/lib/constants";

/**
 * Guards protected routes by checking wallet connection (via cookie).
 * Role-based access is handled client-side by RoleGuard.
 */
export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    const walletConnected = request.cookies.get('wallet-connected');

    // Redirect to home page if not connected
    if (!walletConnected?.value) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - api routes
         * - _next (static files)
         * - favicon, images, etc.
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};