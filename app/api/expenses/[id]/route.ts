import { type NextRequest, NextResponse } from "next/server"
import { ExpenseStorage } from "@/lib/expense-storage"
import type { UpdateExpenseRequest, ExpenseResponse } from "@/types/expense"

// GET /api/expenses/[id] - Get a specific expense
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json<ExpenseResponse>({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const expense = ExpenseStorage.getExpenseById(params.id, userId)

    if (!expense) {
      return NextResponse.json<ExpenseResponse>({ success: false, error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json<ExpenseResponse>({
      success: true,
      data: expense,
    })
  } catch (error) {
    console.error("Error fetching expense:", error)
    return NextResponse.json<ExpenseResponse>({ success: false, error: "Failed to fetch expense" }, { status: 500 })
  }
}

// PUT /api/expenses/[id] - Update a specific expense
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json<ExpenseResponse>({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const body: UpdateExpenseRequest = await request.json()

    // Validate amount if provided
    if (body.amount !== undefined && body.amount <= 0) {
      return NextResponse.json<ExpenseResponse>(
        { success: false, error: "Amount must be greater than 0" },
        { status: 400 },
      )
    }

    const updatedExpense = ExpenseStorage.updateExpense(params.id, userId, body)

    if (!updatedExpense) {
      return NextResponse.json<ExpenseResponse>({ success: false, error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json<ExpenseResponse>({
      success: true,
      data: updatedExpense,
    })
  } catch (error) {
    console.error("Error updating expense:", error)
    return NextResponse.json<ExpenseResponse>({ success: false, error: "Failed to update expense" }, { status: 500 })
  }
}

// DELETE /api/expenses/[id] - Delete a specific expense
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json<ExpenseResponse>({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const deleted = ExpenseStorage.deleteExpense(params.id, userId)

    if (!deleted) {
      return NextResponse.json<ExpenseResponse>({ success: false, error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json<ExpenseResponse>({
      success: true,
    })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json<ExpenseResponse>({ success: false, error: "Failed to delete expense" }, { status: 500 })
  }
}
