"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Package, Instagram, Bot, Menu, X, BarChart3, Settings, Zap, Bell } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null)

  const automations = [
    {
      id: "gmail",
      title: "Gmail Auto Reply",
      icon: Mail,
      status: "Active",
      details: {
        description: "Automatically reply to customer emails with personalized responses",
        stats: { processed: 234, success: "98.5%", avgResponse: "2.3s" },
        features: ["Smart categorization", "Custom templates", "Response scheduling"],
      },
    },
    {
      id: "inventory",
      title: "Inventory Management",
      icon: Package,
      status: "Active",
      details: {
        description: "Track stock levels and automate reordering processes",
        stats: { items: 1247, lowStock: 23, orders: 45 },
        features: ["Real-time tracking", "Auto-reorder", "Supplier integration"],
      },
    },
    {
      id: "instagram",
      title: "Instagram Automation",
      icon: Instagram,
      status: "Soon",
      details: {
        description: "Schedule posts and manage your Instagram presence automatically",
        stats: { scheduled: 0, engagement: "0%", followers: 0 },
        features: ["Post scheduling", "Content generation", "Analytics tracking"],
      },
    },
  ]

  const getAutomationDetails = (id: string) => {
    return automations.find((auto) => auto.id === id)?.details
  }

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex">
      {/* Sidebar - Simplified burger menu with minimal design */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-black dark:text-white" />
              <Link href="/" className="text-xl font-bold">
                AgenticPilot
              </Link>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar Content - Removed buttons and details, made names sleek */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Automations
              </h3>

              {automations.map((automation) => {
                const IconComponent = automation.icon
                const isSelected = selectedAutomation === automation.id

                return (
                  <div key={automation.id} className="space-y-2">
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                        isSelected ? "bg-black/5 dark:bg-white/5" : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                      onClick={() => setSelectedAutomation(isSelected ? null : automation.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{automation.title}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          automation.status === "Active"
                            ? "border-green-500 text-green-600 dark:text-green-400"
                            : automation.status === "Paused"
                              ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                              : "border-gray-500 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {automation.status}
                      </Badge>
                    </div>

                    {isSelected && (
                      <div className="ml-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {getAutomationDetails(automation.id)?.description}
                        </p>
                        <div className="space-y-2 mb-3">
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Features</h4>
                          <ul className="text-xs space-y-1">
                            {getAutomationDetails(automation.id)?.features.map((feature, index) => (
                              <li key={index} className="text-gray-600 dark:text-gray-400">
                                • {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {automation.id === "gmail" && (
                          <Link href="/dashboard/gmail-automation">
                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
                              Go to Gmail Automation
                            </Button>
                          </Link>
                        )}
                        {automation.id === "inventory" && (
                          <Link href="/dashboard/inventory">
                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
                              Go to Inventory Management
                            </Button>
                          </Link>
                        )}
                        {automation.id === "instagram" && (
                          <Link href="/dashboard/instagram">
                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
                              Go to Instagram Automation
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation - Added notification icon */}
        <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="lg:hidden transition-all duration-200 hover:scale-105 hover:bg-black/5 dark:hover:bg-white/5"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>

              <div className="flex items-center space-x-4">
                <Link href="/notifications">
                  <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                </Link>
                <ModeToggle />
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {selectedAutomation ? (
            <div className="space-y-6">
              {(() => {
                const automation = automations.find((a) => a.id === selectedAutomation)
                const details = automation?.details
                if (!automation || !details) return null

                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <automation.icon className="h-8 w-8" />
                        <div>
                          <h2 className="text-2xl font-bold">{automation.title}</h2>
                          <p className="text-gray-600 dark:text-gray-400">{details.description}</p>
                        </div>
                      </div>
                      {automation.id === "gmail" && (
                        <Link href="/dashboard/gmail-automation">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Open Gmail Automation
                          </Button>
                        </Link>
                      )}
                      {automation.id === "inventory" && (
                        <Link href="/dashboard/inventory">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Open Inventory Management
                          </Button>
                        </Link>
                      )}
                      {automation.id === "instagram" && (
                        <Link href="/dashboard/instagram">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Open Instagram Automation
                          </Button>
                        </Link>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(details.stats).map(([key, value]) => (
                        <Card key={key} className="border-gray-200 dark:border-gray-800">
                          <CardContent className="p-6">
                            <div className="text-2xl font-bold">{value}</div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, " $1")}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card className="border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle>Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {details.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )
              })()}
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
                    <Zap className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">+1 from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasks Processed</CardTitle>
                    <BarChart3 className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,678</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">+12% from last week</p>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <Settings className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98.2%</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">+0.3% from yesterday</p>
                  </CardContent>
                </Card>
              </div>

              {/* Welcome Message */}
              <Card className="border-gray-200 dark:border-gray-800">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bot className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Welcome to AgenticPilot</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    Select an automation from the sidebar to view detailed information and manage its settings.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />}
    </div>
  )
}
