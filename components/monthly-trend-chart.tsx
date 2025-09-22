"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { Expense } from "@/types/expense"
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns"

interface MonthlyTrendChartProps {
  expenses: Expense[]
}

export function MonthlyTrendChart({ expenses }: MonthlyTrendChartProps) {
  // Get last 12 months
  const endDate = new Date()
  const startDate = subMonths(endDate, 11)

  const months = eachMonthOfInterval({
    start: startOfMonth(startDate),
    end: endOfMonth(endDate),
  })

  const monthlyData = months.map((month) => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)

    const monthExpenses = expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date)
      return expenseDate >= monthStart && expenseDate <= monthEnd
    })

    const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const transactionCount = monthExpenses.length

    return {
      month: format(month, "MMM yyyy"),
      amount: totalAmount,
      count: transactionCount,
    }
  })

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Trend</CardTitle>
          <CardDescription>Your spending pattern over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No expense data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Trend</CardTitle>
        <CardDescription>Your spending pattern over the last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: {
              label: "Amount ($)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <ChartTooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm">Total: ${data.amount.toFixed(2)}</p>
                          <p className="text-sm">Transactions: {data.count}</p>
                        </div>
                      </ChartTooltipContent>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
