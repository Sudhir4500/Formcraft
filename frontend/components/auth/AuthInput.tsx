// src/components/auth/AuthInput.tsx
export const AuthInput = ({ label, id, error, ...props }: any) => (
    <div>
        <label className="block text-sm font-medium text-zinc-350 mb-2" htmlFor={id}>{label}</label>
        <input id={id} {...props} className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50" />
        {error?.map((err: string, i: number) => <p key={i} className="text-xs text-red-400 mt-1.5">{err}</p>)}
    </div>
);