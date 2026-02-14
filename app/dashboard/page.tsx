"use client"

// React hooks
import { useState, useEffect } from "react"
// Custom components
import { StatsCard, ActionCard } from "@/components/shared/Cards"
import { AutomationController } from "@/components/shared/AutomationController"
// shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Icons from Lucide React
import { Mail, Package, Instagram, BarChart3, Zap, Plus, Settings, Bell, TrendingUp, Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
// Auth and profile hooks
import { useAuth } from "@/utils/auth/AuthProvider"
import { useUserProfile } from "@/utils/hooks/useUserProfile"

interface GmailStats {
  totalProcessed: number
  autoReplies: number
  avgResponseTime: string
  successRate: string
}

interface Activity {
  id: string
  action: string
  status: string
  details: string
  timestamp: string
  emailSubject?: string
}

/**
 * Dashboard Component
 * 
 * Main dashboard page that provides:
 * - Quick stats overview cards from real database
 * - Active automation management
 * - Recent activity feed from gmail_logs
 * - Navigation shortcuts to automation pages
 * - Performance metrics and monitoring
 */
export default function Dashboard() {
  const { user } = useAuth()
  const { profile, loading } = useUserProfile()

  // Real stats from API
  const [stats, setStats] = useState<GmailStats>({
    totalProcessed: 0,
    autoReplies: 0,
    avgResponseTime: "0.0",
    successRate: "100.0"
  })
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Fetch real stats on mount
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoadingStats(true)
    try {
      const response = await fetch('/api/gmail/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentActivity(data.recentActivity || [])
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Automation tasks - derived from real connection status
  const [automationTasks, setAutomationTasks] = useState([
    {
      id: "gmail-1",
      name: "Gmail AI Assistant",
      description: "AI-powered email responses with Gemini",
      status: "stopped" as "running" | "paused" | "stopped" | "error" | "completed",
      progress: 0,
      lastRun: "Not run yet",
      nextRun: "Manual trigger",
      executionTime: `${stats.avgResponseTime}s avg`,
      tasksProcessed: stats.totalProcessed,
      successRate: parseFloat(stats.successRate) || 0
    },
    {
      id: "inventory-1",
      name: "Inventory Monitor",
      description: "Track stock levels and receive alerts",
      status: "stopped" as "running" | "paused" | "stopped" | "error" | "completed",
      progress: 0,
      lastRun: "Not configured",
      nextRun: "Setup required",
      executionTime: "N/A",
      tasksProcessed: 0,
      successRate: 0
    },
    {
      id: "instagram-1",
      name: "Social Media Scheduler",
      description: "Schedule posts with AI-generated captions",
      status: "stopped" as "running" | "paused" | "stopped" | "error" | "completed",
      progress: 0,
      lastRun: "Not configured",
      nextRun: "Setup required",
      executionTime: "N/A",
      tasksProcessed: 0,
      successRate: 0
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
      title: "Emails Processed",
      value: stats.totalProcessed.toLocaleString(),
      change: `${stats.autoReplies} auto-replies sent`,
      changeType: "positive" as const,
      icon: Mail,
      trend: Math.min(stats.totalProcessed, 100)
    },
    {
      title: "Auto Replies",
      value: stats.autoReplies.toLocaleString(),
      change: "AI-powered responses",
      changeType: "positive" as const,
      icon: Zap,
      trend: Math.min(stats.autoReplies * 10, 100)
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      change: "Based on all actions",
      changeType: parseFloat(stats.successRate) >= 90 ? "positive" as const : "neutral" as const,
      icon: TrendingUp,
      trend: parseFloat(stats.successRate) || 0
    },
    {
      title: "Avg Response Time",
      value: `${stats.avgResponseTime}s`,
      change: "Per email processed",
      changeType: "positive" as const,
      icon: Clock,
      trend: 100 - Math.min(parseFloat(stats.avgResponseTime) * 10, 100)
    }
  ]


  const quickActions = [
    {
      title: "Create New Automation",
      description: "Set up a new AI automation workflow",
      icon: Plus,
      buttonText: "Create",
      onAction: () => toast.info("Navigate to an agent page (Gmail, Inventory, or Instagram) to configure new automations.")
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
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              <span className="text-xs text-muted-foreground">
                {profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)} Plan Active
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => toast.info("Navigate to an agent page (Gmail, Inventory, or Instagram) to configure new automations.")}>
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
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Performance Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.totalProcessed.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Total Tasks Processed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.successRate}%</div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.avgResponseTime}s</div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="font-medium text-muted-foreground">Detailed Charts Coming Soon</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Visual analytics and trend graphs will be available in an upcoming update.</p>
                </div>
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
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchStats} disabled={isLoadingStats}>
              {isLoadingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoadingStats ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-muted-foreground">Loading activity...</span>
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.status === "success" ? "bg-emerald-500" :
                      activity.status === "failed" ? "bg-red-500" :
                        "bg-primary"
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.emailSubject || activity.details || activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action} • {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="font-medium">No recent activity</p>
                <p className="text-sm">Run Gmail automation to see activity here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
