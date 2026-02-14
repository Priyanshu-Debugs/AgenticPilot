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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import {
  Instagram,
  Play,
  Pause,
  Calendar,
  ImageIcon,
  Hash,
  TrendingUp,
  Heart,
  MessageCircle,
  Share,
  Eye,
  Plus,
  Upload,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

export default function InstagramAutomation() {
  const [isAutomationActive, setIsAutomationActive] = useState(false)
  const [autoPostEnabled, setAutoPostEnabled] = useState(true)
  const [aiCaptionsEnabled, setAiCaptionsEnabled] = useState(true)

  const scheduledPosts = [
    {
      id: 1,
      image: "/product-display.png",
      caption: "Excited to share our latest product launch! 🚀 #innovation #tech #newproduct",
      scheduledTime: "Today, 2:00 PM",
      status: "scheduled",
      hashtags: ["#innovation", "#tech", "#newproduct"],
      engagement: { likes: 0, comments: 0, shares: 0 },
    },
    {
      id: 2,
      image: "/behind-the-scenes.png",
      caption: "Behind the scenes at our office! Our team working hard to bring you amazing products. #teamwork #office #culture",
      scheduledTime: "Tomorrow, 10:00 AM",
      status: "scheduled",
      hashtags: ["#teamwork", "#office", "#culture"],
      engagement: { likes: 0, comments: 0, shares: 0 },
    },
    {
      id: 3,
      image: "/customer-testimonial.png",
      caption: "Amazing feedback from our customers! Thank you for trusting us with your business. #testimonial #customers #grateful",
      scheduledTime: "Dec 25, 6:00 PM",
      status: "posted",
      hashtags: ["#testimonial", "#customers", "#grateful"],
      engagement: { likes: 127, comments: 23, shares: 8 },
    },
    {
      id: 4,
      image: "/product-showcase.png",
      caption: "Check out this amazing feature that will revolutionize your workflow! #productivity #features #workflow",
      scheduledTime: "Dec 24, 3:00 PM",
      status: "posted",
      hashtags: ["#productivity", "#features", "#workflow"],
      engagement: { likes: 89, comments: 12, shares: 5 },
    },
  ]

  const analytics = [
    { metric: "Total Posts", value: "89", change: "+12 this month" },
    { metric: "Avg Engagement", value: "12.3%", change: "+2.1% from last month" },
    { metric: "Followers Growth", value: "+234", change: "This month" },
    { metric: "Reach", value: "15.2K", change: "+18% from last week" },
  ]

  const bestTimes = [
    { day: "Monday", time: "9:00 AM", engagement: "High" },
    { day: "Wednesday", time: "2:00 PM", engagement: "Very High" },
    { day: "Friday", time: "6:00 PM", engagement: "High" },
    { day: "Sunday", time: "11:00 AM", engagement: "Medium" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "scheduled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "draft":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case "Very High":
        return "text-emerald-500"
      case "High":
        return "text-primary"
      case "Medium":
        return "text-amber-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Instagram Automation</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              AI-powered Instagram post scheduling and management
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
        {analytics.map((stat, index) => {
          const icons = [Instagram, TrendingUp, Heart, Eye]
          const colors = ["text-pink-500", "text-emerald-500", "text-red-500", "text-primary"]
          const IconComponent = icons[index]

          return (
            <Card
              key={stat.metric}
              className="card-elevated"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.metric}</CardTitle>
                <IconComponent className={`h-4 w-4 ${colors[index]}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change} <span className="opacity-50">(Demo)</span></p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Posts</h2>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" onClick={() => toast.info("Post creation coming soon.", { description: "Use the Create Post tab to start composing." })}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledPosts.map((post) => (
              <Card
                key={post.id}
                className="card-elevated overflow-hidden"
              >
                <CardHeader className="p-0">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt="Post preview"
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(post.status)}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.scheduledTime}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.caption}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {post.status === "posted" && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>{post.engagement.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4 text-primary" />
                          <span>{post.engagement.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share className="h-4 w-4 text-emerald-500" />
                          <span>{post.engagement.shares}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Optimal Posting Times</CardTitle>
              <CardDescription>AI-recommended times based on your audience engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bestTimes.map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{time.day}</p>
                        <p className="text-sm text-muted-foreground">{time.time}</p>
                      </div>
                    </div>
                    <Badge className={`${getEngagementColor(time.engagement)}`}>{time.engagement}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>Upload media and create engaging content with AI assistance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Media</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center border-border">
                    <Upload className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Drag and drop your image or video here, or click to browse
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => toast.info("File upload coming soon.", { description: "Media upload will be available in a future update." })}>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    placeholder="Write your caption here..."
                    className="min-h-32"
                  />
                  <Button variant="outline" className="w-full" onClick={() => toast.info("AI caption generation coming soon.", { description: "This feature will use AI to craft engaging captions." })}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Caption
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <Input
                    id="hashtags"
                    placeholder="#hashtag1 #hashtag2 #hashtag3"
                  />
                  <Button variant="outline" className="w-full" onClick={() => toast.info("Hashtag suggestions coming soon.", { description: "AI will analyze trends and suggest optimal hashtags." })}>
                    <Hash className="h-4 w-4 mr-2" />
                    Suggest Hashtags
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Post Date</Label>
                    <Input
                      type="date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Post Time</Label>
                    <Input
                      type="time"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" onClick={() => toast.info("Post scheduling coming soon.", { description: "You'll be able to schedule posts directly from here." })}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Post
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => toast.info("Draft saved!", { description: "Your draft has been saved locally." })}>
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Your Instagram performance overview <span className="opacity-50">(Demo data)</span></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Average Likes per Post
                    </span>
                    <span className="text-sm font-medium">127</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Average Comments per Post
                    </span>
                    <span className="text-sm font-medium">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Engagement Rate
                    </span>
                    <span className="text-sm font-medium">12.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Best Performing Hashtag
                    </span>
                    <span className="text-sm font-medium">#innovation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Top performing content types <span className="opacity-50">(Demo data)</span></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Product Photos
                    </span>
                    <span className="text-sm font-medium">18.2% engagement</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Behind the Scenes
                    </span>
                    <span className="text-sm font-medium">15.7% engagement</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      User Generated Content
                    </span>
                    <span className="text-sm font-medium">14.3% engagement</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Educational Posts
                    </span>
                    <span className="text-sm font-medium">11.8% engagement</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Instagram Automation Settings</CardTitle>
              <CardDescription>Configure your Instagram posting automation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto Posting</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically post scheduled content
                  </div>
                </div>
                <Switch checked={autoPostEnabled} onCheckedChange={setAutoPostEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">AI-Generated Captions</Label>
                  <div className="text-sm text-muted-foreground">
                    Use AI to generate engaging captions
                  </div>
                </div>
                <Switch checked={aiCaptionsEnabled} onCheckedChange={setAiCaptionsEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="posting-frequency">Posting Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple">Multiple times per day</SelectItem>
                    <SelectItem value="daily">Once per day</SelectItem>
                    <SelectItem value="alternate">Every other day</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-style">Content Style</Label>
                <Select defaultValue="professional">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" onClick={() => toast.success("Settings saved!", { description: "Your Instagram automation preferences have been updated." })}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
