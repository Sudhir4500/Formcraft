import { NextRequest, NextResponse } from 'next/server'
import { djangoPost } from '@/app/api/_lib/django'
import { LoginResponseData } from '@/types/api'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const resData = await djangoPost<LoginResponseData>('auth/register/', body)

        if (resData.success && resData.data?.token) {
            const { access, refresh } = resData.data.token
            const response = NextResponse.json(resData)

            // Set access token cookie
            response.cookies.set('access_token', access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 15,
            })

            // Set refresh token cookie
            response.cookies.set('refresh_token', refresh, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            })

            return response
        }

        return NextResponse.json(resData, { status: 400 })
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred', data: null, errors: null },
            { status: 500 }
        )
    }
}
