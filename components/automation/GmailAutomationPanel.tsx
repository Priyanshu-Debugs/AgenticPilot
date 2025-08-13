"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Settings, Plus, Edit, Trash2, Power, Clock } from "lucide-react"

export default function GmailAutomationPanel() {
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
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Gmail Automation</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm text-muted-foreground">Automation Status:</span>
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
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="bg-card border-border shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Email Templates */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-semibold">Email Templates</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Manage your automated email response templates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <h3 className="text-sm sm:text-base font-semibold">{template.name}</h3>
                  <Badge variant={template.isActive ? "default" : "secondary"} className="text-xs">
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-muted rounded-lg">
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Subject: {template.subject}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">{template.preview}</p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-muted-foreground gap-1">
                <span>{template.responses} responses sent</span>
                <span>Last used: 2 hours ago</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-semibold">Recent Auto-Replies</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Latest automated email responses sent by the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          {[
            { email: "customer@example.com", template: "Customer Support", time: "2 minutes ago" },
            { email: "john.doe@email.com", template: "Order Confirmation", time: "15 minutes ago" },
            { email: "support@client.com", template: "Customer Support", time: "32 minutes ago" },
            { email: "orders@business.com", template: "Refund Request", time: "1 hour ago" },
          ].map((reply, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/50 rounded-lg gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">{reply.email}</p>
                  <p className="text-xs text-muted-foreground">Template: {reply.template}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{reply.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
