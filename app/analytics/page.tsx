"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { CategoryPieChart } from "@/components/category-pie-chart"
import { MonthlyTrendChart } from "@/components/monthly-trend-chart"
import { SpendingInsights } from "@/components/spending-insights"
import { ExpenseStats } from "@/components/expense-stats"
import { Toaster } from "@/components/ui/toaster"
import { useExpenses } from "@/hooks/use-expenses"

export default function AnalyticsPage() {
  const { expenses, loading, error } = useExpenses()

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-balance">Analytics & Insights</h2>
              <p className="text-muted-foreground text-pretty">
                Visualize your spending patterns and gain insights into your financial habits
              </p>
            </div>

            {/* Stats Overview */}
            <ExpenseStats expenses={expenses} />

            {/* Charts Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              <CategoryPieChart expenses={expenses} />
              <MonthlyTrendChart expenses={expenses} />
            </div>

            {/* Insights */}
            <SpendingInsights expenses={expenses} />

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
          </div>
        </main>

        <Toaster />
      </div>
    </ProtectedRoute>
  )
}
