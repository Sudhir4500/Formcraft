import { create } from 'zustand';
import { User } from '@/types/user';
import { getTokenExpiry } from '@/utils/jwt';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null; 
    isLoading: boolean;

    setUser: (user: User | null) => void;
    setTokens: (access: string, refresh: string) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
    
    // NEW: Centralized hydration action accessible everywhere
    syncUserSession: () => Promise<boolean>;
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
            expiresAt: getTokenExpiry(access), 
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

    syncUserSession: async () => {
        set({ isLoading: true });
        try {
            // Pointing to your exact working endpoint configuration
            const res = await fetch('/api/users/me'); 

            if (res.status === 401) {
                set({ user: null, isLoading: false });
                return false;
            }

            const json = await res.json();
            if (json.success) {
                set({ user: json.data, isLoading: false });
                return true;
            }
            
            set({ user: null, isLoading: false });
            return false;
        } catch (error) {
            console.error("Hydration error:", error);
            set({ user: null, isLoading: false });
            return false;
        }
    }
}));