export interface Tag {
  id: string
  name: string
}

export interface Variable {
  id: string
  name: string
  description?: string
}

export interface Prompt {
  id: string
  name: string
  content: string
  tags: Tag[]
  variables: Variable[]
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  name: string
  description?: string
  prompts: {
    id: string
    promptId: string
    order: number
  }[]
  createdAt: string
  updatedAt: string
}

export type SortOrder = "asc" | "desc"

export interface PaginationParams {
  page: number
  limit: number
}

export interface FilterParams {
  search?: string
  tags?: string[]
  sortBy?: string
  sortOrder?: SortOrder
}

