"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Expense } from "@/types/expense"
import { TrendingUp, TrendingDown, AlertCircle, Target } from "lucide-react"
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from "date-fns"

interface SpendingInsightsProps {
  expenses: Expense[]
}

export function SpendingInsights({ expenses }: SpendingInsightsProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
          <CardDescription>Personalized insights about your spending habits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Add some expenses to see insights</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate insights
  const now = new Date()
  const thisMonth = {
    start: startOfMonth(now),
    end: endOfMonth(now),
  }
  const lastMonth = {
    start: startOfMonth(subMonths(now, 1)),
    end: endOfMonth(subMonths(now, 1)),
  }

  const thisMonthExpenses = expenses.filter((expense) => {
    const date = parseISO(expense.date)
    return date >= thisMonth.start && date <= thisMonth.end
  })

  const lastMonthExpenses = expenses.filter((expense) => {
    const date = parseISO(expense.date)
    return date >= lastMonth.start && date <= lastMonth.end
  })

  const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const monthlyChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

  // Find top category
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]

  // Calculate average expense
  const averageExpense = expenses.length > 0 ? expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length : 0

  // Find largest expense
  const largestExpense = expenses.reduce((max, expense) => (expense.amount > max.amount ? expense : max), expenses[0])

  const insights = [
    {
      title: "Monthly Comparison",
      description: `${Math.abs(monthlyChange).toFixed(1)}% ${monthlyChange >= 0 ? "increase" : "decrease"} from last month`,
      icon: monthlyChange >= 0 ? TrendingUp : TrendingDown,
      variant: monthlyChange >= 0 ? "destructive" : "default",
      value: `$${thisMonthTotal.toFixed(2)} this month`,
    },
    {
      title: "Top Category",
      description: `${(((topCategory?.[1] || 0) / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100).toFixed(1)}% of total spending`,
      icon: Target,
      variant: "default",
      value: `${topCategory?.[0] || "N/A"} - $${(topCategory?.[1] || 0).toFixed(2)}`,
    },
    {
      title: "Average Expense",
      description: "Per transaction across all time",
      icon: AlertCircle,
      variant: "secondary",
      value: `$${averageExpense.toFixed(2)}`,
    },
    {
      title: "Largest Expense",
      description: format(parseISO(largestExpense?.date || new Date().toISOString()), "MMM dd, yyyy"),
      icon: TrendingUp,
      variant: "outline",
      value: `$${largestExpense?.amount.toFixed(2) || "0.00"}`,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>Personalized insights about your spending habits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
              <div className="mt-1">
                <insight.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{insight.title}</h4>
                  <Badge variant={insight.variant as any}>{insight.value}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
