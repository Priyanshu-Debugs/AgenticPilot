"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Zap, 
  Database, 
  Mail, 
  Instagram, 
  Package,
  Save,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

interface SettingsProps {
  onSave?: (settings: any) => void
  onReset?: () => void
  onExport?: () => void
  onImport?: (data: any) => void
}

export function SettingsPage({ 
  onSave = () => {}, 
  onReset = () => {}, 
  onExport = () => {}, 
  onImport = () => {} 
}: SettingsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    // Profile Settings
    profile: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      company: "AgenticPilot Inc.",
      timezone: "America/New_York",
      language: "en"
    },
    // Notification Settings
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      taskCompletion: true,
      lowStock: true,
      systemUpdates: true,
      weeklyReport: true
    },
    // Automation Settings
    automation: {
      gmailEnabled: true,
      gmailCheckInterval: "5",
      instagramEnabled: true,
      instagramPostTime: "09:00",
      inventoryEnabled: true,
      inventoryThreshold: "10",
      autoReorder: false
    },
    // Security Settings
    security: {
      twoFactorEnabled: false,
      sessionTimeout: "30",
      passwordExpiry: "90",
      loginNotifications: true
    },
    // Integration Settings
    integrations: {
      gmailConnected: true,
      instagramConnected: true,
      inventoryConnected: false,
      apiKey: "ag_****************************",
      webhookUrl: "https://api.agenticpilot.com/webhook"
    }
  })

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const handleSave = () => {
    onSave(settings)
  }

  const handleReset = () => {
    onReset()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, notifications, and automation preferences
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Automation</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.profile.firstName}
                    onChange={(e) => handleSettingChange("profile", "firstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.profile.lastName}
                    onChange={(e) => handleSettingChange("profile", "lastName", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleSettingChange("profile", "email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={settings.profile.company}
                  onChange={(e) => handleSettingChange("profile", "company", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.profile.timezone} onValueChange={(value) => handleSettingChange("profile", "timezone", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.profile.language} onValueChange={(value) => handleSettingChange("profile", "language", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "emailNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "pushNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                    </div>
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "smsNotifications", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Event Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Task Completion</Label>
                      <p className="text-sm text-muted-foreground">When automation tasks complete</p>
                    </div>
                    <Switch
                      checked={settings.notifications.taskCompletion}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "taskCompletion", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">When inventory runs low</p>
                    </div>
                    <Switch
                      checked={settings.notifications.lowStock}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "lowStock", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">When new features are available</p>
                    </div>
                    <Switch
                      checked={settings.notifications.systemUpdates}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "systemUpdates", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Report</Label>
                      <p className="text-sm text-muted-foreground">Weekly automation summary</p>
                    </div>
                    <Switch
                      checked={settings.notifications.weeklyReport}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "weeklyReport", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Settings */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Gmail Automation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Gmail Automation</span>
                  <Badge variant={settings.automation.gmailEnabled ? "default" : "secondary"}>
                    {settings.automation.gmailEnabled ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Gmail Automation</Label>
                  <Switch
                    checked={settings.automation.gmailEnabled}
                    onCheckedChange={(checked) => handleSettingChange("automation", "gmailEnabled", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Check Interval (minutes)</Label>
                  <Select value={settings.automation.gmailCheckInterval} onValueChange={(value) => handleSettingChange("automation", "gmailCheckInterval", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Every minute</SelectItem>
                      <SelectItem value="5">Every 5 minutes</SelectItem>
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                      <SelectItem value="30">Every 30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Instagram Automation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Instagram className="h-5 w-5" />
                  <span>Instagram Automation</span>
                  <Badge variant={settings.automation.instagramEnabled ? "default" : "secondary"}>
                    {settings.automation.instagramEnabled ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Instagram Automation</Label>
                  <Switch
                    checked={settings.automation.instagramEnabled}
                    onCheckedChange={(checked) => handleSettingChange("automation", "instagramEnabled", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Post Time</Label>
                  <Input
                    type="time"
                    value={settings.automation.instagramPostTime}
                    onChange={(e) => handleSettingChange("automation", "instagramPostTime", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory Automation */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Inventory Automation</span>
                  <Badge variant={settings.automation.inventoryEnabled ? "default" : "secondary"}>
                    {settings.automation.inventoryEnabled ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable Inventory Tracking</Label>
                    <Switch
                      checked={settings.automation.inventoryEnabled}
                      onCheckedChange={(checked) => handleSettingChange("automation", "inventoryEnabled", checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Low Stock Threshold</Label>
                    <Input
                      type="number"
                      value={settings.automation.inventoryThreshold}
                      onChange={(e) => handleSettingChange("automation", "inventoryThreshold", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Auto Reorder</Label>
                    <Switch
                      checked={settings.automation.autoReorder}
                      onCheckedChange={(checked) => handleSettingChange("automation", "autoReorder", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Manage your account security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSettingChange("security", "twoFactorEnabled", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                  </div>
                  <Switch
                    checked={settings.security.loginNotifications}
                    onCheckedChange={(checked) => handleSettingChange("security", "loginNotifications", checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select value={settings.security.sessionTimeout} onValueChange={(value) => handleSettingChange("security", "sessionTimeout", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Select value={settings.security.passwordExpiry} onValueChange={(value) => handleSettingChange("security", "passwordExpiry", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your account is secure. Last security check: Today at 2:30 PM
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>API & Integrations</span>
              </CardTitle>
              <CardDescription>
                Manage your connected services and API access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Connected Services */}
              <div className="space-y-4">
                <h4 className="font-medium">Connected Services</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5" />
                      <div>
                        <Label>Gmail</Label>
                        <p className="text-sm text-muted-foreground">john.doe@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={settings.integrations.gmailConnected ? "default" : "secondary"}>
                        {settings.integrations.gmailConnected ? "Connected" : "Disconnected"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {settings.integrations.gmailConnected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Instagram className="h-5 w-5" />
                      <div>
                        <Label>Instagram</Label>
                        <p className="text-sm text-muted-foreground">@agenticpilot</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={settings.integrations.instagramConnected ? "default" : "secondary"}>
                        {settings.integrations.instagramConnected ? "Connected" : "Disconnected"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {settings.integrations.instagramConnected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5" />
                      <div>
                        <Label>Inventory System</Label>
                        <p className="text-sm text-muted-foreground">External inventory API</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={settings.integrations.inventoryConnected ? "default" : "secondary"}>
                        {settings.integrations.inventoryConnected ? "Connected" : "Disconnected"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {settings.integrations.inventoryConnected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium">API Configuration</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={settings.integrations.apiKey}
                        onChange={(e) => handleSettingChange("integrations", "apiKey", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input
                      value={settings.integrations.webhookUrl}
                      onChange={(e) => handleSettingChange("integrations", "webhookUrl", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Keep your API key secure. Never share it publicly or commit it to version control.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
