export interface Expense {
  id: string
  userId: string
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface CreateExpenseRequest {
  amount: number
  category: string
  description: string
  date: string
}

export interface UpdateExpenseRequest {
  amount?: number
  category?: string
  description?: string
  date?: string
}

export interface ExpenseResponse {
  success: boolean
  data?: Expense | Expense[]
  error?: string
}

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Personal Care",
  "Other",
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
