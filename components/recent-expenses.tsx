"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Expense } from "@/types/expense"
import { format } from "date-fns"

interface RecentExpensesProps {
  expenses: Expense[]
  limit?: number
}

export function RecentExpenses({ expenses, limit = 5 }: RecentExpensesProps) {
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest transactions will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No expenses recorded yet</p>
            <p className="text-sm">Add your first expense to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>Your latest {limit} transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(expense.date), "MMM dd, yyyy")}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{expense.category}</Badge>
                <div className="text-right">
                  <p className="font-semibold text-lg">${expense.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
