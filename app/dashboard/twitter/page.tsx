"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Twitter,
    Play,
    Pause,
    TrendingUp,
    Users,
    BarChart3,
    MessageSquare,
    Heart,
    Repeat2,
    Eye,
    Calendar,
    Zap,
} from "lucide-react"

// Hardcoded demo data
const scheduledTweets = [
    {
        id: "1",
        content: "🚀 Excited to announce our new AI-powered automation features! #AI #Automation #AgenticPilot",
        scheduledFor: "2026-03-02T10:00:00",
        status: "Scheduled",
        type: "Tweet",
        likes: 0,
        retweets: 0,
        impressions: 0,
    },
    {
        id: "2",
        content: "Thread 🧵: 5 ways AI is transforming business operations in 2026...\n\n1/ Automated customer support with context-aware responses",
        scheduledFor: "2026-03-02T14:30:00",
        status: "Scheduled",
        type: "Thread",
        likes: 0,
        retweets: 0,
        impressions: 0,
    },
    {
        id: "3",
        content: "Just shipped a major update to our Gmail automation! Your inbox, managed by AI 📧✨ #ProductUpdate",
        scheduledFor: "2026-03-01T09:00:00",
        status: "Published",
        type: "Tweet",
        likes: 142,
        retweets: 38,
        impressions: 5420,
    },
    {
        id: "4",
        content: "Pro tip: Use automation to handle repetitive tasks so you can focus on what matters most 💡 #Productivity",
        scheduledFor: "2026-02-28T16:00:00",
        status: "Published",
        type: "Tweet",
        likes: 89,
        retweets: 22,
        impressions: 3180,
    },
    {
        id: "5",
        content: "We're hiring! Looking for passionate engineers who love building with AI. DM us or check the link in bio 👇",
        scheduledFor: "2026-03-03T11:00:00",
        status: "Draft",
        type: "Tweet",
        likes: 0,
        retweets: 0,
        impressions: 0,
    },
]

const analyticsData = {
    followers: 12847,
    followersGrowth: "+324 this month",
    engagement: "4.8%",
    engagementChange: "+0.6% from last month",
    impressions: 284500,
    impressionsChange: "+18.2% from last month",
    tweetsPosted: 47,
    tweetsChange: "+12 this month",
}

