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
import {
  Instagram,
  Bot,
  Sun,
  Moon,
  ArrowLeft,
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
import Link from "next/link"

export default function InstagramAutomation() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isAutomationActive, setIsAutomationActive] = useState(false)
  const [autoPostEnabled, setAutoPostEnabled] = useState(true)
  const [aiCaptionsEnabled, setAiCaptionsEnabled] = useState(true)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

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
      caption:
        "Behind the scenes at our office! Our team working hard to bring you amazing products. #teamwork #office #culture",
      scheduledTime: "Tomorrow, 10:00 AM",
      status: "scheduled",
      hashtags: ["#teamwork", "#office", "#culture"],
      engagement: { likes: 0, comments: 0, shares: 0 },
    },
    {
      id: 3,
      image: "/customer-testimonial.png",
      caption:
        "Amazing feedback from our customers! Thank you for trusting us with your business. #testimonial #customers #grateful",
      scheduledTime: "Dec 25, 6:00 PM",
      status: "posted",
      hashtags: ["#testimonial", "#customers", "#grateful"],
      engagement: { likes: 127, comments: 23, shares: 8 },
    },
    {
      id: 4,
      image: "/product-showcase.png",
      caption:
        "Check out this amazing feature that will revolutionize your workflow! #productivity #features #workflow",
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
        return "bg-green-600/20 text-green-400 border-green-600/30"
      case "scheduled":
        return "bg-blue-600/20 text-blue-400 border-blue-600/30"
      case "draft":
        return "bg-gray-600/20 text-gray-400 border-gray-600/30"
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-600/30"
    }
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case "Very High":
        return "text-green-500"
      case "High":
        return "text-blue-500"
      case "Medium":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Navigation */}
      <nav
        className={`border-b ${isDarkMode ? "border-gray-800 bg-gray-950/80" : "border-gray-200 bg-white/80"} backdrop-blur-sm sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className={`flex items-center space-x-2 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={`${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center">
              <Instagram className="h-6 w-6 text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Instagram Automation</h1>
              <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                AI-powered Instagram post scheduling and management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge
              variant={isAutomationActive ? "default" : "secondary"}
              className={
                isAutomationActive
                  ? "bg-green-600/20 text-green-400 border-green-600/30"
                  : "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
              }
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
          {analytics.map((stat, index) => {
            const icons = [Instagram, TrendingUp, Heart, Eye]
            const colors = ["text-pink-500", "text-green-500", "text-red-500", "text-blue-500"]
            const IconComponent = icons[index]

            return (
              <Card
                key={stat.metric}
                className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.metric}</CardTitle>
                  <IconComponent className={`h-4 w-4 ${colors[index]}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{stat.change}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="create">Create Post</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Posts</h2>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledPosts.map((post) => (
                <Card
                  key={post.id}
                  className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}
                >
                  <CardHeader className="p-0">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Post preview"
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(post.status)}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </Badge>
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {post.scheduledTime}
                      </span>
                    </div>

                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"} line-clamp-3`}>
                      {post.caption}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
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
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span>{post.engagement.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share className="h-4 w-4 text-green-500" />
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
            <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle>Optimal Posting Times</CardTitle>
                <CardDescription>AI-recommended times based on your audience engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bestTimes.map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="font-medium">{time.day}</p>
                          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{time.time}</p>
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
            <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>Upload media and create engaging content with AI assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Media</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
                    >
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Drag and drop your image or video here, or click to browse
                      </p>
                      <Button variant="outline" className="mt-4 bg-transparent">
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
                      className={`min-h-32 ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                    />
                    <Button variant="outline" className="w-full bg-transparent">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate AI Caption
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hashtags">Hashtags</Label>
                    <Input
                      id="hashtags"
                      placeholder="#hashtag1 #hashtag2 #hashtag3"
                      className={`${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                    />
                    <Button variant="outline" className="w-full bg-transparent">
                      <Hash className="h-4 w-4 mr-2" />
                      Suggest Hashtags
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Post Date</Label>
                      <Input
                        type="date"
                        className={`${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Post Time</Label>
                      <Input
                        type="time"
                        className={`${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button className="flex-1 bg-pink-600 hover:bg-pink-700">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Post
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                  <CardDescription>Your Instagram performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Average Likes per Post
                      </span>
                      <span className="text-sm font-medium">127</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Average Comments per Post
                      </span>
                      <span className="text-sm font-medium">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Engagement Rate
                      </span>
                      <span className="text-sm font-medium">12.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Best Performing Hashtag
                      </span>
                      <span className="text-sm font-medium">#innovation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>Top performing content types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Product Photos
                      </span>
                      <span className="text-sm font-medium">18.2% engagement</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Behind the Scenes
                      </span>
                      <span className="text-sm font-medium">15.7% engagement</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        User Generated Content
                      </span>
                      <span className="text-sm font-medium">14.3% engagement</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
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
            <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle>Instagram Automation Settings</CardTitle>
                <CardDescription>Configure your Instagram posting automation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Posting</Label>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Automatically post scheduled content
                    </div>
                  </div>
                  <Switch checked={autoPostEnabled} onCheckedChange={setAutoPostEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">AI-Generated Captions</Label>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Use AI to generate engaging captions
                    </div>
                  </div>
                  <Switch checked={aiCaptionsEnabled} onCheckedChange={setAiCaptionsEnabled} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="posting-frequency">Posting Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger
                      className={`${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                    >
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
                    <SelectTrigger
                      className={`${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                    >
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

                <Button className="bg-pink-600 hover:bg-pink-700">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
