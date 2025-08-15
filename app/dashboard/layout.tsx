"use client"

// React hooks
import { useState } from "react"
// Shared dashboard components
import { DashboardSidebar } from "@/components/shared/DashboardSidebar"
import { DashboardNavbar } from "@/components/shared/DashboardNavbar"

// Props interface for type safety
interface DashboardLayoutProps {
  children: React.ReactNode // Page content to be rendered
}

/**
 * DashboardLayout Component
 * 
 * Main layout wrapper for all dashboard pages that provides:
 * - Fixed navbar at the top
 * - Responsive sidebar navigation
 * - Main content area with proper spacing
 * - Mobile overlay for sidebar
 * - Consistent theming and background
 * 
 * Layout Structure:
 * - Navbar: Fixed at top, spans full width
 * - Sidebar: Fixed on left, hidden on mobile
 * - Content: Flexible area with responsive padding
 * - Overlay: Dark backdrop for mobile sidebar
 * 
 * Responsive Behavior:
 * - Mobile: Sidebar slides in/out, navbar shows menu button
 * - Desktop: Sidebar always visible, content has left margin
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Toggle function for sidebar open/close
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    // Main dashboard container with Supabase-inspired design
    <div className="min-h-screen bg-background text-foreground">
      
      {/* Fixed navbar component spanning full width */}
      <DashboardNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      {/* Main layout container with top padding for fixed navbar */}
      <div className="flex pt-14 sm:pt-16">
        
        {/* Sidebar navigation component */}
        <DashboardSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content area with responsive margins */}
        <div className="flex-1 lg:ml-80 min-w-0">
          {/* Content wrapper with responsive padding */}
          <div className="container-padding py-6 sm:py-8">
            {/* Page-specific content rendered here */}
            {children}
          </div>
        </div>

        {/* Mobile sidebar backdrop overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  )
}
