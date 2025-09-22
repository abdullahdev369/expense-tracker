"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import type { Expense } from "@/types/expense"

interface CategoryPieChartProps {
  expenses: Expense[]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(162.4, 50%, 45%)",
  "hsl(162.4, 40%, 55%)",
  "hsl(162.4, 30%, 65%)",
  "hsl(162.4, 20%, 75%)",
  "hsl(162.4, 10%, 85%)",
]

export function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  const categoryData = expenses.reduce(
    (acc, expense) => {
      const existing = acc.find((item) => item.category === expense.category)
      if (existing) {
        existing.amount += expense.amount
        existing.count += 1
      } else {
        acc.push({
          category: expense.category,
          amount: expense.amount,
          count: 1,
        })
      }
      return acc
    },
    [] as Array<{ category: string; amount: number; count: number }>,
  )

  const chartData = categoryData
    .sort((a, b) => b.amount - a.amount)
    .map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length],
      percentage: ((item.amount / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100).toFixed(1),
    }))

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>Distribution of your spending across categories</CardDescription>
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
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Distribution of your spending across categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: {
              label: "Amount",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <ChartTooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">{data.category}</p>
                          <p className="text-sm">Amount: ${data.amount.toFixed(2)}</p>
                          <p className="text-sm">Transactions: {data.count}</p>
                          <p className="text-sm">Percentage: {data.percentage}%</p>
                        </div>
                      </ChartTooltipContent>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
