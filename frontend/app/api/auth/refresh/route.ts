import { NextRequest, NextResponse } from 'next/server';
import { djangoPost } from '@/app/api/_lib/django';
import { cookies } from 'next/headers';
import { ApiResponse, RefreshResponseData } from '@/types/api';
import { formatError } from '@/app/api/_lib/errorResponse';

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const refresh = cookieStore.get('refresh_token')?.value;

        if (!refresh) {
            return NextResponse.json(
                { success: false, message: 'No refresh token available', data: null, errors: null },
                { status: 401 }
            );
        }

        const resData = await djangoPost<RefreshResponseData>('auth/refresh/', { refresh });


        if (resData.success) {
            const data = resData.data;
            const response = NextResponse.json(resData);

            response.cookies.set('access_token', data.access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 15,
            });

            if (data.refresh) {
                response.cookies.set('refresh_token', data.refresh, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                });
            }

            return response;
        }

        const response = NextResponse.json(resData, { status: 400 });
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        return response;
    } catch (error: any) {
        return formatError(error, 'Refresh failed');
    }
}
