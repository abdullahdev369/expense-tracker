"use client"

import { useState, useEffect } from "react"
import type { Expense, CreateExpenseRequest, UpdateExpenseRequest } from "@/types/expense"
import { useAuth } from "@/contexts/auth-context"

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchExpenses = () => {
    if (!user) return;
    setLoading(true);
    try {
      const allExpenses = JSON.parse(localStorage.getItem("expense-tracker-expenses") || "[]");
      const userExpenses = allExpenses.filter((expense: any) => expense.userId === user.id);
      setExpenses(userExpenses);
      setError(null);
    } catch (err) {
      setError("Failed to fetch expenses");
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  }

  const createExpense = async (expenseData: CreateExpenseRequest): Promise<boolean> => {
    if (!user) return false;
    try {
      const allExpenses = JSON.parse(localStorage.getItem("expense-tracker-expenses") || "[]");
      const newExpense: Expense = {
        id: Date.now().toString(),
        userId: user.id,
        ...expenseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      allExpenses.push(newExpense);
      localStorage.setItem("expense-tracker-expenses", JSON.stringify(allExpenses));
      fetchExpenses();
      return true;
    } catch (err) {
      setError("Failed to create expense");
      console.error("Error creating expense:", err);
      return false;
    }
  }

  const updateExpense = async (id: string, updates: UpdateExpenseRequest): Promise<boolean> => {
    if (!user) return false;
    try {
      const allExpenses = JSON.parse(localStorage.getItem("expense-tracker-expenses") || "[]");
      const idx = allExpenses.findIndex((expense: any) => expense.id === id && expense.userId === user.id);
      if (idx === -1) return false;
      allExpenses[idx] = {
        ...allExpenses[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("expense-tracker-expenses", JSON.stringify(allExpenses));
      fetchExpenses();
      return true;
    } catch (err) {
      setError("Failed to update expense");
      console.error("Error updating expense:", err);
      return false;
    }
  }

  const deleteExpense = async (id: string): Promise<boolean> => {
    if (!user) return false;
    try {
      let allExpenses = JSON.parse(localStorage.getItem("expense-tracker-expenses") || "[]");
      const initialLength = allExpenses.length;
      allExpenses = allExpenses.filter((expense: any) => !(expense.id === id && expense.userId === user.id));
      if (allExpenses.length === initialLength) return false;
      localStorage.setItem("expense-tracker-expenses", JSON.stringify(allExpenses));
      fetchExpenses();
      return true;
    } catch (err) {
      setError("Failed to delete expense");
      console.error("Error deleting expense:", err);
      return false;
    }
  }

  useEffect(() => {
    fetchExpenses();
    // Listen to localStorage changes from other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === "expense-tracker-expenses") fetchExpenses();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  return {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  }
}
