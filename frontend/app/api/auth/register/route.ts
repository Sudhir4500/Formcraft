import { djangoPost } from '@/app/api/_lib/django';
import { NextResponse } from 'next/server';
import { LoginResponseData } from '@/types/api';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Call Django's LoginView
        const response = await djangoPost<LoginResponseData>('auth/login/', body);

        if (response.success && response.data?.token) {
            const res = NextResponse.json(response);

            // Set HttpOnly cookies
            res.cookies.set('access_token', response.data.token.access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 15,
            });

            res.cookies.set('refresh_token', response.data.token.refresh, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            });

            return res;
        }

        // Forward backend error payload with correct status
        return NextResponse.json(response, { status: 400 });
    } catch (error: any) {
        // Preserve backend error structure if available
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Login failed',
                data: null,
                errors: error.errors || null,
            },
            { status: error.status || 500 }
        );
    }
}
