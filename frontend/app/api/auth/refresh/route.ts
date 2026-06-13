import { NextRequest, NextResponse } from 'next/server'
import { djangoPost } from '@/app/api/_lib/django'
import { cookies } from 'next/headers'
import { ApiResponse, RefreshResponseData } from '@/types/api'

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const refresh = cookieStore.get('refresh_token')?.value

        if (!refresh) {
            return NextResponse.json(
                { success: false, message: 'No refresh token available', data: null, errors: null },
                { status: 401 }
            )
        }

        const resData = await djangoPost<ApiResponse<RefreshResponseData>>('/auth/refresh/', { refresh })

        if (resData.success && resData.data?.access) {
            const response = NextResponse.json(resData)

            // Update access token cookie
            response.cookies.set('access_token', resData.data.access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 15,
            })

            // If refresh token rotation is enabled and a new refresh token is returned
            if (resData.data.refresh) {
                response.cookies.set('refresh_token', resData.data.refresh, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                })
            }

            return response
        }

        const response = NextResponse.json(resData, { status: 400 })
        // Clear cookies if refresh fails (token expired/invalidated)
        response.cookies.delete('access_token')
        response.cookies.delete('refresh_token')
        return response
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred', data: null, errors: null },
            { status: 500 }
        )
    }
}
