export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface WorkItem {
  id: string
  reference: string
  name: string
  project: string
  owner: string
  status: string
  dueDate: string
  progress: number
  risk: '정상' | '주의' | '위험'
}
