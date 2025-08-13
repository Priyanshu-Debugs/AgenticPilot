"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Package, Instagram, BarChart3, Zap } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const automations = [
    {
      id: "gmail",
      title: "Gmail Auto Reply",
      icon: Mail,
      status: "Active",
    },
    {
      id: "inventory",
      title: "Inventory Management",
      icon: Package,
      status: "Active",
    },
    {
      id: "instagram",
      title: "Instagram Automation",
      icon: Instagram,
      status: "Soon",
    },
  ]

  return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <BarChart3 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+2% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Automation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {automations.map((automation) => {
          const IconComponent = automation.icon
          const href = `/dashboard/${automation.id}`

          return (
            <Link key={automation.id} href={href}>
              <Card className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/10 dark:bg-white/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg">{automation.title}</CardTitle>
                      </div>
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
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {automation.id === "gmail" && "Automatically reply to customer emails with personalized responses"}
                    {automation.id === "inventory" && "Track stock levels and automate reordering processes"}
                    {automation.id === "instagram" && "Schedule posts and manage your Instagram presence automatically"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </>
  )
}
