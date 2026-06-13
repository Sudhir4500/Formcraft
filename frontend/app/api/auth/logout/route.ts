import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    // Forward to Django
    await fetch(`${process.env.DJANGO_INTERNAL_URL}auth/logout/`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${cookieStore.get('access_token')?.value}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    const response = NextResponse.json({ success: true });
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
}