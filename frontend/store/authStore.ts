// store/authStore.ts
import { create } from 'zustand';
import { User } from '@/types/user';

interface AuthState {
    user: User | null;
    refreshToken: string | null;

    isLoading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    refreshToken: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
}));