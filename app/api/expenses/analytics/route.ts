import { type NextRequest, NextResponse } from "next/server"
import { ExpenseStorage } from "@/lib/expense-storage"
import type { ExpenseResponse } from "@/types/expense"

interface AnalyticsData {
  totalExpenses: number
  expensesByCategory: Record<string, number>
  monthlyExpenses: Record<string, number>
  averageExpense: number
  expenseCount: number
}

// GET /api/expenses/analytics - Get expense analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json<ExpenseResponse>({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const expenses = ExpenseStorage.getUserExpenses(userId)
    const totalExpenses = ExpenseStorage.getTotalExpenses(userId)

    // Calculate expenses by category
    const expensesByCategory = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    // Calculate monthly expenses
    const monthlyExpenses = expenses.reduce(
      (acc, expense) => {
        const month = expense.date.substring(0, 7) // YYYY-MM format
        acc[month] = (acc[month] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const analytics: AnalyticsData = {
      totalExpenses,
      expensesByCategory,
      monthlyExpenses,
      averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
      expenseCount: expenses.length,
    }

    return NextResponse.json<ExpenseResponse>({
      success: true,
      data: analytics as any,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json<ExpenseResponse>({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
