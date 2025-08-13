"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { DashboardSidebar } from "@/components/shared/DashboardSidebar"
import { DashboardNavbar } from "@/components/shared/DashboardNavbar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  // Get page title based on current pathname
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard"
      case "/dashboard/gmail":
        return "Gmail Automation"
      case "/dashboard/inventory":
        return "Inventory Management"
      case "/dashboard/instagram":
        return "Instagram Automation"
      default:
        return "Dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex">
      {/* Sidebar */}
      <DashboardSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation */}
        <DashboardNavbar toggleSidebar={toggleSidebar} pageTitle={getPageTitle()} />

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
}
