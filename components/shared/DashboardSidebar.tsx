"use client"

import { Button } from "@/components/ui/button"
import { Mail, Package, Instagram, Bot } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardSidebarProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export function DashboardSidebar({ isSidebarOpen, toggleSidebar }: DashboardSidebarProps) {
  const pathname = usePathname()

  const overviewItem = {
    id: "dashboard",
    title: "Overview",
    icon: Bot,
    href: "/dashboard"
  }

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
    <div
      className={`fixed top-14 sm:top-16 left-0 bottom-0 z-40 w-64 sm:w-72 lg:w-80 bg-white/95 dark:bg-black/95 backdrop-blur-md border-r border-t border-gray-200/60 dark:border-gray-800/60 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 shadow-lg lg:shadow-none`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200/60 dark:border-gray-800/60">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Navigation
          </h2>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="space-y-6">
            {/* Overview Section */}
            <div className="space-y-2">
              <div key={overviewItem.id}>
                <Link href={overviewItem.href}>
                  <div
                    className={`flex items-center space-x-3 p-2.5 sm:p-3 lg:p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
                      pathname === overviewItem.href
                        ? "bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-sm"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      pathname === overviewItem.href
                        ? "bg-gray-200 dark:bg-gray-700" 
                        : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                    }`}>
                      <overviewItem.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">{overviewItem.title}</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Agents Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                Agents
              </h3>
              {agentItems.map((item) => {
                const IconComponent = item.icon
                const isCurrentPage = pathname === item.href

                return (
                  <div key={item.id}>
                    <Link href={item.href}>
                      <div
                        className={`flex items-center space-x-3 p-2.5 sm:p-3 lg:p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
                          isCurrentPage
                            ? "bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-sm"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg transition-colors ${
                          isCurrentPage 
                            ? "bg-gray-200 dark:bg-gray-700" 
                            : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                        }`}>
                          <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <span className="text-sm sm:text-base font-medium">{item.title}</span>
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
