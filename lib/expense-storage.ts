import type { Expense, CreateExpenseRequest, UpdateExpenseRequest } from "@/types/expense"

const EXPENSES_KEY = "expense-tracker-expenses"

export class ExpenseStorage {
  static getAllExpenses(): Expense[] {
    if (typeof window === "undefined") return []
    try {
      const expenses = localStorage.getItem(EXPENSES_KEY)
      return expenses ? JSON.parse(expenses) : []
    } catch (error) {
      console.error("Error reading expenses:", error)
      return []
    }
  }

  static getUserExpenses(userId: string): Expense[] {
    return this.getAllExpenses().filter((expense) => expense.userId === userId)
  }

  static getExpenseById(id: string, userId: string): Expense | null {
    const expenses = this.getUserExpenses(userId)
    return expenses.find((expense) => expense.id === id) || null
  }

  static createExpense(userId: string, expenseData: CreateExpenseRequest): Expense {
    const expenses = this.getAllExpenses()
    const newExpense: Expense = {
      id: Date.now().toString(),
      userId,
      ...expenseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    expenses.push(newExpense)
    this.saveExpenses(expenses)
    return newExpense
  }

  static updateExpense(id: string, userId: string, updates: UpdateExpenseRequest): Expense | null {
    const expenses = this.getAllExpenses()
    const expenseIndex = expenses.findIndex((expense) => expense.id === id && expense.userId === userId)

    if (expenseIndex === -1) return null

    expenses[expenseIndex] = {
      ...expenses[expenseIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveExpenses(expenses)
    return expenses[expenseIndex]
  }

  static deleteExpense(id: string, userId: string): boolean {
    const expenses = this.getAllExpenses()
    const filteredExpenses = expenses.filter((expense) => !(expense.id === id && expense.userId === userId))

    if (filteredExpenses.length === expenses.length) return false

    this.saveExpenses(filteredExpenses)
    return true
  }

  static getExpensesByCategory(userId: string): Record<string, Expense[]> {
    const expenses = this.getUserExpenses(userId)
    return expenses.reduce(
      (acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = []
        }
        acc[expense.category].push(expense)
        return acc
      },
      {} as Record<string, Expense[]>,
    )
  }

  static getTotalExpenses(userId: string): number {
    const expenses = this.getUserExpenses(userId)
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  static getExpensesByDateRange(userId: string, startDate: string, endDate: string): Expense[] {
    const expenses = this.getUserExpenses(userId)
    return expenses.filter((expense) => expense.date >= startDate && expense.date <= endDate)
  }

  private static saveExpenses(expenses: Expense[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
    } catch (error) {
      console.error("Error saving expenses:", error)
    }
  }
}
