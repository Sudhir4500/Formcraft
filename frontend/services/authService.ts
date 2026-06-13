import { LoginCredentials, RegisterCredentials } from '@/types/api';

export async function loginUser(credentials: LoginCredentials) {
    const res = await fetch('/api/auth/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (!res.ok) throw data; // Throw the error object to be caught by the component
    return data;
}

// services/authService.ts
export async function logoutUser() {
    const res = await fetch('/api/auth/logout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
}

export async function registerUser(credentials: RegisterCredentials) {
    const res = await fetch('/api/auth/register/', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
}