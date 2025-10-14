"use client"

import { useState, Suspense, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Settings, Plus, Edit, Trash2, Clock, Play, Pause, Loader2, Send, Sparkles, RefreshCw, Eye, Inbox, Filter, TrendingUp, Zap, MessageSquare, Bot, AlertCircle, CheckCircle2, Target, Save } from "lucide-react"
import GmailConnection from "@/components/shared/GmailConnection"
import { toast } from "sonner"

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

interface Template {
  id: number
  name: string
  subject: string
  body: string
  preview: string
  isActive: boolean
  responses: number
  type: string
  tone: string
}

interface Email {
  id: string
  from: string
  subject: string
  snippet: string
  body?: string
  date: string
  isUnread: boolean
  labelIds?: string[]
}

interface AutomationSettings {
  enabled: boolean
  confidenceThreshold: number
  defaultTone: string
  autoReply: boolean
  checkInterval: number
  maxEmailsPerRun: number
  filterUnreadOnly: boolean
  workingHoursOnly: boolean
  workingHours: {
    start: number
    end: number
  }
}

export default function GmailAutomation() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isViewEmailsOpen, setIsViewEmailsOpen] = useState(false)
  const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [isRunningAgent, setIsRunningAgent] = useState(false)
  const [isLoadingEmails, setIsLoadingEmails] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isGeneratingReply, setIsGeneratingReply] = useState(false)
  const [selectedTone, setSelectedTone] = useState("professional")
  
  const [templates, setTemplates] = useState<Template[]>([])
  
  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>({
    enabled: false,
    confidenceThreshold: 70,
    defaultTone: "professional",
    autoReply: false,
    checkInterval: 15,
    maxEmailsPerRun: 10,
    filterUnreadOnly: true,
    workingHoursOnly: false,
    workingHours: {
      start: 9,
      end: 18
    }
  })

  const [emails, setEmails] = useState<Email[]>([])
  const [stats, setStats] = useState({
    totalProcessed: 0,
    autoReplies: 0,
    avgResponseTime: "0.0",
    successRate: "0.0"
  })
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [lastStatsUpdate, setLastStatsUpdate] = useState<string>("")

  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: "",
    body: ""
  })

  const [templateForm, setTemplateForm] = useState({
    name: "",
    subject: "",
    body: "",
    type: "inquiry",
    tone: "professional"
  })

  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string
    action: string
    status: string
    details: string
    timestamp: string
    confidence?: number
    emailSubject?: string
  }>>([])
  const [isImprovingTemplate, setIsImprovingTemplate] = useState(false)

  // Fetch stats on mount and set up auto-refresh
  useEffect(() => {
    fetchStats()
    
    // Auto-refresh stats every 30 seconds
    const interval = setInterval(() => {
      fetchStats()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Fetch real-time stats
  const fetchStats = async () => {
    setIsLoadingStats(true)
    try {
      const response = await fetch('/api/gmail/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentActivity(data.recentActivity || [])
        setLastStatsUpdate(data.lastUpdated)
        toast.success('Stats refreshed')
      } else {
        toast.error('Failed to fetch stats')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Error fetching stats')
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Improve template with AI
  const improveTemplateWithAI = async (templateId: number) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return

    setIsImprovingTemplate(true)
    try {
      const response = await fetch('/api/gmail/improve-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateBody: template.body,
          templateType: template.type,
          tone: template.tone
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Update the template with improved version
        setTemplates(templates.map(t => 
          t.id === templateId 
            ? { ...t, body: data.improvedTemplate, preview: data.improvedTemplate.substring(0, 100) + '...' }
            : t
        ))
        toast.success('Template improved with AI! ✨')
      } else {
        toast.error('Failed to improve template')
      }
    } catch (error) {
      console.error('Error improving template:', error)
      toast.error('Error improving template')
    } finally {
      setIsImprovingTemplate(false)
    }
  }

  // Load emails
  const loadEmails = async () => {
    setIsLoadingEmails(true)
    try {
      const response = await fetch('/api/gmail/emails?maxResults=10&q=is:unread')
      if (response.ok) {
        const data = await response.json()
        setEmails(data.messages || [])
        toast.success(`Loaded ${data.messages?.length || 0} emails`)
      } else {
        toast.error('Failed to load emails')
      }
    } catch (error) {
      toast.error('Error loading emails')
    } finally {
      setIsLoadingEmails(false)
    }
  }

  // Send email
  const sendEmail = async () => {
    if (!emailForm.to || !emailForm.subject || !emailForm.body) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSendingEmail(true)
    try {
      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm)
      })

      if (response.ok) {
        toast.success('Email sent successfully!')
        setEmailForm({ to: "", subject: "", body: "" })
        setIsEmailDialogOpen(false)
        
        // Refresh stats after sending
        fetchStats()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to send email')
      }
    } catch (error) {
      toast.error('Error sending email')
    } finally {
      setIsSendingEmail(false)
    }
  }

  // Generate AI reply
  const generateAIReply = async () => {
    if (!emailForm.subject) {
      toast.error('Please enter a subject first')
      return
    }

    setIsGeneratingReply(true)
    try {
      const response = await fetch('/api/gmail/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: emailForm.subject,
          recipient: emailForm.to,
          additionalContext: emailForm.body || undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        setEmailForm(prev => ({ ...prev, body: data.reply }))
        
        if (data.fallback) {
          toast.success('AI reply generated (fallback mode)', {
            description: 'You can edit the message before sending'
          })
        } else {
          toast.success('AI reply generated successfully! ✨', {
            description: 'Powered by Gemini AI. You can edit before sending.'
          })
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to generate AI reply')
      }
    } catch (error) {
      console.error('AI generation error:', error)
      toast.error('Error generating AI reply')
    } finally {
      setIsGeneratingReply(false)
    }
  }

  // Run Gmail agent
  const runAgent = async () => {
    setIsRunningAgent(true)
    try {
      const response = await fetch('/api/gmail/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run',
          settings: {
            autoReply: automationSettings.autoReply,
            maxEmailsPerRun: automationSettings.maxEmailsPerRun,
            onlyUnread: automationSettings.filterUnreadOnly,
            confidenceThreshold: automationSettings.confidenceThreshold / 100
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Automation completed!', {
          description: `Processed: ${data.results?.processed || 0}, Replied: ${data.results?.replied || 0}`
        })
        
        // Refresh recent activity
        if (data.results?.replied > 0) {
          // Refresh stats and activity after automation run
          fetchStats()
        }
      } else {
        toast.error('Failed to run automation')
      }
    } catch (error) {
      toast.error('Error running automation')
    } finally {
      setIsRunningAgent(false)
    }
  }

  // Save template
  const saveTemplate = () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.body) {
      toast.error('Please fill in all fields')
      return
    }

    const newTemplate: Template = {
      id: templates.length + 1,
      name: templateForm.name,
      subject: templateForm.subject,
      body: templateForm.body,
      preview: templateForm.body.substring(0, 100) + '...',
      isActive: true,
      responses: 0,
      type: templateForm.type,
      tone: templateForm.tone
    }

    setTemplates(prev => [...prev, newTemplate])
    setTemplateForm({ name: "", subject: "", body: "", type: "inquiry", tone: "professional" })
    setIsNewTemplateOpen(false)
    toast.success('Template saved successfully!')
  }

  // Update template
  const updateTemplate = () => {
    if (!selectedTemplate) return

    setTemplates(prev => prev.map(t => 
      t.id === selectedTemplate.id 
        ? { ...t, ...templateForm, preview: templateForm.body.substring(0, 100) + '...' }
        : t
    ))
    setIsEditTemplateOpen(false)
    setSelectedTemplate(null)
    toast.success('Template updated successfully!')
  }

  // Delete template
  const deleteTemplate = (id: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== id))
      toast.success('Template deleted')
    }
  }

  // Toggle template active state
  const toggleTemplate = (id: number) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ))
  }

  // Open edit dialog
  const openEditDialog = (template: Template) => {
    setSelectedTemplate(template)
    setTemplateForm({
      name: template.name,
      subject: template.subject,
      body: template.body,
      type: template.type,
      tone: template.tone
    })
    setIsEditTemplateOpen(true)
  }

  // Open reply dialog for an email
  const openReplyDialog = (email: Email) => {
    setSelectedEmail(email)
    setEmailForm({
      to: email.from,
      subject: email.subject.startsWith('Re: ') ? email.subject : `Re: ${email.subject}`,
      body: ""
    })
    setIsReplyDialogOpen(true)
  }

  // Generate AI reply with tone
  const generateAIReplyWithTone = async (tone: string) => {
    if (!emailForm.subject) {
      toast.error('Please enter a subject first')
      return
    }

    setIsGeneratingReply(true)
    try {
      const response = await fetch('/api/gmail/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: emailForm.subject,
          recipient: emailForm.to,
          tone: tone,
          additionalContext: selectedEmail?.body || emailForm.body || undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        setEmailForm(prev => ({ ...prev, body: data.reply }))
        
        if (data.fallback) {
          toast.success(`AI reply generated (fallback mode)`)
        } else {
          toast.success(`AI reply generated in ${tone} tone! ✨`)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to generate AI reply')
      }
    } catch (error) {
      console.error('AI generation error:', error)
      toast.error('Error generating AI reply')
    } finally {
      setIsGeneratingReply(false)
    }
  }

  const statsArray = [
    { label: "Emails Processed", value: stats.totalProcessed.toLocaleString(), icon: Inbox, color: "text-blue-500" },
    { label: "Auto-Replies Sent", value: stats.autoReplies.toLocaleString(), icon: Bot, color: "text-green-500" },
    { label: "Avg Response Time", value: `${stats.avgResponseTime} sec`, icon: Clock, color: "text-purple-500" },
    { label: "Success Rate", value: `${stats.successRate}%`, icon: TrendingUp, color: "text-emerald-500" },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-x-hidden">

      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AI Email Assistant</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Intelligent email automation for businesses
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge
            variant={automationSettings.enabled ? "default" : "secondary"}
            className={
              automationSettings.enabled
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center gap-1"
                : "bg-gray-500/20 text-gray-400 border-gray-500/30 flex items-center gap-1"
            }
          >
            <Zap className="h-3 w-3" />
            {automationSettings.enabled ? "Active" : "Inactive"}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" onClick={runAgent} disabled={isRunningAgent}>
            {isRunningAgent ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Now
              </>
            )}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsViewEmailsOpen(true)}>
            <Inbox className="w-4 h-4 mr-2" />
            Inbox
          </Button>
          <Button size="sm" onClick={() => setIsNewTemplateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Template
          </Button>
        </div>
      </div>

      {/* Gmail Connection Component */}
      <Suspense fallback={<GmailConnectionFallback />}>
        <GmailConnection />
      </Suspense>

      {/* Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Real-Time Stats</h2>
            {lastStatsUpdate && (
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(lastStatsUpdate).toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={isLoadingStats}
          >
            {isLoadingStats ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsArray.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="card-elevated hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-xl sm:text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${stat.color.replace('text-', '')}/10 to-${stat.color.replace('text-', '')}/20 flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick Automation Info */}
      {automationSettings.enabled && (
        <Card className="border-l-4 border-l-emerald-500 bg-emerald-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="font-semibold text-sm">Automation Active</p>
                  <p className="text-xs text-muted-foreground">
                    Monitoring inbox • Confidence threshold: {(automationSettings.confidenceThreshold * 100).toFixed(0)}% • Tone: {automationSettings.defaultTone}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setAutomationSettings(prev => ({ ...prev, enabled: false }))}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                  <Badge 
                    variant={template.isActive ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleTemplate(template.id)}
                  >
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {template.tone && (
                    <Badge variant="outline" className="text-xs">
                      {template.tone.charAt(0).toUpperCase() + template.tone.slice(1)}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => improveTemplateWithAI(template.id)}
                    disabled={isImprovingTemplate}
                  >
                    {isImprovingTemplate ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1" />
                    )}
                    Improve with AI
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 hover:bg-muted rounded-lg"
                    onClick={() => openEditDialog(template)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                    onClick={() => deleteTemplate(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Subject: {template.subject}</p>
              <p className="text-sm text-muted-foreground mb-3">{template.preview}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{template.responses} responses sent</span>
                <span>Type: {template.type}</span>
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
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={activity.id || index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activity.emailSubject || activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Action: {activity.action} | Status: {activity.status}
                      {activity.confidence && ` | Confidence: ${(activity.confidence * 100).toFixed(0)}%`}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recent activity yet</p>
              <p className="text-xs">Run automation to see activity</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Compose and send an email to your connected Gmail account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="email"
                placeholder="recipient@example.com"
                value={emailForm.to}
                onChange={(e) => setEmailForm(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                placeholder="Type your message here..."
                className="min-h-[200px]"
                value={emailForm.body}
                onChange={(e) => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>AI Tone Selection</Label>
              <div className="grid grid-cols-3 gap-2">
                {['professional', 'friendly', 'empathetic', 'enthusiastic', 'calm', 'formal'].map((tone) => (
                  <Button
                    key={tone}
                    type="button"
                    variant={selectedTone === tone ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTone(tone)}
                    disabled={isGeneratingReply}
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => generateAIReplyWithTone(selectedTone)}
              disabled={isGeneratingReply}
              className="w-full"
            >
              {isGeneratingReply ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating {selectedTone} reply...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Reply ({selectedTone})
                </>
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendEmail} disabled={isSendingEmail}>
              {isSendingEmail ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Template Dialog */}
      <Dialog open={isNewTemplateOpen} onOpenChange={setIsNewTemplateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create an email template for automated responses
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="e.g., Customer Support Reply"
                value={templateForm.name}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template-type">Template Type</Label>
              <select
                id="template-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={templateForm.type}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="inquiry">Inquiry</option>
                <option value="review">Review</option>
                <option value="support">Support</option>
                <option value="complaint">Complaint</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template-subject">Subject</Label>
              <Input
                id="template-subject"
                placeholder="Email subject"
                value={templateForm.subject}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template-body">Template Body</Label>
              <Textarea
                id="template-body"
                placeholder="Use {business_name}, {sender_name}, {subject} as variables"
                className="min-h-[200px]"
                value={templateForm.body}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, body: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Available variables: {"{business_name}"}, {"{sender_name}"}, {"{subject}"}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template-tone">Default Tone</Label>
              <select
                id="template-tone"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={templateForm.tone}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, tone: e.target.value }))}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="empathetic">Empathetic</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="calm">Calm</option>
                <option value="formal">Formal</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTemplateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditTemplateOpen} onOpenChange={setIsEditTemplateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update your email template
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-template-name">Template Name</Label>
              <Input
                id="edit-template-name"
                value={templateForm.name}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-template-type">Template Type</Label>
              <select
                id="edit-template-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={templateForm.type}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="inquiry">Inquiry</option>
                <option value="review">Review</option>
                <option value="support">Support</option>
                <option value="complaint">Complaint</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-template-subject">Subject</Label>
              <Input
                id="edit-template-subject"
                value={templateForm.subject}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-template-body">Template Body</Label>
              <Textarea
                id="edit-template-body"
                className="min-h-[200px]"
                value={templateForm.body}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, body: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-template-tone">Default Tone</Label>
              <select
                id="edit-template-tone"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={templateForm.tone}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, tone: e.target.value }))}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="empathetic">Empathetic</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="calm">Calm</option>
                <option value="formal">Formal</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTemplateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateTemplate}>
              <Edit className="h-4 w-4 mr-2" />
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Emails Dialog */}
      <Dialog open={isViewEmailsOpen} onOpenChange={setIsViewEmailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Inbox Emails</DialogTitle>
            <DialogDescription>
              View unread emails from your connected Gmail account
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Button onClick={loadEmails} disabled={isLoadingEmails} className="w-full mb-4">
              {isLoadingEmails ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading Emails...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Load Emails
                </>
              )}
            </Button>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {emails.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No emails loaded yet. Click "Load Emails" to fetch.</p>
                </div>
              ) : (
                emails.map((email) => (
                  <div
                    key={email.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{email.subject || '(No Subject)'}</p>
                        <p className="text-xs text-muted-foreground mt-1">{email.from}</p>
                      </div>
                      {email.isUnread && (
                        <Badge variant="default" className="text-xs">Unread</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{email.snippet}</p>
                    <p className="text-xs text-muted-foreground mt-2">{email.date}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewEmailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Automation Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Automation Settings
            </DialogTitle>
            <DialogDescription>
              Configure AI-powered email automation with confidence thresholds and tone preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Enable Automation */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Automation</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically process and respond to incoming emails
                </p>
              </div>
              <Switch
                checked={automationSettings.enabled}
                onCheckedChange={(checked) => 
                  setAutomationSettings(prev => ({ ...prev, enabled: checked }))
                }
              />
            </div>

            {/* Confidence Threshold */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-base">Confidence Threshold</Label>
                <Badge variant="secondary">{automationSettings.confidenceThreshold}%</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Only send automatic replies when AI confidence exceeds this level
              </p>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={automationSettings.confidenceThreshold}
                  onChange={(e) => 
                    setAutomationSettings(prev => ({ 
                      ...prev, 
                      confidenceThreshold: parseInt(e.target.value) 
                    }))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative (0%)</span>
                  <span>Balanced (50%)</span>
                  <span>Aggressive (100%)</span>
                </div>
              </div>
            </div>

            {/* Default Tone */}
            <div className="space-y-3 p-4 border rounded-lg">
              <Label className="text-base">Default Tone</Label>
              <p className="text-sm text-muted-foreground">
                Choose the default tone for AI-generated replies
              </p>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={automationSettings.defaultTone}
                onChange={(e) => 
                  setAutomationSettings(prev => ({ ...prev, defaultTone: e.target.value }))
                }
              >
                <option value="professional">Professional - Clear and business-like</option>
                <option value="friendly">Friendly - Warm and approachable</option>
                <option value="empathetic">Empathetic - Understanding and caring</option>
                <option value="enthusiastic">Enthusiastic - Energetic and positive</option>
                <option value="calm">Calm - Measured and reassuring</option>
                <option value="formal">Formal - Strictly professional</option>
              </select>
            </div>

            {/* Auto Reply */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-Reply</Label>
                <p className="text-sm text-muted-foreground">
                  Send replies automatically without manual approval
                </p>
              </div>
              <Switch
                checked={automationSettings.autoReply}
                onCheckedChange={(checked) => 
                  setAutomationSettings(prev => ({ ...prev, autoReply: checked }))
                }
              />
            </div>

            {/* Check Interval */}
            <div className="space-y-3 p-4 border rounded-lg">
              <Label className="text-base">Check Interval (minutes)</Label>
              <p className="text-sm text-muted-foreground">
                How often to check for new emails
              </p>
              <Input
                type="number"
                min="5"
                max="120"
                value={automationSettings.checkInterval}
                onChange={(e) => 
                  setAutomationSettings(prev => ({ 
                    ...prev, 
                    checkInterval: parseInt(e.target.value) || 15 
                  }))
                }
              />
            </div>

            {/* Working Hours */}
            <div className="space-y-3 p-4 border rounded-lg">
              <Label className="text-base">Working Hours</Label>
              <p className="text-sm text-muted-foreground">
                Only send automated replies during these hours (24-hour format)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-hour" className="text-sm">Start Hour</Label>
                  <Input
                    id="start-hour"
                    type="number"
                    min="0"
                    max="23"
                    value={automationSettings.workingHours.start}
                    onChange={(e) => 
                      setAutomationSettings(prev => ({ 
                        ...prev, 
                        workingHours: { 
                          ...prev.workingHours, 
                          start: parseInt(e.target.value) || 0 
                        }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-hour" className="text-sm">End Hour</Label>
                  <Input
                    id="end-hour"
                    type="number"
                    min="0"
                    max="23"
                    value={automationSettings.workingHours.end}
                    onChange={(e) => 
                      setAutomationSettings(prev => ({ 
                        ...prev, 
                        workingHours: { 
                          ...prev.workingHours, 
                          end: parseInt(e.target.value) || 0 
                        }
                      }))
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Current: {automationSettings.workingHours.start}:00 - {automationSettings.workingHours.end}:00
              </p>
            </div>

            {/* Max Emails Per Run */}
            <div className="space-y-3 p-4 border rounded-lg">
              <Label className="text-base">Max Emails Per Run</Label>
              <p className="text-sm text-muted-foreground">
                Maximum number of emails to process in each automation cycle
              </p>
              <Input
                type="number"
                min="1"
                max="50"
                value={automationSettings.maxEmailsPerRun}
                onChange={(e) => 
                  setAutomationSettings(prev => ({ 
                    ...prev, 
                    maxEmailsPerRun: parseInt(e.target.value) || 10 
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              toast.success("Settings saved successfully!")
              setIsSettingsOpen(false)
            }}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
