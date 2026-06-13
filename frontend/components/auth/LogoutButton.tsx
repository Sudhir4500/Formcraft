// components/auth/LogoutButton.tsx
'use client';
import { useAuthStore } from '@/store/authStore';
import { logoutUser } from '@/services/authService';
import { useRouter } from 'next/navigation';

// components/auth/LogoutButton.tsx
export function LogoutButton() {
    const setUser = useAuthStore(state => state.setUser);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setUser(null);
            router.push('/login');
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
}