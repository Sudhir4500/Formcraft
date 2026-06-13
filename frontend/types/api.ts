// types/api.ts
import { User } from './user';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
    errors: any | null;
}

export interface TokenPair {
    access: string;
    refresh: string;
}

export interface LoginResponseData {
    user: User;
    token: TokenPair;
}

export interface RefreshResponseData {
    access: string;
    refresh?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}