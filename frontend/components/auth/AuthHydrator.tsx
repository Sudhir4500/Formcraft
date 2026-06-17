'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthHydrator() {
    const syncUserSession = useAuthStore((state) => state.syncUserSession);

    useEffect(() => {
        // Runs cleanly on initial page mount/hard refresh
        syncUserSession();
    }, [syncUserSession]);

    return null;
}