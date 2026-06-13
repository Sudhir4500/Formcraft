// types/user.ts
export interface User {
    id: number;
    name: string;
    email: string;
    plan: 'free' | 'pro';
    created_at: string;
}