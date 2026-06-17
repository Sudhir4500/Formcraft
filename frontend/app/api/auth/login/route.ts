import { djangoPost } from '@/app/api/_lib/django'
import { NextRequest, NextResponse } from 'next/server'
import type { User } from '@/types/user'

// Handles both token shapes Django might return
type DjangoLoginData = {
  user:     User
  token?: {                  // Shape B: tokens nested
    access:  string
    refresh: string
  }
}

const IS_PROD = process.env.NODE_ENV === 'production'

export async function POST(req: NextRequest) {
  // 1. Parse body safely
  let body: unknown
  try { body = await req.json() }
  catch {
    return NextResponse.json(
      { success: false, message: 'Request body required', data: null, errors: null },
      { status: 400 }
    )
  }

  // 2. Call Django — djangoPost never throws, always returns ApiResponse
  const response = await djangoPost<DjangoLoginData>('auth/login/', body)

  // 3. Forward failures — data.errors intact for the frontend
  if (!response.success || !response.data) {
    return NextResponse.json(response, { status: 400 })
  }

  // 4. Extract tokens — handle both shapes
  const access  =  response.data.token?.access
  const refresh = response.data.token?.refresh
  const user    = response.data.user

  // 5. Guard: if tokens are missing something is wrong with Django's response
  if (!access || !refresh) {
    console.error('[login] Django success but no tokens in response:', response.data)
    return NextResponse.json(
      { success: false, message: 'Login failed: invalid server response', data: null, errors: null },
      { status: 500 }
    )
  }

  // 6. Return ONLY the user to the browser — never expose raw tokens in body
  const res = NextResponse.json({
    success: true,
    message: response.message,
    data:    { user },
    errors:  null,
  })

  // 7. Set HttpOnly cookies — these are what authenticate future requests
  res.cookies.set('access_token', access, {
    httpOnly: true, secure: IS_PROD,
    sameSite: 'lax', path: '/',
    maxAge:   60 * 15,        // 15 minutes
  })
  res.cookies.set('refresh_token', refresh, {
    httpOnly: true, secure: IS_PROD,
    sameSite: 'lax', path: '/',
    maxAge:   60 * 60 * 24 * 7, // 7 days
  })

  return res
}