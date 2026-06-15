// src/app/api/_lib/errorResponse.ts
import { NextResponse } from 'next/server';

export function formatError(error: any, fallbackMessage = 'Request failed') {
    return NextResponse.json(
        {
            success: false,
            message: error?.message || fallbackMessage,
            data: null,
            errors: error?.errors || null,
        },
        { status: error?.status || 500 }
    );
}
