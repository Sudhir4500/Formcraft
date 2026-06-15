// src/services/apiClient.ts
import { ApiError, ApiResponse } from '@/types/api';

async function handleApiResponse<T>(res: Response): Promise<ApiResponse<T>> {
    const data = await res.json();

    if (!res.ok) {
        throw {
            success: false,
            message: data.message || 'Request failed',
            errors: data.errors || null,
            status: res.status,
        } as ApiError;
    }

    return data;
}

export async function apiGet<T>(path: string) {
    const res = await fetch(path, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return handleApiResponse<T>(res);
}

export async function apiPost<T>(path: string, body: unknown) {
    const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return handleApiResponse<T>(res);
}

export async function apiPatch<T>(path: string, body: unknown) {
    const res = await fetch(path, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return handleApiResponse<T>(res);
}

export async function apiDelete<T>(path: string) {
    const res = await fetch(path, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    return handleApiResponse<T>(res);
}
