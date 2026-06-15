// hooks/useAuthWatcher.ts
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function useAuthWatcher() {
    const { accessToken, expiresAt, setTokens, clearAuth } = useAuthStore();

    useEffect(() => {
        if (!accessToken || !expiresAt) return;

        const msUntilExpiry = expiresAt - Date.now();

        // If expiry is too close, refresh immediately
        if (msUntilExpiry <= 30_000) {
            refreshNow();
            return;
        }

        const timeout = setTimeout(refreshNow, msUntilExpiry - 30_000);

        return () => clearTimeout(timeout);

        async function refreshNow() {
            try {
                const res = await fetch("/api/auth/refresh", { method: "POST" });
                const data = await res.json();

                if (data.success && data.data.access) {
                    setTokens(data.data.access, data.data.refresh);
                } else {
                    clearAuth();
                    window.location.href = "/login";
                }
            } catch {
                clearAuth();
                window.location.href = "/login";
            }
        }
    }, [accessToken, expiresAt, setTokens, clearAuth]);
}
