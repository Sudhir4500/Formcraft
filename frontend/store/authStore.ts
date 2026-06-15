// store/authStore.ts
import { create } from 'zustand';
import { User } from '@/types/user';
import { getTokenExpiry } from '@/utils/jwt';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null; // timestamp in ms
    isLoading: boolean;

    setUser: (user: User | null) => void;
    setTokens: (access: string, refresh: string) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    isLoading: true,

    setUser: (user) => set({ user }),
    setTokens: (access, refresh) =>
        set({
            accessToken: access,
            refreshToken: refresh,
            expiresAt: getTokenExpiry(access), // decode exp claim
        }),
    clearAuth: () =>
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            isLoading: false,
        }),
    setLoading: (isLoading) => set({ isLoading }),
}));
