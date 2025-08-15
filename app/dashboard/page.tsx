"use client"

// React hooks
import { useState } from "react"
// Custom components
import { StatsCard, ActionCard } from "@/components/shared/Cards"
import { AutomationController } from "@/components/shared/AutomationController"
// shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Icons from Lucide React
import { Mail, Package, Instagram, BarChart3, Zap, Plus, Settings, Bell, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
// Auth and profile hooks
import { useAuth } from "@/utils/auth/AuthProvider"
import { useUserProfile } from "@/utils/hooks/useUserProfile"

/**
 * Dashboard Component
 * 
 * Main dashboard page that provides:
 * - Quick stats overview cards
 * - Active automation management
 * - Recent activity feed
 * - Navigation shortcuts to automation pages
 * - Performance metrics and monitoring
 * 
 * Features:
 * - Real-time automation status display
 * - Progress tracking for running tasks
 * - Success rate and performance metrics
 * - Responsive layout with mobile optimization
 * - Quick access to all automation modules
 */
export default function Dashboard() {
  const { user } = useAuth()
  const { profile, loading } = useUserProfile()


  // Mock automation task data with type safety
  const [automationTasks, setAutomationTasks] = useState([
    {
      id: "gmail-1",
      name: "Customer Support Emails",
      description: "Automatically respond to customer inquiries in Gmail",
      status: "running" as "running" | "paused" | "stopped" | "error" | "completed",
      progress: 85,
      lastRun: "2 hours ago",
      nextRun: "In 10 minutes",
      executionTime: "1.2s avg",
      tasksProcessed: 247,
      successRate: 96
    },
    {
      id: "inventory-1", 
      name: "Stock Level Monitor",
      description: "Monitor inventory levels and send alerts for low stock",
      status: "paused" as "running" | "paused" | "stopped" | "error" | "completed",
      progress: 45,
      lastRun: "1 day ago",
      nextRun: "Manual trigger",
      executionTime: "0.8s avg",
      tasksProcessed: 1891,
      successRate: 99
    },
    {
      id: "instagram-1",
      name: "Social Media Scheduler",
      description: "Schedule and post content to Instagram automatically",
      status: "completed" as "running" | "paused" | "stopped" | "error" | "completed",
      progress: 100,
      lastRun: "30 minutes ago",
      nextRun: "Tomorrow 9 AM",
      executionTime: "2.1s avg",
      tasksProcessed: 89,
      successRate: 94
    }
  ])

  const handleStartTask = (taskId: string) => {
    setAutomationTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: "running" as "running" | "paused" | "stopped" | "error" | "completed" } : task
      )
    )
  }

  const handlePauseTask = (taskId: string) => {
    setAutomationTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: "paused" as "running" | "paused" | "stopped" | "error" | "completed" } : task
      )
    )
  }

  const handleStopTask = (taskId: string) => {
    setAutomationTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: "stopped" as "running" | "paused" | "stopped" | "error" | "completed", progress: 0 } : task
      )
    )
  }

  const handleConfigureTask = (taskId: string) => {
    // Navigate to specific task configuration
    const task = automationTasks.find(t => t.id === taskId)
    if (task?.id.includes('gmail')) {
      window.location.href = '/dashboard/gmail'
    } else if (task?.id.includes('inventory')) {
      window.location.href = '/dashboard/inventory'
    } else if (task?.id.includes('instagram')) {
      window.location.href = '/dashboard/instagram'
    }
  }

  const statsData = [
    {
      title: "Active Automations",
      value: automationTasks.filter(t => t.status === "running").length,
      change: "+1 from last month",
      changeType: "positive" as const,
      icon: Zap,
      trend: 75
    },
    {
      title: "Tasks Processed",
      value: "2,247",
      change: "+12% from yesterday", 
      changeType: "positive" as const,
      icon: BarChart3,
      trend: 88
    },
    {
      title: "Efficiency Score",
      value: "98.5%",
      change: "+2% from last week",
      changeType: "positive" as const,
      icon: TrendingUp,
      trend: 98
    },
    {
      title: "Response Time",
      value: "1.2s",
      change: "-0.3s improvement",
      changeType: "positive" as const,
      icon: Clock,
      trend: 92
    }
  ]

  const quickActions = [
    {
      title: "Create New Automation",
      description: "Set up a new AI automation workflow",
      icon: Plus,
      buttonText: "Create",
      onAction: () => window.location.href = "/dashboard"
    },
    {
      title: "System Settings",
      description: "Configure global automation settings",
      icon: Settings,
      buttonText: "Configure",
      onAction: () => window.location.href = "/settings"
    },
    {
      title: "Notifications",
      description: "Manage alerts and notification preferences",
      icon: Bell,
      buttonText: "Manage",
      onAction: () => window.location.href = "/notifications"
    }
  ]

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-x-hidden">
      {/* Dashboard Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitor and control your AI automation workflows
          </p>
          {profile && (
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-muted-foreground">
                {profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)} Plan Active
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Automation
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statsData.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="automations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="automations" className="space-y-6">
          <AutomationController
            tasks={automationTasks}
            onStartTask={handleStartTask}
            onPauseTask={handlePauseTask}
            onStopTask={handleStopTask}
            onConfigureTask={handleConfigureTask}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Performance Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">2,247</div>
                    <p className="text-sm text-muted-foreground">Total Tasks Processed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">96.8%</div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">1.2s</div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analytics dashboard would show detailed charts and graphs here.
                  Integration with charts library like Recharts would provide visual insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              title="Gmail Integration"
              description="Connect and manage Gmail automation"
              icon={Mail}
              buttonText="Configure"
              onAction={() => window.location.href = "/dashboard/gmail"}
            />
            <ActionCard
              title="Inventory System"
              description="Manage inventory automation workflows"
              icon={Package}
              buttonText="Setup"
              onAction={() => window.location.href = "/dashboard/inventory"}
            />
            <ActionCard
              title="Instagram Integration"
              description="Automate social media posting"
              icon={Instagram}
              buttonText="Connect"
              onAction={() => window.location.href = "/dashboard/instagram"}
            />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map((action) => (
              <ActionCard
                key={action.title}
                title={action.title}
                description={action.description}
                icon={action.icon}
                buttonText={action.buttonText}
                onAction={action.onAction}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Gmail automation processed 45 emails",
                time: "2 minutes ago",
                status: "success"
              },
              {
                action: "Inventory check completed - 3 items need restock",
                time: "15 minutes ago", 
                status: "warning"
              },
              {
                action: "Instagram post scheduled successfully",
                time: "1 hour ago",
                status: "success"
              },
              {
                action: "New automation workflow created",
                time: "3 hours ago",
                status: "info"
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === "success" ? "bg-green-500" :
                  activity.status === "warning" ? "bg-yellow-500" :
                  "bg-gray-500"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
