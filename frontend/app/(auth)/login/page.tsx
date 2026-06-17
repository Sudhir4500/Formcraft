'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthInput } from '@/components/auth/AuthInput'
import { loginUser } from '@/services/authService' 
import { useAuthStore } from '@/store/authStore'
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler'
import { AuthLoadingOverlay } from '@/components/ui/AuthLoadingOverlay' // Import overlay

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  const router = useRouter()
  const syncUserSession = useAuthStore(state => state.syncUserSession)
  const { parseError } = useApiErrorHandler()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      const response = await loginUser(formData)

      if (!response.success) {
        const { message, validationErrors } = parseError(response)
        setError(message)
        setValidationErrors(validationErrors)
        setIsLoading(false) // Turn off overlay to allow correction adjustments
        return
      }

      // Sync session details securely
      const syncSuccessful = await syncUserSession()

      if (syncSuccessful) {
        router.refresh()
        router.push('/dashboard')
      } else {
        setError("Authentication succeeded, but profiling failed. Please retry signing in.")
        setIsLoading(false)
      }

    } catch (error) {
      const { message, validationErrors } = parseError(error)
      setError(message)
      setValidationErrors(validationErrors)
      setIsLoading(false)
    }
  }
  
  return (
    <>
      {/* Centralized Global Transition Overlay Ring */}
      <AuthLoadingOverlay isVisible={isLoading} message="Signing in ...." />

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
    </>
  )
}