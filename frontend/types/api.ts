// types/api.ts
import { User } from './user';

export type ApiResponse<T> =
    | {
        success: true;
        message: string;
        data: T;
        errors: null;
    }
    | {
        success: false;
        message: string;
        data: null;
        errors: Record<string, string[]> | null;
    };


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

export type ApiError = {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
    status?: number;
};
