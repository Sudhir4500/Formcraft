// components/AuthWatcherClient.tsx
"use client";

import { useAuthWatcher } from "@/hooks/useAuthWatcher";

export default function AuthWatcherClient() {
    useAuthWatcher(); // runs globally in the browser
    return null; // no UI, just side-effect
}
