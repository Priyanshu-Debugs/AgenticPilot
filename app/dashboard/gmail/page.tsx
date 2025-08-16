"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Settings, Plus, Edit, Trash2, Power, Clock, Play, Pause, Loader2 } from "lucide-react"
import GmailConnection from "@/components/shared/GmailConnection"

// Loading component for Suspense fallback
function GmailConnectionFallback() {
  return (
    <Card className="min-h-[280px]">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-blue-600" />
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              Gmail Connection
              <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
            </CardTitle>
            <CardDescription>
              <div className="h-4 w-80 bg-muted animate-pulse rounded mt-1"></div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading Gmail connection...</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GmailAutomation() {
  const [isEnabled, setIsEnabled] = useState(true)

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
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-x-hidden">

      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gmail Automation</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              AI-powered email automation and response management
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Badge
            variant={isEnabled ? "default" : "secondary"}
            className={
              isEnabled
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
            }
          >
            {isEnabled ? "Active" : "Paused"}
          </Badge>
          <Button
            onClick={() => setIsEnabled(!isEnabled)}
            variant={isEnabled ? "destructive" : "default"}
            size="sm"
          >
            {isEnabled ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Gmail Connection Component */}
      <Suspense fallback={<GmailConnectionFallback />}>
        <GmailConnection />
      </Suspense>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="card-elevated">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
                  </div>
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Email Templates */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Email Templates</CardTitle>
          <CardDescription>Manage your automated email response templates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
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
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Subject: {template.subject}</p>
              <p className="text-sm text-muted-foreground mb-3">{template.preview}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{template.responses} responses sent</span>
                <span>Last used: 2 hours ago</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="card-elevated">
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
                <Mail className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{reply.email}</p>
                  <p className="text-xs text-muted-foreground">Template: {reply.template}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{reply.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
