"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EXPENSE_CATEGORIES, type Expense } from "@/types/expense"
import { useExpenses } from "@/hooks/use-expenses"
import { useToast } from "@/hooks/use-toast"

interface EditExpenseDialogProps {
  expense: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditExpenseDialog({ expense, open, onOpenChange }: EditExpenseDialogProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)

  const { updateExpense } = useExpenses()
  const { toast } = useToast()

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString())
      setCategory(expense.category)
      setDescription(expense.description)
      setDate(expense.date)
    }
  }, [expense])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!expense) return

    setLoading(true)

    const success = await updateExpense(expense.id, {
      amount: Number.parseFloat(amount),
      category,
      description,
      date,
    })

    if (success) {
      toast({
        title: "Expense Updated",
        description: "Your expense has been updated successfully.",
      })
      onOpenChange(false)
    } else {
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset form when closing
    if (expense) {
      setAmount(expense.amount.toString())
      setCategory(expense.category)
      setDescription(expense.description)
      setDate(expense.date)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>Make changes to your expense. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input id="edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
