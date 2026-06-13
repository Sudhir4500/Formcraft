// middleware.ts
export const runtime = 'nodejs';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// These paths require a logged-in user
const PROTECTED = ['/dashboard', '/forms', '/settings', '/billing']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const pathname = request.nextUrl.pathname
    const isProtected = PROTECTED.some(p => pathname.startsWith(p))

    if (isProtected && !token) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Already logged in, trying to visit /login or /register → send to dashboard
    if (token && ['/login', '/register'].includes(pathname)) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

// Tell Next.js which paths to run middleware on.
// Exclude static files, images, and the public form route.
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|f/).*)'],
}