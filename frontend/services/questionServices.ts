// services/questionServices.ts
import { apiGet, apiPost, apiPatch, apiDelete } from '@/services/apiClient'

export function getQuestions(slug: string) {
  return apiGet(`/api/forms/${slug}/questions`)
}

export function createQuestion(slug: string, question: any) {
  return apiPost(`/api/forms/${slug}/questions`, question)
}

export function updateQuestion(slug: string, id: string, question: any) {
  return apiPatch(`/api/forms/${slug}/questions/${id}`, question)
}

export function deleteQuestion(slug: string, id: string) {
  return apiDelete(`/api/forms/${slug}/questions/${id}`)
}

export function bulkQuestions(slug: string, questions: any[]) {
  return apiPost(`/api/forms/${slug}/bulk-questions`, questions)
}
