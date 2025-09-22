"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, PieChart, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-4">
              <DollarSign className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Take Control of Your
              <span className="text-primary"> Finances</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Track expenses, analyze spending patterns, and make informed financial decisions with our intuitive
              expense tracker.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Smart Analytics</CardTitle>
              <CardDescription>Get insights into your spending habits with detailed charts and reports</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <PieChart className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Category Tracking</CardTitle>
              <CardDescription>Organize expenses by categories and see where your money goes</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>Your financial data is encrypted and stored securely</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
