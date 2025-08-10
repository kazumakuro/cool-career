// グローバル型定義

// 基本的な型定義の例
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

// APIレスポンス型
export interface ApiResponse<T> {
  data: T
  error?: string
  success: boolean
}

// ページネーション型
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}