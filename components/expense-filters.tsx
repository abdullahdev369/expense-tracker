"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EXPENSE_CATEGORIES } from "@/types/expense"
import { Search, X } from "lucide-react"

interface ExpenseFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  sortOrder: "asc" | "desc"
  onSortOrderChange: (value: "asc" | "desc") => void
  onClearFilters: () => void
}

export function ExpenseFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
}: ExpenseFiltersProps) {
  const hasActiveFilters = searchTerm || selectedCategory || sortBy !== "date" || sortOrder !== "desc"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search descriptions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort-by">Sort by</Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="description">Description</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort-order">Order</Label>
            <Select value={sortOrder} onValueChange={onSortOrderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={onClearFilters} className="gap-2 bg-transparent">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
