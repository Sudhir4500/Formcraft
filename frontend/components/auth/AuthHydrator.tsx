// components/auth/AuthHydrator.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuthStore } from '@/store/authStore';

export default function AuthHydrator() {
    const setUser = useAuthStore((state) => state.setUser);
    const setLoading = useAuthStore((state) => state.setLoading);
    const router = useRouter(); // Initialize router

    useEffect(() => {
        async function fetchMe() {
            try {
                const res = await fetch('/api/users/me');

                // If 401, force redirect to login
                if (res.status === 401) {
                    setUser(null);
                    router.push('/login');
                    return;
                }

                const json = await res.json();
                if (json.success) {
                    setUser(json.data.user);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchMe();
    }, [setUser, setLoading, router]);

    return null;
}