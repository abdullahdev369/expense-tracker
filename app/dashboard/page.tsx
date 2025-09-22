"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { ExpenseStats } from "@/components/expense-stats"
import { RecentExpenses } from "@/components/recent-expenses"
import { QuickAddExpense } from "@/components/quick-add-expense"
import { useExpenses } from "@/hooks/use-expenses"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardPage() {
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
            {/* Welcome Section */}
            <div>
              <h2 className="text-3xl font-bold text-balance">Dashboard</h2>
              <p className="text-muted-foreground text-pretty">
                Track your expenses and manage your budget effectively
              </p>
            </div>

            {/* Stats Overview */}
            <ExpenseStats expenses={expenses} />

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Recent Expenses - Takes 2 columns */}
              <div className="lg:col-span-2">
                <RecentExpenses expenses={expenses} />
              </div>

              {/* Quick Add - Takes 1 column */}
              <div>
                <QuickAddExpense />
              </div>
            </div>

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
