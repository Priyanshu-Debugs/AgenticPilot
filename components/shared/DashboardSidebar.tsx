"use client"

// Core UI components
import { Button } from "@/components/ui/button"
// Icon imports for navigation items
import { Mail, Package, Instagram, Bot } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Props interface for type safety
interface DashboardSidebarProps {
  isSidebarOpen: boolean   // Controls mobile sidebar visibility
  toggleSidebar: () => void // Function to close sidebar when item is clicked
}

/**
 * DashboardSidebar Component
 * 
 * A responsive sidebar navigation for the dashboard with:
 * - Fixed positioning with top offset for navbar
 * - Mobile slide-in/out animation
 * - Overview section for main dashboard
 * - Agent automation sections (Gmail, Inventory, Instagram)
 * - Active page highlighting with gray background
 * - Responsive width and spacing
 * 
 * Features:
 * - Hidden on desktop (lg) when not needed
 * - Backdrop blur effect for modern appearance  
 * - Smooth transitions and hover effects
 * - Organized navigation hierarchy
 */
export function DashboardSidebar({ isSidebarOpen, toggleSidebar }: DashboardSidebarProps) {
  const pathname = usePathname()

  // Overview/main dashboard navigation item
  const overviewItem = {
    id: "dashboard",
    title: "Overview",
    icon: Bot,
    href: "/dashboard"
  }

  // Agent automation navigation items
  const agentItems = [
    {
      id: "gmail",
      title: "Gmail Auto Reply",
      icon: Mail,
      href: "/dashboard/gmail"
    },
    {
      id: "inventory", 
      title: "Inventory Management",
      icon: Package,
      href: "/dashboard/inventory"
    },
    {
      id: "instagram",
      title: "Instagram Automation", 
      icon: Instagram,
      href: "/dashboard/instagram"
    }
  ]

  return (
    // Fixed sidebar with Supabase-inspired design
    <div
      className={`fixed top-14 sm:top-16 left-0 bottom-0 z-40 w-64 sm:w-72 lg:w-80 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        
        {/* Sidebar Header */}
        <div className="p-4 sm:p-6 border-b border-sidebar-border">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Navigation
          </h2>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Overview Section */}
            <div className="space-y-1">
              <div key={overviewItem.id} onClick={toggleSidebar}>
                <Link href={overviewItem.href}>
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                      pathname === overviewItem.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                    }`}
                  >
                    <div className={`p-2 rounded-md transition-colors ${
                      pathname === overviewItem.href
                        ? "bg-primary text-primary-foreground" 
                        : "bg-sidebar-accent text-sidebar-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                    }`}>
                      <overviewItem.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{overviewItem.title}</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Agents Section */}
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
                AI Agents
              </h3>
              {agentItems.map((item) => {
                const IconComponent = item.icon
                const isCurrentPage = pathname === item.href

                return (
                  <div key={item.id} onClick={toggleSidebar}>
                    <Link href={item.href}>
                      <div
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                          isCurrentPage
                            ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                        }`}
                      >
                        <div className={`p-2 rounded-md transition-colors ${
                          isCurrentPage 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-sidebar-accent text-sidebar-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                        }`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
