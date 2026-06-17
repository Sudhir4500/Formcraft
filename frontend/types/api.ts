// types/api.ts
import { User } from './user';

export type ApiResponse<T> =
    | {
        success: true;
        message: string;
        data: T;
        errors: null;
        status?: number;
    }
    | {
        success: false;
        message: string;
        data: null;
        errors: Record<string, string[]> | null;
        status?: number;
    };


export interface TokenPair {
    access: string;
    refresh: string;
}

export interface LoginResponseData {
  user:    User
  access:  string   // ← at top level of data
  refresh: string   // ← at top level of data
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
