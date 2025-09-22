"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Calendar, PieChart } from "lucide-react"
import type { Expense } from "@/types/expense"

interface ExpenseStatsProps {
  expenses: Expense[]
}

export function ExpenseStats({ expenses }: ExpenseStatsProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const thisMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const now = new Date()
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
  })
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const categories = [...new Set(expenses.map((expense) => expense.category))]
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">All time total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${thisMonthTotal.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{thisMonthExpenses.length} transactions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${averageExpense.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categories.length}</div>
          <p className="text-xs text-muted-foreground">Active categories</p>
        </CardContent>
      </Card>
    </div>
  )
}
