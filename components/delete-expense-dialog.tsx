"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Expense } from "@/types/expense"
import { useExpenses } from "@/hooks/use-expenses"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface DeleteExpenseDialogProps {
  expense: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteExpenseDialog({ expense, open, onOpenChange }: DeleteExpenseDialogProps) {
  const [loading, setLoading] = useState(false)
  const { deleteExpense } = useExpenses()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!expense) return

    setLoading(true)

    const success = await deleteExpense(expense.id)

    if (success) {
      toast({
        title: "Expense Deleted",
        description: "The expense has been deleted successfully.",
      })
      onOpenChange(false)
    } else {
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the expense "{expense?.description}" for $
            {expense?.amount.toFixed(2)}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
