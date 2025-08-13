"use client"

import { Button } from "@/components/ui/button"
import { Menu, Bell } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

interface DashboardNavbarProps {
  toggleSidebar: () => void
  pageTitle: string
}

export function DashboardNavbar({ toggleSidebar, pageTitle }: DashboardNavbarProps) {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden transition-all duration-200 hover:scale-105 hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold">{pageTitle}</h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/notifications">
              <Button variant="ghost" size="sm">
                <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
