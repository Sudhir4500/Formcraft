export interface Form {
  id: number
  title: string
  description?: string
  slug: string
  is_published: boolean
  created_at: string
  updated_at: string
}
export interface CreateFormPayload {
  title: string
  description?: string
}

