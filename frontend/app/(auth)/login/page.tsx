'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthInput } from '@/components/auth/AuthInput'
import { loginUser } from '@/services/authService' // Centralized service
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  const router = useRouter()
  const setUser = useAuthStore(state => state.setUser)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      // 1. Call BFF Route
      const response = await loginUser(formData)

      // 2. Sync Global Store (User data)
      setUser(response.data.user)

      // 3. Navigate to Dashboard
      router.push('/dashboard')
    } catch (error) {
      const err = error as { errors?: Record<string, string[]>, message?: string }
      // 4. Handle Errors from Django's ApiResponse
      if (err.errors) setValidationErrors(err.errors)
      else setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account" error={error}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email"
          id="email"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
          error={validationErrors.email}
        />
        <AuthInput
          label="Password"
          id="password"
          type="password"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
          error={validationErrors.password}
        />

        <button
          type="submit"
          disabled={!formData.email || !formData.password || isLoading}
          className={!formData.email || !formData.password || isLoading ? "w-full bg-primary/60 py-3 rounded-lg border-md font-medium hover:opacity-90 transition-opacity cursor-not-allowed" : "w-full bg-primary py-3 rounded-lg border-md font-medium hover:opacity-90 transition-opacity cursor-pointer"}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-secondary">
        Don't have an account? <Link href="/register" className="text-primary font-semibold">Create account</Link>
      </p>
    </AuthLayout>
  )
}