export default function TwitterAutomation() {
    const [isAutomationActive, setIsAutomationActive] = useState(false)
    const [autoEngageEnabled, setAutoEngageEnabled] = useState(false)
    const [aiCaptionsEnabled, setAiCaptionsEnabled] = useState(true)

    const statsDisplay = [
        { metric: "Followers", value: analyticsData.followers.toLocaleString(), change: analyticsData.followersGrowth, icon: Users },
        { metric: "Engagement Rate", value: analyticsData.engagement, change: analyticsData.engagementChange, icon: Heart },
        { metric: "Impressions", value: analyticsData.impressions.toLocaleString(), change: analyticsData.impressionsChange, icon: Eye },
        { metric: "Tweets Posted", value: String(analyticsData.tweetsPosted), change: analyticsData.tweetsChange, icon: MessageSquare },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Published":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            case "Scheduled":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "Draft":
                return "bg-amber-500/20 text-amber-400 border-amber-500/30"
            default:
                return "bg-muted text-muted-foreground border-border"
        }
    }

    return (
        <div className="space-y-6 sm:space-y-8 max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500/20 rounded-lg flex items-center justify-center">
                        <Twitter className="h-5 w-5 sm:h-6 sm:w-6 text-sky-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">X/Twitter Automation</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            AI-powered tweet scheduling, threads, and engagement automation
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Badge
                        variant={isAutomationActive ? "default" : "secondary"}
                        className={
                            isAutomationActive
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        }
                    >
                        {isAutomationActive ? "Active" : "Paused"}
                    </Badge>
                    <Button
                        onClick={() => setIsAutomationActive(!isAutomationActive)}
                        variant={isAutomationActive ? "destructive" : "default"}
                        size="sm"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statsDisplay.map((stat, index) => {
                    const IconComponent = stat.icon
                    const colors = ["text-sky-500", "text-rose-500", "text-violet-500", "text-amber-500"]

                    return (
                        <Card key={stat.metric} className="card-elevated">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.metric}</CardTitle>
                                <IconComponent className={`h-4 w-4 ${colors[index]}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.change}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="scheduled" className="space-y-6">
                <TabsList className="bg-muted">
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="engagement">Auto Engage</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="scheduled" className="space-y-6">
                    <Card className="card-elevated">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Scheduled Content
                            </CardTitle>
                            <CardDescription>
                                Manage your upcoming tweets and threads
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="whitespace-nowrap">Content</TableHead>
                                            <TableHead className="whitespace-nowrap">Type</TableHead>
                                            <TableHead className="whitespace-nowrap">Scheduled For</TableHead>
                                            <TableHead className="whitespace-nowrap">Status</TableHead>
                                            <TableHead className="whitespace-nowrap">Engagement</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scheduledTweets.map((tweet) => (
                                            <TableRow key={tweet.id}>
                                                <TableCell className="font-medium max-w-xs">
                                                    <p className="truncate text-sm">{tweet.content}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs">
                                                        {tweet.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(tweet.scheduledFor).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(tweet.status)}>
                                                        {tweet.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="h-3 w-3" /> {tweet.likes}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Repeat2 className="h-3 w-3" /> {tweet.retweets}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="h-3 w-3" /> {tweet.impressions.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="card-elevated">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Growth Metrics
                                </CardTitle>
                                <CardDescription>Account performance over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Follower Growth Rate</span>
                                        <span className="text-sm font-medium text-emerald-400">+2.6%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Avg Likes per Tweet</span>
                                        <span className="text-sm font-medium">87</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Avg Retweets per Tweet</span>
                                        <span className="text-sm font-medium">24</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Best Posting Time</span>
                                        <span className="text-sm font-medium">10:00 AM - 12:00 PM</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Top Hashtag</span>
                                        <span className="text-sm font-medium">#AI</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-elevated">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Content Performance
                                </CardTitle>
                                <CardDescription>Breakdown by content type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Single Tweets</span>
                                        <span className="text-sm font-medium">68% of content • 3.2% engagement</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Threads</span>
                                        <span className="text-sm font-medium">22% of content • 6.8% engagement</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Replies</span>
                                        <span className="text-sm font-medium">10% of content • 8.1% engagement</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Link Clicks (Total)</span>
                                        <span className="text-sm font-medium">1,847</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Profile Visits</span>
                                        <span className="text-sm font-medium">3,241</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="engagement" className="space-y-6">
                    <Card className="card-elevated">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Auto Engagement
                            </CardTitle>
                            <CardDescription>
                                AI-powered automatic engagement with your audience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Auto Like Mentions</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Automatically like tweets that mention your account
                                    </div>
                                </div>
                                <Switch checked={autoEngageEnabled} onCheckedChange={setAutoEngageEnabled} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">AI Reply Suggestions</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Generate smart reply suggestions for mentions and DMs
                                    </div>
                                </div>
                                <Switch checked={aiCaptionsEnabled} onCheckedChange={setAiCaptionsEnabled} />
                            </div>

                            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                                <h4 className="font-medium text-sm">Recent Auto-Engagements</h4>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>• Liked @techstartup's mention about AgenticPilot — 2h ago</p>
                                    <p>• Auto-replied to @devloper_x's question about pricing — 4h ago</p>
                                    <p>• Liked @ai_enthusiast's retweet of your thread — 6h ago</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                    <Card className="card-elevated">
                        <CardHeader>
                            <CardTitle>Twitter Automation Settings</CardTitle>
                            <CardDescription>Configure your X/Twitter automation preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="default-hashtags">Default Hashtags</Label>
                                    <Input
                                        id="default-hashtags"
                                        defaultValue="#AI #Automation #AgenticPilot"
                                        placeholder="Enter default hashtags..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="posting-frequency">Max Posts Per Day</Label>
                                    <Input
                                        id="posting-frequency"
                                        type="number"
                                        defaultValue="5"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="optimal-time">Preferred Posting Window</Label>
                                    <Input
                                        id="optimal-time"
                                        defaultValue="9:00 AM - 6:00 PM"
                                        placeholder="Enter preferred time window..."
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">AI-Generated Captions</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Use Gemini AI to enhance tweet copy
                                        </div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>

                            <Button>Save Settings</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
