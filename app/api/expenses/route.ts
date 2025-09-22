import { type NextRequest, NextResponse } from "next/server"
import { ExpenseStorage } from "@/lib/expense-storage"
import type { CreateExpenseRequest, ExpenseResponse } from "@/types/expense"

// GET /api/expenses - Get all expenses for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json<ExpenseResponse>({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const expenses = ExpenseStorage.getUserExpenses(userId)

    return NextResponse.json<ExpenseResponse>({
      success: true,
      data: expenses,
    })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json<ExpenseResponse>({ success: false, error: "Failed to fetch expenses" }, { status: 500 })
  }
}

// POST /api/expenses - Create a new expense
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json<ExpenseResponse>({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const body: CreateExpenseRequest = await request.json()

    // Validate required fields
    if (!body.amount || !body.category || !body.description || !body.date) {
      return NextResponse.json<ExpenseResponse>({ success: false, error: "All fields are required" }, { status: 400 })
    }

    // Validate amount is positive
    if (body.amount <= 0) {
      return NextResponse.json<ExpenseResponse>(
        { success: false, error: "Amount must be greater than 0" },
        { status: 400 },
      )
    }

    const newExpense = ExpenseStorage.createExpense(userId, body)

    return NextResponse.json<ExpenseResponse>(
      {
        success: true,
        data: newExpense,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json<ExpenseResponse>({ success: false, error: "Failed to create expense" }, { status: 500 })
  }
}
