"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/shared/DashboardSidebar"
import { DashboardNavbar } from "@/components/shared/DashboardNavbar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Top Navigation - Full Width */}
      <DashboardNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex pt-14 sm:pt-16">
        {/* Sidebar */}
        <DashboardSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-80 min-w-0">
          {/* Page Content */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  )
}
