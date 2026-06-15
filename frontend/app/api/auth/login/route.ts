import { djangoPost } from '@/app/api/_lib/django';
import { NextResponse } from 'next/server';
import { LoginResponseData } from '@/types/api';
import { formatError } from '@/app/api/_lib/errorResponse';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Call Django's LoginView
        const response = await djangoPost<LoginResponseData>('auth/login/', body);

        if (response.success && response.data) {
            const res = NextResponse.json(response);
            // Set HttpOnly cookie for the access token
            res.cookies.set('access_token', response.data.token.access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            res.cookies.set('refresh_token', response.data.token.refresh, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            return res;
        }

        return NextResponse.json(response, { status: 400 });
    } catch (error: any) {
        return formatError(error, 'Login failed');
    }
}