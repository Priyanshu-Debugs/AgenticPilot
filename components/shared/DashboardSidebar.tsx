"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Package, Instagram, Bot, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardSidebarProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export function DashboardSidebar({ isSidebarOpen, toggleSidebar }: DashboardSidebarProps) {
  const pathname = usePathname()

  const navigationItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: Bot,
      status: "Active",
      href: "/dashboard",
    },
    {
      id: "gmail",
      title: "Gmail Auto Reply",
      icon: Mail,
      status: "Active",
      href: "/dashboard/gmail",
    },
    {
      id: "inventory",
      title: "Inventory Management",
      icon: Package,
      status: "Active",
      href: "/dashboard/inventory",
    },
    {
      id: "instagram",
      title: "Instagram Automation",
      icon: Instagram,
      status: "Soon",
      href: "/dashboard/instagram",
    },
  ]

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-black dark:text-white" />
            <Link href="/" className="text-lg sm:text-xl font-bold">
              AgenticPilot
            </Link>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden transition-all duration-200 hover:scale-105 hover:bg-black/5 dark:hover:bg-white/5" 
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">
              Navigation
            </h3>

            {navigationItems.map((item) => {
              const IconComponent = item.icon
              const isCurrentPage = pathname === item.href

              return (
                <div key={item.id} className="space-y-2">
                  <Link href={item.href}>
                    <div
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
                        isCurrentPage
                          ? "bg-black/5 dark:bg-white/5"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base font-medium">{item.title}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          item.status === "Active"
                            ? "border-green-500 text-green-600 dark:text-green-400"
                            : item.status === "Paused"
                              ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                              : "border-gray-500 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
