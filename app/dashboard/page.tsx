"use client";

// React hooks
import { useState, useEffect } from "react";
// Custom components
import { StatsCard, ActionCard } from "@/components/shared/Cards";
import { AutomationController } from "@/components/shared/AutomationController";
// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// Icons from Lucide React
import {
  Mail,
  Zap,
  Settings,
  Bell,
  TrendingUp,
  Clock,
  Loader2,
  BarChart3,
  Twitter,
  Linkedin,
  Instagram,
  Bot,
  Lightbulb,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
// Auth and profile hooks
import { useAuth } from "@/utils/auth/AuthProvider";
import { useUserProfile } from "@/utils/hooks/useUserProfile";
// Recharts imports
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";

interface GmailStats {
  totalProcessed: number;
  autoReplies: number;
  avgResponseTime: string;
  successRate: string;
}

interface Activity {
  id: string;
  action: string;
  status: string;
  details: string;
  timestamp: string;
  emailSubject?: string;
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
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();

  // Real stats from API
  const [stats, setStats] = useState<GmailStats>({
    totalProcessed: 0,
    autoReplies: 0,
    avgResponseTime: "0.0",
    successRate: "100.0",
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "automations" | "analytics" | "integrations"
  >("automations");

  // Real stats logs chart data state
  const [chartData, setChartData] = useState<any[]>([]);

  // Suggest Automation state
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestName, setSuggestName] = useState("");
  const [suggestEmail, setSuggestEmail] = useState("");
  const [suggestText, setSuggestText] = useState("");
  const [suggestLoading, setSuggestLoading] = useState(false);

  // Fetch real stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await fetch("/api/gmail/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity || []);
      }

      // Fetch logs for visual Recharts area trend graph
      const logsResponse = await fetch("/api/gmail/logs?limit=50");
      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        const logs = logsData.logs || [];
        
        // Group logs by day to display beautiful daily activity trends
        const dailyGroups: Record<string, { date: string; success: number; failed: number; total: number; avgTime: number; times: number[] }> = {};
        
        // Populate the last 7 days by default to ensure we have a continuous timeline
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          dailyGroups[dateStr] = { date: dateStr, success: 0, failed: 0, total: 0, avgTime: 0, times: [] };
        }
        
        // Fill in real data from logs
        logs.forEach((log: any) => {
          const logDate = new Date(log.createdAt);
          const dateStr = logDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          
          if (!dailyGroups[dateStr]) {
            dailyGroups[dateStr] = { date: dateStr, success: 0, failed: 0, total: 0, avgTime: 0, times: [] };
          }
          
          dailyGroups[dateStr].total++;
          if (log.success) {
            dailyGroups[dateStr].success++;
          } else {
            dailyGroups[dateStr].failed++;
          }
          if (log.responseTime > 0) {
            dailyGroups[dateStr].times.push(log.responseTime);
          }
        });
        
        // Format daily data points
        const formattedData = Object.values(dailyGroups).map(group => {
          const avg = group.times.length
            ? Math.round(group.times.reduce((a, b) => a + b, 0) / group.times.length) / 1000
            : 0;
          return {
            date: group.date,
            "Total Processed": group.total,
            "Successful Replies": group.success,
            "Failed Runs": group.failed,
            "Response Time (s)": avg,
          };
        });

        // Fallback mock trend for illustrative preview if no logs exist yet
        const totalLogsCount = logs.length;
        if (totalLogsCount === 0) {
          const mockData = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            
            const seedVal = [12, 19, 15, 25, 22, 30, 28][6 - i];
            const successVal = Math.round(seedVal * 0.95);
            const timeVal = [1.8, 1.6, 2.1, 1.5, 1.9, 1.4, 1.6][6 - i];
            
            mockData.push({
              date: dateStr,
              "Total Processed": seedVal,
              "Successful Replies": successVal,
              "Failed Runs": seedVal - successVal,
              "Response Time (s)": timeVal,
              isMock: true,
            });
          }
          setChartData(mockData);
        } else {
          setChartData(formattedData);
        }
      }
    } catch (error) {
      console.error("Error fetching stats or logs:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Automation tasks - derived from real connection status
  const automationTasks = [
    {
      id: "gmail",
      name: "Gmail AI Assistant",
      description: "AI-powered email responses with Gemini",
      href: "/dashboard/gmail",
      actionLabel: "Gmail AI Assistant",
    },
    {
      id: "twitter",
      name: "X/Twitter Automation",
      description: "Automate tweets, threads, and engagement",
      href: "/dashboard/twitter",
      actionLabel: "X/Twitter Automation",
    },
    {
      id: "linkedin",
      name: "LinkedIn Automation",
      description: "Automate posts, connections, and outreach",
      href: "/dashboard/linkedin",
      actionLabel: "LinkedIn Automation",
    },
    {
      id: "instagram",
      name: "Instagram Studio",
      description: "Generate product visuals and schedule captions",
      href: "/dashboard/instagram",
      actionLabel: "Instagram Studio",
    },
    {
      id: "listening",
      name: "Social Listening",
      description: "Track brand mentions and social trends with AI",
      href: "/dashboard/listening",
      actionLabel: "Social Listening",
    },
  ];

  const handleSuggestAutomation = async () => {
    if (!suggestText.trim()) {
      toast.error("Please describe the automation you want");
      return;
    }
    setSuggestLoading(true);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: suggestName || profile?.full_name || "",
          email: suggestEmail || user?.email || "",
          suggestion: suggestText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("🎉 Suggestion submitted! We'll review it soon.");
        setSuggestName("");
        setSuggestEmail("");
        setSuggestText("");
        setSuggestOpen(false);
      } else {
        toast.error(data.error || "Failed to submit suggestion");
      }
    } catch {
      toast.error("Failed to submit suggestion");
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleOpenIntegrations = () => {
    setActiveTab("integrations");
    const tabs = document.getElementById("dashboard-tabs");
    if (tabs) {
      tabs.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const statsData = [
    {
      title: "Emails Processed",
      value: stats.totalProcessed.toLocaleString(),
      change: `${stats.autoReplies} auto-replies sent`,
      changeType: "positive" as const,
      icon: Mail,
      trend: Math.min(stats.totalProcessed, 100),
    },
    {
      title: "Auto Replies",
      value: stats.autoReplies.toLocaleString(),
      change: "AI-powered responses",
      changeType: "positive" as const,
      icon: Zap,
      trend: Math.min(stats.autoReplies * 10, 100),
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      change: "Based on all actions",
      changeType:
        parseFloat(stats.successRate) >= 90
          ? ("positive" as const)
          : ("neutral" as const),
      icon: TrendingUp,
      trend: parseFloat(stats.successRate) || 0,
    },
    {
      title: "Avg Response Time",
      value: `${stats.avgResponseTime}s`,
      change: "Per email processed",
      changeType: "positive" as const,
      icon: Clock,
      trend: 100 - Math.min(parseFloat(stats.avgResponseTime) * 10, 100),
    },
  ];

  const quickActions = [
    {
      title: "Suggest Automation",
      description: "Have an idea for a new automation? Let us know!",
      icon: Lightbulb,
      buttonText: "Suggest",
      onAction: () => setSuggestOpen(true),
    },
    {
      title: "System Settings",
      description: "Configure global automation settings",
      icon: Settings,
      buttonText: "Configure",
      onAction: () => (window.location.href = "/settings"),
    },
    {
      title: "Notifications",
      description: "Manage alerts and notification preferences",
      icon: Bell,
      buttonText: "Manage",
      onAction: () => (window.location.href = "/notifications"),
    },
  ];

  return (
    <div className="flex flex-col gap-y-6 sm:gap-y-8 max-w-full overflow-x-hidden">
      {/* Dashboard Header */}
      <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Command center</p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome
                {profile?.full_name
                  ? `, ${profile.full_name.split(" ")[0]}`
                  : ""}
                .
              </h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Monitor automation health, jump into agents, and review recent
                work from one dashboard.
              </p>
              {profile && (
                <div className="mt-3 flex items-center">
                  <div className="mr-2 size-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">
                    {profile.plan.charAt(0).toUpperCase() +
                      profile.plan.slice(1)}{" "}
                    Plan Active
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleOpenIntegrations}>
              <Settings className="size-4" />
              View Integrations
            </Button>
            <Dialog open={suggestOpen} onOpenChange={setSuggestOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Lightbulb className="size-4" />
                  Suggest Automation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Lightbulb className="size-5 text-primary" />
                    Suggest an Automation
                  </DialogTitle>
                  <DialogDescription>
                    Have an idea for a new automation? Tell us what you&apos;d
                    like to automate and we&apos;ll consider adding it.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor="suggest-name">Your Name</Label>
                      <Input
                        id="suggest-name"
                        placeholder="John Doe"
                        value={suggestName}
                        onChange={(e) => setSuggestName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor="suggest-email">Email</Label>
                      <Input
                        id="suggest-email"
                        type="email"
                        placeholder="john@example.com"
                        value={suggestEmail}
                        onChange={(e) => setSuggestEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Label htmlFor="suggest-text">Your Suggestion *</Label>
                    <Textarea
                      id="suggest-text"
                      placeholder="I'd love to see an automation for... (describe the platform, use case, and how it would help you)"
                      value={suggestText}
                      onChange={(e) => setSuggestText(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={handleSuggestAutomation}
                    disabled={suggestLoading || !suggestText.trim()}
                    className="w-full"
                  >
                    {suggestLoading ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="size-4 mr-2" /> Submit Suggestion
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
      <Tabs
        id="dashboard-tabs"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        className="flex flex-col gap-y-6"
      >
        <TabsList className="grid h-auto w-full grid-cols-3">
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="automations" className="flex flex-col gap-y-6">
          <AutomationController tasks={automationTasks} />
        </TabsContent>

        <TabsContent value="analytics" className="flex flex-col gap-y-6">
          <div className="grid gap-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-x-2">
                  <BarChart3 className="size-5" />
                  <span>Performance Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {stats.totalProcessed.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Tasks Processed
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {stats.successRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Success Rate
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {stats.avgResponseTime}s
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Avg Response Time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Usage Trends</CardTitle>
                {chartData.length > 0 && chartData[0]?.isMock && (
                  <Badge variant="outline" className="text-xs bg-muted/30 border-muted text-muted-foreground">
                    Illustrative Preview
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full pt-4">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="#71717a"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#71717a"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            background: "#09090b",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            color: "#fafafa",
                            fontSize: "12px",
                          }}
                          itemStyle={{ color: "#a1a1aa" }}
                          labelStyle={{ fontWeight: "bold", color: "#fafafa", marginBottom: "4px" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Total Processed"
                          stroke="#818cf8"
                          fill="rgba(129, 140, 248, 0.08)"
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Successful Replies"
                          stroke="#10b981"
                          fill="rgba(16, 185, 129, 0.08)"
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                      <Loader2 className="size-6 animate-spin mr-2 text-primary" />
                      Loading chart…
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="flex flex-col gap-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              title="Gmail Integration"
              description="Connect and manage Gmail automation"
              icon={Mail}
              buttonText="Configure"
              onAction={() => (window.location.href = "/dashboard/gmail")}
            />
            <ActionCard
              title="X/Twitter Automation"
              description="Automate tweets, threads, and engagement"
              icon={Twitter}
              buttonText="Setup"
              onAction={() => (window.location.href = "/dashboard/twitter")}
            />
            <ActionCard
              title="LinkedIn Automation"
              description="Automate posts, connections, and outreach"
              icon={Linkedin}
              buttonText="Setup"
              onAction={() => (window.location.href = "/dashboard/linkedin")}
            />
            <ActionCard
              title="Instagram Integration"
              description="Automate social media posting"
              icon={Instagram}
              buttonText="Connect"
              onAction={() => (window.location.href = "/dashboard/instagram")}
            />
            <ActionCard
              title="Social Listening"
              description="Track mentions and trends across social platforms"
              icon={TrendingUp}
              buttonText="Setup"
              onAction={() => (window.location.href = "/dashboard/listening")}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Clock className="size-5" />
              <span>Recent Activity</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchStats}
              disabled={isLoadingStats}
            >
              {isLoadingStats ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-4">
            {isLoadingStats ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 animate-spin mr-2" />
                <span className="text-muted-foreground">
                  Loading activity…
                </span>
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="flex items-center gap-x-3"
                >
                  <div
                    className={`size-2 rounded-full ${
                      activity.status === "success"
                        ? "bg-emerald-500"
                        : activity.status === "failed"
                          ? "bg-red-500"
                          : "bg-primary"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.emailSubject ||
                        activity.details ||
                        activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action} -{" "}
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="size-12 mx-auto mb-2 opacity-30" />
                <p className="font-medium">No recent activity</p>
                <p className="text-sm">
                  Run Gmail automation to see activity here
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
