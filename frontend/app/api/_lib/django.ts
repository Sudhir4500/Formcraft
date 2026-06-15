// app/api/_lib/django.ts
import { cookies } from 'next/headers';
import { ApiResponse } from '@/types/api';

// DJANGO_INTERNAL_URL is defined in .env.local
const DJANGO_URL = process.env.DJANGO_INTERNAL_URL;

/**
 * Helper to prepare headers with JWT from HttpOnly cookie
 */
async function getHeaders(tokenOverride?: string) {
    const cookieStore = await cookies();
    const token = tokenOverride || cookieStore.get('access_token')?.value;

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

/**
 * Centralized response handler to ensure consistent error/success parsing
 */
async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
    // if (res.status === 401) {
    //     // 401 means the session is invalid (and refresh also failed)
    //     throw new Error('UNAUTHORIZED');
    // }

    const data = await res.json();
    if (!res.ok) {
        throw {
            success: data.success,
            message: data.message || "Something went wrong",
            data: data.data || null,
            errors: data.errors || null,
            status: res.status,
        }
    }
    return data;
}

/**
 * Attempts to use the refresh token to get a new access token
 */
async function attemptRefresh(): Promise<string | null> {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) return null;

    try {
        const res = await fetch(`${DJANGO_URL}auth/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (res.ok) {
            const resData = await res.json();
            const { access, refresh } = resData.data;

            cookieStore.set('access_token', access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });

            if (refresh) {
                cookieStore.set('refresh_token', refresh, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                });
            }

            return access;
        }
    } catch (e) {
        console.error("Failed to refresh token", e);
    }
    return null;
}

export async function djangoGet<T>(path: string) {
    let res = await fetch(`${DJANGO_URL}${path}`, {
        headers: await getHeaders(),
        cache: 'no-store', // Ensures fresh data for dynamic dashboards
    });

    if (res.status === 401) {
        const newAccess = await attemptRefresh();
        if (newAccess) {
            res = await fetch(`${DJANGO_URL}${path}`, {
                headers: await getHeaders(newAccess),
                cache: 'no-store',
            });
        }
    }

    return handleResponse<T>(res);
}

export async function djangoPost<T>(path: string, body: unknown) {
    let res = await fetch(`${DJANGO_URL}${path}`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(body),
    });

    if (res.status === 401) {
        const newAccess = await attemptRefresh();
        if (newAccess) {
            res = await fetch(`${DJANGO_URL}${path}`, {
                method: 'POST',
                headers: await getHeaders(newAccess),
                body: JSON.stringify(body),
            });
        }
    }

    return handleResponse<T>(res);
}

// Add Patch and Delete using the same pattern
export async function djangoPatch<T>(path: string, body: unknown) {
    let res = await fetch(`${DJANGO_URL}${path}`, {
        method: 'PATCH',
        headers: await getHeaders(),
        body: JSON.stringify(body),
    });

    if (res.status === 401) {
        const newAccess = await attemptRefresh();
        if (newAccess) {
            res = await fetch(`${DJANGO_URL}${path}`, {
                method: 'PATCH',
                headers: await getHeaders(newAccess),
                body: JSON.stringify(body),
            });
        }
    }

    return handleResponse<T>(res);
}

export async function djangoDelete<T>(path: string) {
    let res = await fetch(`${DJANGO_URL}${path}`, {
        method: 'DELETE',
        headers: await getHeaders(),
    });

    if (res.status === 401) {
        const newAccess = await attemptRefresh();
        if (newAccess) {
            res = await fetch(`${DJANGO_URL}${path}`, {
                method: 'DELETE',
                headers: await getHeaders(newAccess),
            });
        }
    }

    return handleResponse<T>(res);
}