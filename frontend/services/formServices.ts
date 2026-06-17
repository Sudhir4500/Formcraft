import { apiPost } from '@/services/apiClient'
import type { CreateFormPayload, Form } from '@/types/forms'
import type { ApiResponse } from '@/types/api'   // <- correct path

export async function createForm(formData: CreateFormPayload): Promise<ApiResponse<Form>> {
  return apiPost<Form>('/api/forms', formData);
}
export async function getForm(slug: string): Promise<ApiResponse<Form>> {
  return apiPost<Form>(`/api/forms/${slug}`, {});
}



