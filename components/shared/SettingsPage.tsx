"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  User,
  Bell,
  Database,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface SettingsProps {
  settings?: any;
  onSave?: (settings: any) => void;
  onReset?: () => void;
  onExport?: () => void;
}

const defaultSettings = {
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    timezone: "UTC",
    language: "en",
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    taskCompletion: true,
    lowStock: true,
    systemUpdates: true,
    weeklyReport: true,
  },
  automation: {
    gmailEnabled: false,
    gmailCheckInterval: "5",
    instagramEnabled: false,
    instagramPostTime: "09:00",
    twitterEnabled: false,
    twitterPostFrequency: "5",
    linkedinEnabled: false,
    linkedinPostSchedule: "Tue,Thu",
    autoReorder: false,
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginNotifications: true,
  },
  integrations: {
    gmailConnected: false,
    instagramConnected: false,
    twitterConnected: false,
    linkedinConnected: false,
    apiKey: "",
    webhookUrl: "",
  },
  appearance: {
    theme: "system",
  },
};

const mergeSettings = (incoming?: any) => ({
  ...defaultSettings,
  ...incoming,
  profile: {
    ...defaultSettings.profile,
    ...incoming?.profile,
  },
  notifications: {
    ...defaultSettings.notifications,
    ...incoming?.notifications,
  },
  automation: {
    ...defaultSettings.automation,
    ...incoming?.automation,
  },
  security: {
    ...defaultSettings.security,
    ...incoming?.security,
  },
  integrations: {
    ...defaultSettings.integrations,
    ...incoming?.integrations,
  },
  appearance: {
    ...defaultSettings.appearance,
    ...incoming?.appearance,
  },
});

