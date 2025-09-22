"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { DollarSign, LogOut, LayoutDashboard, Receipt, BarChart3 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <DollarSign className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Expense Tracker</h1>
                <p className="text-sm text-muted-foreground">Manage your finances</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <Button asChild variant={pathname === "/dashboard" ? "default" : "ghost"} size="sm" className="gap-2">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild variant={pathname === "/expenses" ? "default" : "ghost"} size="sm" className="gap-2">
                <Link href="/expenses">
                  <Receipt className="h-4 w-4" />
                  Expenses
                </Link>
              </Button>
              <Button asChild variant={pathname === "/analytics" ? "default" : "ghost"} size="sm" className="gap-2">
                <Link href="/analytics">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
              </Button>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="md:hidden">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/expenses" className="cursor-pointer">
                    <Receipt className="mr-2 h-4 w-4" />
                    Expenses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/analytics" className="cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
