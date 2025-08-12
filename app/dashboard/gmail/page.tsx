"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Package, Instagram, Bot, Menu, X, Settings, Plus, Edit, Trash2, Power, Clock, Bell } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function GmailAutomation() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  const templates = [
    {
      id: 1,
      name: "Customer Support",
      subject: "Thank you for contacting us",
      preview:
        "Thank you for reaching out. We have received your inquiry and will respond within 24 hours...",
      isActive: true,
      responses: 1247,
    },
    {
      id: 2,
      name: "Order Confirmation",
      subject: "Order Received - #{order_number}",
      preview:
        "We have successfully received your order. You will receive a tracking number once...",
      isActive: true,
      responses: 892,
    },
    {
      id: 3,
      name: "Refund Request",
      subject: "Refund Request Received",
      preview: "We are processing your refund request. Please allow 5-7 business days...",
      isActive: false,
      responses: 156,
    },
  ]

  const stats = [
    { label: "Total Responses Sent", value: "2,847", icon: Mail },
    { label: "Average Response Time", value: "2.3 sec", icon: Clock },
    { label: "Customer Satisfaction", value: "94.5%", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex">
      {/* Sidebar - Same as dashboard */}
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

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Automations
              </h3>

              {automations.map((automation) => {
                const IconComponent = automation.icon
                const isActive = automation.id === "gmail" // Gmail is the active page

                return (
                  <div key={automation.id} className="space-y-2">
                    {automation.id === "gmail" ? (
                      <div className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all bg-black/5 dark:bg-white/5`}>
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
                    ) : (
                      <Link href={automation.id === "inventory" ? "/dashboard/inventory" : automation.id === "instagram" ? "/dashboard/instagram" : "/dashboard"}>
                        <div className="flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5">
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
                      </Link>
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
        {/* Top Navigation - Same as dashboard */}
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
                <h1 className="text-xl font-semibold">Gmail Automation</h1>
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

        {/* Gmail Content */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Gmail Automation</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Automation Status:</span>
                <button
                  onClick={() => setIsEnabled(!isEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isEnabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <Power className={`w-4 h-4 ${isEnabled ? "text-green-500" : "text-muted-foreground"}`} />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Email Templates */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Email Templates</CardTitle>
              <CardDescription>Manage your automated email response templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant={template.isActive ? "default" : "secondary"}>
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="p-2 hover:bg-muted rounded-lg">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Subject: {template.subject}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{template.preview}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{template.responses} responses sent</span>
                    <span>Last used: 2 hours ago</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Auto-Replies</CardTitle>
              <CardDescription>Latest automated email responses sent by the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { email: "customer@example.com", template: "Customer Support", time: "2 minutes ago" },
                { email: "john.doe@email.com", template: "Order Confirmation", time: "15 minutes ago" },
                { email: "support@client.com", template: "Customer Support", time: "32 minutes ago" },
                { email: "orders@business.com", template: "Refund Request", time: "1 hour ago" },
              ].map((reply, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{reply.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Template: {reply.template}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{reply.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />}
    </div>
  )
}
