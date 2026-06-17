
import { apiPost } from './apiClient'
import type { LoginCredentials, RegisterCredentials, ApiResponse } from '@/types/api'
import type { User } from '@/types/user'

// What the BFF returns to the browser (tokens stripped, user only)
type AuthResult = { user: User }

export function loginUser(credentials: LoginCredentials): Promise<ApiResponse<AuthResult>> {
  // No trailing slash — Next.js BFF route is /api/auth/login
  // Django URL (in login/route.ts) has the trailing slash: auth/login/
  return apiPost<AuthResult>('/api/auth/login', credentials)
}

export function registerUser(credentials: RegisterCredentials): Promise<ApiResponse<AuthResult>> {
  return apiPost<AuthResult>('/api/auth/register', credentials)
}

export function logoutUser(): Promise<ApiResponse<null>> {
  return apiPost<null>('/api/auth/logout', {})
}