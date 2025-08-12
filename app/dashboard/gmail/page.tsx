"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Bot, ArrowLeft, Play, Pause, Settings, Clock, CheckCircle, Users, MessageSquare } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function GmailAutomation() {
  const [isAutomationActive, setIsAutomationActive] = useState(true)
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true)
  const [responseDelay, setResponseDelay] = useState("5")

  const recentEmails = [
    {
      id: 1,
      from: "customer@example.com",
      subject: "Product inquiry",
      status: "replied",
      time: "2 minutes ago",
      response: "Thank you for your interest in our products...",
    },
    {
      id: 2,
      from: "support@client.com",
      subject: "Technical support request",
      status: "replied",
      time: "15 minutes ago",
      response: "I understand you're experiencing technical difficulties...",
    },
    {
      id: 3,
      from: "info@business.com",
      subject: "Partnership opportunity",
      status: "pending",
      time: "1 hour ago",
      response: "",
    },
    {
      id: 4,
      from: "hello@startup.com",
      subject: "Collaboration request",
      status: "replied",
      time: "2 hours ago",
      response: "Thank you for reaching out about collaboration...",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-500" />
              <Link href="/" className="text-xl font-bold">
                AgenticPilot
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Gmail Auto Reply</h1>
              <p className="text-muted-foreground">AI-powered automatic email responses</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge
              variant={isAutomationActive ? "default" : "secondary"}
              className={isAutomationActive ? "bg-green-600/20 text-green-400 border-green-600/30" : ""}
            >
              {isAutomationActive ? "Active" : "Paused"}
            </Badge>
            <Button
              onClick={() => setIsAutomationActive(!isAutomationActive)}
              className={isAutomationActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isAutomationActive ? (
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
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails Processed</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+89 today</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">+0.2% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2m</div>
              <p className="text-xs text-muted-foreground">-0.5m from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">+5 from this morning</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle>Recent Email Activity</CardTitle>
                  <CardDescription>Latest automated responses and pending emails</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentEmails.map((email) => (
                    <div key={email.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex-shrink-0">
                        {email.status === "replied" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{email.from}</p>
                          <p className="text-xs text-muted-foreground">{email.time}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{email.subject}</p>
                        {email.response && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">{email.response}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Settings */}
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle>Quick Settings</CardTitle>
                  <CardDescription>Adjust automation behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto Reply</Label>
                      <div className="text-sm text-muted-foreground">Automatically respond to incoming emails</div>
                    </div>
                    <Switch checked={autoReplyEnabled} onCheckedChange={setAutoReplyEnabled} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delay">Response Delay (minutes)</Label>
                    <Input
                      id="delay"
                      type="number"
                      value={responseDelay}
                      onChange={(e) => setResponseDelay(e.target.value)}
                      className="bg-background border-input"
                    />
                    <p className="text-xs text-muted-foreground">Minimum delay before sending automated responses</p>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Gmail Integration Settings</CardTitle>
                <CardDescription>Configure your Gmail connection and automation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gmail-account">Connected Gmail Account</Label>
                    <Input id="gmail-account" value="your.email@gmail.com" disabled className="bg-muted border-input" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signature">Email Signature</Label>
                    <Textarea
                      id="signature"
                      placeholder="Best regards,&#10;Your Name&#10;Company Name"
                      className="bg-background border-input"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Smart Categorization</Label>
                      <div className="text-sm text-muted-foreground">Automatically categorize emails by type</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Priority Detection</Label>
                      <div className="text-sm text-muted-foreground">Identify urgent emails for manual review</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Response Templates</CardTitle>
                <CardDescription>Manage AI response templates for different email types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="general-template">General Inquiry Template</Label>
                    <Textarea
                      id="general-template"
                      placeholder="Thank you for your email. I'll get back to you within 24 hours..."
                      className="bg-background border-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support-template">Support Request Template</Label>
                    <Textarea
                      id="support-template"
                      placeholder="Thank you for contacting our support team. We've received your request..."
                      className="bg-background border-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sales-template">Sales Inquiry Template</Label>
                    <Textarea
                      id="sales-template"
                      placeholder="Thank you for your interest in our products. I'd be happy to help..."
                      className="bg-background border-input"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">Save Templates</Button>
                  <Button variant="outline" className="border-border bg-transparent">
                    Reset to Default
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Email automation performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Response Accuracy</span>
                      <span className="text-sm font-medium">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                      <span className="text-sm font-medium">4.7/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Time Saved (hours)</span>
                      <span className="text-sm font-medium">127.3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle>Email Categories</CardTitle>
                  <CardDescription>Distribution of email types processed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">General Inquiries</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Support Requests</span>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sales Inquiries</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
