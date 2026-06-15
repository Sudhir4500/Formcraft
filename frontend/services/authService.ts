import { apiPost } from './apiClient';
import { LoginCredentials, RegisterCredentials, LoginResponseData, ApiResponse } from '@/types/api';

export function loginUser(credentials: LoginCredentials): Promise<ApiResponse<LoginResponseData>> {
    return apiPost<LoginResponseData>('/api/auth/login/', credentials);
}

export function registerUser(credentials: RegisterCredentials): Promise<ApiResponse<LoginResponseData>> {
    return apiPost<LoginResponseData>('/api/auth/register/', credentials);
}

export function logoutUser(): Promise<ApiResponse<null>> {
    return apiPost<null>('/api/auth/logout/', {});
}
