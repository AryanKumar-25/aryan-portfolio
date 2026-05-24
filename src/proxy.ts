import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './lib/auth';

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Retrieve the admin session cookie
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const isSessionValid = await verifySessionToken(sessionCookie);

    // Already logged in + visiting login page → redirect to dashboard
    if (pathname === '/admin/login') {
        if (isSessionValid) {
            return NextResponse.redirect(new URL('/admin/projects', request.url));
        }
        return NextResponse.next();
    }

    // Root /admin path
    if (pathname === '/admin') {
        if (isSessionValid) {
            return NextResponse.redirect(new URL('/admin/projects', request.url));
        }
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Protect every other /admin/* route
    if (pathname.startsWith('/admin/')) {
        if (!isSessionValid) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Only intercept /admin and /admin/* — never touch public routes
export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
