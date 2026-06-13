// components/auth/AuthLayout.tsx
import { Logo } from '@/public/icons/icons';

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    error: string | null;
    children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, error, children }: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 px-4 overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-500/10 blur-[120px]" />

            <div className="relative w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center mb-4">
                        <Logo />
                    </div>
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                    <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}