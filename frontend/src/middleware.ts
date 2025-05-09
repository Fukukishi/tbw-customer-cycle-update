import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    console.log("Request Path:", request.nextUrl.pathname);
    const session = request.cookies.get('session');

    if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/api/customers/:path*'],
};