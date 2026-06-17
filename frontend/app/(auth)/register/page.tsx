'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthInput } from '@/components/auth/AuthInput'
import { registerUser } from '@/services/authService'
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import {useAuthStore }from '@/store/authStore'


export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
    const { parseError } = useApiErrorHandler();
    const setUser = useAuthStore(state => state.setUser)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setValidationErrors({})

        if (formData.password !== formData.password_confirmation) {
            setValidationErrors({ password_confirmation: ['Passwords do not match.'] })
            setIsLoading(false)
            return
        }

        try {
            const response = await registerUser(formData)
             setUser(response.data?.user ?? null)
            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            const { message, validationErrors } = parseError(error)
            setError(message)
            setValidationErrors(validationErrors)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout title="Create Account" subtitle="Get started with FormCraft today" error={error}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInput label="Full name" id="name" value={formData.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} error={validationErrors?.name} />
                <AuthInput label="Email address" id="email" type="email" value={formData.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })} error={validationErrors?.email} />
                <AuthInput label="Password" id="password" type="password" value={formData.password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })} error={validationErrors?.password} />
                <AuthInput label="Confirm password" id="password_confirmation" type="password" value={formData.password_confirmation} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password_confirmation: e.target.value })} error={validationErrors?.password_confirmation} />

                <button type="submit" disabled={!formData.name || !formData.email || !formData.password || !formData.password_confirmation || isLoading} className={!formData.name || !formData.email || !formData.password || !formData.password_confirmation || isLoading ? "w-full bg-primary/60 py-3 rounded-lg border-md font-medium mt-4 cursor-not-allowed" : "w-full bg-primary py-3 rounded-lg border-md font-medium mt-4 cursor-pointer"}>
                    {isLoading ? 'Registering...' : 'Create Account'}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-secondary border-t border-secondary/60 pt-6">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:text-primary/80">Sign in</Link>
            </div>
        </AuthLayout>
    )
}