export function SettingsPage({
  settings: initialSettings,
  onSave = () => {},
  onReset = () => {},
  onExport = () => {},
}: SettingsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [integrationLoading, setIntegrationLoading] = useState<string | null>(
    null,
  );
  const [settings, setSettings] = useState(() =>
    mergeSettings(initialSettings),
  );

  // Update settings when initialSettings prop changes
  React.useEffect(() => {
    if (initialSettings) {
      setSettings(mergeSettings(initialSettings));
    }
  }, [initialSettings]);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  const handleReset = () => {
    onReset();
  };

  const updateIntegration = (key: string, value: boolean) => {
    setSettings((prev: any) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [key]: value,
      },
    }));
  };

  const handleIntegrationAction = async (
    provider: "gmail" | "twitter" | "linkedin" | "instagram",
  ) => {
    if (!settings) return;

    setIntegrationLoading(provider);
    try {
      if (provider === "gmail") {
        if (settings.integrations.gmailConnected) {
          const res = await fetch("/api/gmail/disconnect", { method: "POST" });
          const data = await res.json();
          if (!res.ok)
            throw new Error(data.error || "Failed to disconnect Gmail");
          updateIntegration("gmailConnected", false);
          toast.success("Gmail disconnected");
          return;
        }

        const res = await fetch("/api/gmail/connect", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to connect Gmail");
        if (data.authUrl) {
          window.location.href = data.authUrl;
          return;
        }
        throw new Error("Missing authorization URL");
      }

      if (provider === "linkedin") {
        if (settings.integrations.linkedinConnected) {
          const res = await fetch("/api/linkedin/disconnect", {
            method: "DELETE",
          });
          const data = await res.json();
          if (!res.ok)
            throw new Error(data.error || "Failed to disconnect LinkedIn");
          updateIntegration("linkedinConnected", false);
          toast.success("LinkedIn disconnected");
          return;
        }

        const res = await fetch("/api/linkedin/connect", { method: "POST" });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Failed to connect LinkedIn");
        if (data.authUrl) {
          window.location.href = data.authUrl;
          return;
        }
        throw new Error("Missing authorization URL");
      }

      if (provider === "twitter") {
        if (settings.integrations.twitterConnected) {
          const res = await fetch("/api/twitter/disconnect", {
            method: "DELETE",
          });
          const data = await res.json();
          if (!res.ok)
            throw new Error(data.error || "Failed to disconnect X/Twitter");
          updateIntegration("twitterConnected", false);
          toast.success("X/Twitter disconnected");
          return;
        }

        toast.info("Add your X client credentials to connect.");
        window.location.href = "/dashboard/twitter";
        return;
      }

      if (provider === "instagram") {
        toast.info("Open Instagram Studio to start creating posts.");
        window.location.href = "/dashboard/instagram";
      }
    } catch (error: any) {
      toast.error(error?.message || "Integration action failed");
    } finally {
      setIntegrationLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      {/* Header */}
      <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between md:gap-y-0">
        <div className="flex items-center gap-x-3">
          <Settings className="size-8 text-gray-600 dark:text-gray-400" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, notifications, and automation preferences
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="size-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="size-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="flex flex-col gap-y-6">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="profile" className="flex items-center gap-x-2">
            <User className="size-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-x-2"
          >
            <Bell className="size-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>

          <TabsTrigger
            value="integrations"
            className="flex items-center gap-x-2"
          >
            <Database className="size-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="flex flex-col gap-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <User className="size-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.profile.firstName}
                    onChange={(e) =>
                      handleSettingChange(
                        "profile",
                        "firstName",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.profile.lastName}
                    onChange={(e) =>
                      handleSettingChange("profile", "lastName", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.profile.email}
                  disabled
                  className="bg-muted/50"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={settings.profile.company}
                  onChange={(e) =>
                    handleSettingChange("profile", "company", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.profile.timezone}
                    onValueChange={(value) =>
                      handleSettingChange("profile", "timezone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.profile.language}
                    onValueChange={(value) =>
                      handleSettingChange("profile", "language", value)
                    }
                  >
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
        <TabsContent value="notifications" className="flex flex-col gap-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <Bell className="size-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-6">
              <div className="flex flex-col gap-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="flex flex-col gap-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "notifications",
                          "emailNotifications",
                          checked,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "notifications",
                          "pushNotifications",
                          checked,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive critical alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "notifications",
                          "smsNotifications",
                          checked,
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-4">
                <h4 className="font-medium">Event Types</h4>
                <div className="flex flex-col gap-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Task Completion</Label>
                      <p className="text-sm text-muted-foreground">
                        When automation tasks complete
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.taskCompletion}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "notifications",
                          "taskCompletion",
                          checked,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Engagement Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        When posts get high engagement
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.lowStock}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "notifications",
                          "lowStock",
                          checked,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        When new features are available
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.systemUpdates}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "notifications",
                          "systemUpdates",
                          checked,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Report</Label>
                      <p className="text-sm text-muted-foreground">
                        Weekly automation summary
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.weeklyReport}
                      onCheckedChange={(checked) =>
                        handleSettingChange(
                          "notifications",
                          "weeklyReport",
                          checked,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="flex flex-col gap-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <Database className="size-5" />
                <span>API & Integrations</span>
              </CardTitle>
              <CardDescription>
                Manage your connected services and API access
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-6">
              {/* Connected Services */}
              <div className="flex flex-col gap-y-4">
                <h4 className="font-medium">Connected Services</h4>
                <div className="flex flex-col gap-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-x-3">
                      <Mail className="size-5" />
                      <div>
                        <Label>Gmail</Label>
                        <p className="text-sm text-muted-foreground">
                          {settings.integrations.gmailConnected
                            ? settings.profile.email || "Connected"
                            : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Badge
                        variant={
                          settings.integrations.gmailConnected
                            ? "default"
                            : "secondary"
                        }
                      >
                        {settings.integrations.gmailConnected
                          ? "Connected"
                          : "Disconnected"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleIntegrationAction("gmail")}
                        disabled={integrationLoading === "gmail"}
                      >
                        {integrationLoading === "gmail"
                          ? "Working..."
                          : settings.integrations.gmailConnected
                            ? "Disconnect"
                            : "Connect"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-x-3">
                      <Instagram className="size-5" />
                      <div>
                        <Label>Instagram</Label>
                        <p className="text-sm text-muted-foreground">
                          {settings.integrations.instagramConnected
                            ? "Connected account"
                            : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Badge
                        variant={
                          settings.integrations.instagramConnected
                            ? "default"
                            : "secondary"
                        }
                      >
                        {settings.integrations.instagramConnected
                          ? "Connected"
                          : "Disconnected"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleIntegrationAction("instagram")}
                        disabled={integrationLoading === "instagram"}
                      >
                        {integrationLoading === "instagram"
                          ? "Working..."
                          : "Open Studio"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-x-3">
                      <Twitter className="size-5" />
                      <div>
                        <Label>X/Twitter</Label>
                        <p className="text-sm text-muted-foreground">
                          {settings.integrations.twitterConnected
                            ? "Connected account"
                            : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Badge
                        variant={
                          settings.integrations.twitterConnected
                            ? "default"
                            : "secondary"
                        }
                      >
                        {settings.integrations.twitterConnected
                          ? "Connected"
                          : "Disconnected"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleIntegrationAction("twitter")}
                        disabled={integrationLoading === "twitter"}
                      >
                        {integrationLoading === "twitter"
                          ? "Working..."
                          : settings.integrations.twitterConnected
                            ? "Disconnect"
                            : "Connect"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-x-3">
                      <Linkedin className="size-5" />
                      <div>
                        <Label>LinkedIn</Label>
                        <p className="text-sm text-muted-foreground">
                          {settings.integrations.linkedinConnected
                            ? settings.profile.company ||
                              "Connected organization"
                            : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Badge
                        variant={
                          settings.integrations.linkedinConnected
                            ? "default"
                            : "secondary"
                        }
                      >
                        {settings.integrations.linkedinConnected
                          ? "Connected"
                          : "Disconnected"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleIntegrationAction("linkedin")}
                        disabled={integrationLoading === "linkedin"}
                      >
                        {integrationLoading === "linkedin"
                          ? "Working..."
                          : settings.integrations.linkedinConnected
                            ? "Disconnect"
                            : "Connect"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Configuration */}
              <div className="flex flex-col gap-y-4">
                <h4 className="font-medium">API Configuration</h4>
                <div className="flex flex-col gap-y-4">
                  <div className="flex flex-col gap-y-2">
                    <Label>API Key</Label>
                    <div className="flex gap-x-2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={settings.integrations.apiKey || ""}
                        onChange={(e) =>
                          handleSettingChange(
                            "integrations",
                            "apiKey",
                            e.target.value,
                          )
                        }
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                      <Button variant="outline">
                        <RefreshCw className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Label>Webhook URL</Label>
                    <Input
                      value={settings.integrations.webhookUrl || ""}
                      onChange={(e) =>
                        handleSettingChange(
                          "integrations",
                          "webhookUrl",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="size-4" />
                <AlertDescription>
                  Keep your API key secure. Never share it publicly or commit it
                  to version control.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save/Reset Actions */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={onExport}>
          Export Settings
        </Button>
        <div className="flex gap-x-2">
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="size-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={() => onSave(settings)}>
            <Save className="size-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
