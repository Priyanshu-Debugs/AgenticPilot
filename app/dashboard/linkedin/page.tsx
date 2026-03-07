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
    Linkedin,
    Play,
    Pause,
    TrendingUp,
    Users,
    BarChart3,
    MessageSquare,
    ThumbsUp,
    Share2,
    Eye,
    Calendar,
    Zap,
    Briefcase,
    UserPlus,
} from "lucide-react"

// Hardcoded demo data
const scheduledPosts = [
    {
        id: "1",
        content: "🎯 How AI is reshaping the future of work: Our latest insights on automation trends for 2026 and beyond. #AI #FutureOfWork #Leadership",
        scheduledFor: "2026-03-02T09:00:00",
        status: "Scheduled",
        type: "Article",
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
    },
    {
        id: "2",
        content: "Thrilled to share that AgenticPilot has reached 10,000+ active users! 🚀\n\nThank you to everyone who believed in our vision of making AI automation accessible to all businesses.",
        scheduledFor: "2026-03-02T12:00:00",
        status: "Scheduled",
        type: "Update",
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
    },
    {
        id: "3",
        content: "5 lessons from building an AI-first product:\n\n1. Start with the user problem\n2. Ship fast, iterate faster\n3. AI is a tool, not a strategy\n4. Data quality > Model size\n5. Always keep humans in the loop",
        scheduledFor: "2026-03-01T10:00:00",
        status: "Published",
        type: "Carousel",
        likes: 387,
        comments: 42,
        shares: 89,
        impressions: 18700,
    },
    {
        id: "4",
        content: "We're growing our engineering team! If you're passionate about AI and want to build products that impact thousands of businesses, let's connect. 💼",
        scheduledFor: "2026-02-28T11:00:00",
        status: "Published",
        type: "Job Post",
        likes: 215,
        comments: 31,
        shares: 64,
        impressions: 12400,
    },
    {
        id: "5",
        content: "Behind the scenes of our AI email automation engine — a deep dive into how we're processing 50,000+ emails daily with Gemini AI.",
        scheduledFor: "2026-03-03T14:00:00",
        status: "Draft",
        type: "Article",
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
    },
]

const analyticsData = {
    connections: 8432,
    connectionsGrowth: "+186 this month",
    profileViews: 2847,
    profileViewsChange: "+22.4% from last month",
    postImpressions: 156200,
    impressionsChange: "+31.5% from last month",
    engagement: "5.2%",
    engagementChange: "+0.8% from last month",
}

export default function LinkedInAutomation() {
    const [isAutomationActive, setIsAutomationActive] = useState(false)
    const [autoConnectEnabled, setAutoConnectEnabled] = useState(false)
    const [aiPostsEnabled, setAiPostsEnabled] = useState(true)

    const statsDisplay = [
        { metric: "Connections", value: analyticsData.connections.toLocaleString(), change: analyticsData.connectionsGrowth, icon: Users },
        { metric: "Profile Views", value: analyticsData.profileViews.toLocaleString(), change: analyticsData.profileViewsChange, icon: Eye },
        { metric: "Post Impressions", value: analyticsData.postImpressions.toLocaleString(), change: analyticsData.impressionsChange, icon: BarChart3 },
        { metric: "Engagement Rate", value: analyticsData.engagement, change: analyticsData.engagementChange, icon: ThumbsUp },
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
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">LinkedIn Automation</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            AI-powered post scheduling, networking, and professional outreach
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
                    const colors = ["text-blue-500", "text-violet-500", "text-emerald-500", "text-amber-500"]

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
                    <TabsTrigger value="networking">Auto Network</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="scheduled" className="space-y-6">
                    <Card className="card-elevated">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Scheduled Posts
                            </CardTitle>
                            <CardDescription>
                                Manage your upcoming LinkedIn content
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
                                        {scheduledPosts.map((post) => (
                                            <TableRow key={post.id}>
                                                <TableCell className="font-medium max-w-xs">
                                                    <p className="truncate text-sm">{post.content}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs">
                                                        {post.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(post.scheduledFor).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(post.status)}>
                                                        {post.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <ThumbsUp className="h-3 w-3" /> {post.likes}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageSquare className="h-3 w-3" /> {post.comments}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Share2 className="h-3 w-3" /> {post.shares}
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
                                    Profile Performance
                                </CardTitle>
                                <CardDescription>Your LinkedIn profile metrics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Search Appearances</span>
                                        <span className="text-sm font-medium">847 this week</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Connection Accept Rate</span>
                                        <span className="text-sm font-medium text-emerald-400">72%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Avg Post Reach</span>
                                        <span className="text-sm font-medium">3,420</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Best Posting Day</span>
                                        <span className="text-sm font-medium">Tuesday</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Top Industry Reach</span>
                                        <span className="text-sm font-medium">Technology</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-elevated">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    Content Performance
                                </CardTitle>
                                <CardDescription>Breakdown by content type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Text Posts</span>
                                        <span className="text-sm font-medium">45% of content • 4.1% engagement</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Articles</span>
                                        <span className="text-sm font-medium">25% of content • 6.3% engagement</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Carousels</span>
                                        <span className="text-sm font-medium">20% of content • 8.7% engagement</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Job Posts</span>
                                        <span className="text-sm font-medium">10% of content • 3.2% engagement</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Avg Comment Length</span>
                                        <span className="text-sm font-medium">42 words</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="networking" className="space-y-6">
                    <Card className="card-elevated">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5" />
                                Auto Networking
                            </CardTitle>
                            <CardDescription>
                                AI-powered automatic networking and outreach
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Auto Accept Connections</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Automatically accept connection requests from relevant profiles
                                    </div>
                                </div>
                                <Switch checked={autoConnectEnabled} onCheckedChange={setAutoConnectEnabled} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">AI Connection Messages</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Generate personalized connection request messages using AI
                                    </div>
                                </div>
                                <Switch checked={aiPostsEnabled} onCheckedChange={setAiPostsEnabled} />
                            </div>

                            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                                <h4 className="font-medium text-sm">Recent Networking Activity</h4>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>• Auto-accepted connection from Sarah M., VP Engineering at TechCorp — 1h ago</p>
                                    <p>• Sent personalized intro to Raj K., CTO at DataFlow — 3h ago</p>
                                    <p>• Auto-liked 5 posts from your network — 5h ago</p>
                                    <p>• Endorsed skills for 3 connections — 8h ago</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                    <Card className="card-elevated">
                        <CardHeader>
                            <CardTitle>LinkedIn Automation Settings</CardTitle>
                            <CardDescription>Configure your LinkedIn automation preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="target-industries">Target Industries</Label>
                                    <Input
                                        id="target-industries"
                                        defaultValue="Technology, AI/ML, SaaS, Startups"
                                        placeholder="Enter target industries..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="max-connections">Max Connection Requests Per Day</Label>
                                    <Input
                                        id="max-connections"
                                        type="number"
                                        defaultValue="20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="posting-schedule">Posting Schedule</Label>
                                    <Input
                                        id="posting-schedule"
                                        defaultValue="Tue, Wed, Thu @ 9:00 AM"
                                        placeholder="Enter posting schedule..."
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">AI-Generated Post Content</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Use Gemini AI to draft and enhance LinkedIn posts
                                        </div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Auto Schedule Optimal Times</Label>
                                        <div className="text-sm text-muted-foreground">
                                            AI determines the best time to post for maximum engagement
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
