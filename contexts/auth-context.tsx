"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("expense-tracker-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem("expense-tracker-users") || "[]")
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (user) {
        const userData = { id: user.id, email: user.email, name: user.name }
        setUser(userData)
        localStorage.setItem("expense-tracker-user", JSON.stringify(userData))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem("expense-tracker-users") || "[]")

      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return false
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
      }

      users.push(newUser)
      localStorage.setItem("expense-tracker-users", JSON.stringify(users))

      const userData = { id: newUser.id, email: newUser.email, name: newUser.name }
      setUser(userData)
      localStorage.setItem("expense-tracker-user", JSON.stringify(userData))
      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("expense-tracker-user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
