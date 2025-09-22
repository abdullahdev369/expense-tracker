"use client"

import { useState, useMemo } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { ExpenseFilters } from "@/components/expense-filters"
import { EditExpenseDialog } from "@/components/edit-expense-dialog"
import { DeleteExpenseDialog } from "@/components/delete-expense-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/toaster"
import { useExpenses } from "@/hooks/use-expenses"
import type { Expense } from "@/types/expense"
import { format } from "date-fns"
import { Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"

export default function ExpensesPage() {
  const { expenses, loading, error } = useExpenses()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)

  const filteredAndSortedExpenses = useMemo(() => {
    const filtered = expenses.filter((expense) => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || expense.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case "amount":
          aValue = a.amount
          bValue = b.amount
          break
        case "category":
          aValue = a.category
          bValue = b.category
          break
        case "description":
          aValue = a.description.toLowerCase()
          bValue = b.description.toLowerCase()
          break
        case "date":
        default:
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [expenses, searchTerm, selectedCategory, sortBy, sortOrder])

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSortBy("date")
    setSortOrder("desc")
  }

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
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-balance">All Expenses</h2>
                <p className="text-muted-foreground text-pretty">Manage and track all your expenses in one place</p>
              </div>
              <Button asChild className="gap-2">
                <Link href="/dashboard">
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Link>
              </Button>
            </div>

            {/* Filters */}
            <ExpenseFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              onClearFilters={handleClearFilters}
            />

            {/* Expenses List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Expenses ({filteredAndSortedExpenses.length}
                  {filteredAndSortedExpenses.length !== expenses.length && ` of ${expenses.length}`})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredAndSortedExpenses.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      {expenses.length === 0 ? "No expenses found" : "No expenses match your filters"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {expenses.length === 0
                        ? "Add your first expense to get started"
                        : "Try adjusting your search criteria"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAndSortedExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <h3 className="font-medium">{expense.description}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(expense.date), "MMMM dd, yyyy")}
                              </p>
                            </div>
                            <Badge variant="secondary">{expense.category}</Badge>
                            <div className="text-right">
                              <p className="font-semibold text-lg">${expense.amount.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingExpense(expense)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingExpense(expense)}
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
          </div>
        </main>

        {/* Dialogs */}
        <EditExpenseDialog
          expense={editingExpense}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
        />

        <DeleteExpenseDialog
          expense={deletingExpense}
          open={!!deletingExpense}
          onOpenChange={(open) => !open && setDeletingExpense(null)}
        />

        <Toaster />
      </div>
    </ProtectedRoute>
  )
}
