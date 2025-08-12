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
import { Instagram, Play, Pause, Calendar, ImageIcon, Hash, TrendingUp, Heart, MessageCircle, Share, Eye, Plus, Upload, Sparkles } from "lucide-react"

export default function InstagramAutomationPanel() {
  const [isAutomationActive, setIsAutomationActive] = useState(false)
  const [autoPostEnabled, setAutoPostEnabled] = useState(true)
  const [aiCaptionsEnabled, setAiCaptionsEnabled] = useState(true)

  const scheduledPosts = [
    { id: 1, image: "/product-display.png", caption: "Excited to share our latest product launch! 🚀 #innovation #tech #newproduct", scheduledTime: "Today, 2:00 PM", status: "scheduled", hashtags: ["#innovation", "#tech", "#newproduct"], engagement: { likes: 0, comments: 0, shares: 0 } },
    { id: 2, image: "/behind-the-scenes.png", caption: "Behind the scenes at our office! Our team working hard to bring you amazing products. #teamwork #office #culture", scheduledTime: "Tomorrow, 10:00 AM", status: "scheduled", hashtags: ["#teamwork", "#office", "#culture"], engagement: { likes: 0, comments: 0, shares: 0 } },
    { id: 3, image: "/customer-testimonial.png", caption: "Amazing feedback from our customers! Thank you for trusting us with your business. #testimonial #customers #grateful", scheduledTime: "Dec 25, 6:00 PM", status: "posted", hashtags: ["#testimonial", "#customers", "#grateful"], engagement: { likes: 127, comments: 23, shares: 8 } },
  ]

  const analytics = [
    { metric: "Total Posts", value: "89" },
    { metric: "Avg Engagement", value: "12.3%" },
    { metric: "Followers Growth", value: "+234" },
    { metric: "Reach", value: "15.2K" },
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
        return "bg-green-600/20 text-green-500 border-green-600/30"
      case "scheduled":
        return "bg-blue-600/20 text-blue-500 border-blue-600/30"
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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center">
            <Instagram className="h-6 w-6 text-pink-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Instagram Automation</h2>
            <p className="text-gray-600 dark:text-gray-400">AI-powered Instagram post scheduling and management</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={isAutomationActive ? "bg-green-600/20 text-green-500 border-green-600/30" : "bg-yellow-600/20 text-yellow-500 border-yellow-600/30"}>
            {isAutomationActive ? "Active" : "Paused"}
          </Badge>
          <Button
            onClick={() => setIsAutomationActive(!isAutomationActive)}
            className={isAutomationActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isAutomationActive ? (<><Pause className="h-4 w-4 mr-2" /> Pause</>) : (<><Play className="h-4 w-4 mr-2" /> Start</>)}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { metric: "Total Posts", value: "89", icon: Instagram, color: "text-pink-500" },
          { metric: "Avg Engagement", value: "12.3%", icon: TrendingUp, color: "text-green-500" },
          { metric: "Followers Growth", value: "+234", icon: Heart, color: "text-red-500" },
          { metric: "Reach", value: "15.2K", icon: Eye, color: "text-blue-500" },
        ].map((stat, idx) => {
          const Icon = stat.icon as any
          return (
            <Card key={idx} className="border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.metric}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recent Posts</h3>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="h-4 w-4 mr-2" /> New Post
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledPosts.map((post) => (
              <Card key={post.id} className="border-gray-200 dark:border-gray-800">
                <CardHeader className="p-0">
                  <Image src={post.image || "/placeholder.svg"} alt="Post preview" width={400} height={200} className="w-full h-48 object-cover rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(post.status)}>{post.status.charAt(0).toUpperCase() + post.status.slice(1)}</Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{post.scheduledTime}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{post.caption}</p>
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{tag}</span>
                    ))}
                  </div>
                  {post.status === "posted" && (
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1"><Heart className="h-4 w-4 text-red-500" /><span>{post.engagement.likes}</span></div>
                      <div className="flex items-center space-x-1"><MessageCircle className="h-4 w-4 text-blue-500" /><span>{post.engagement.comments}</span></div>
                      <div className="flex items-center space-x-1"><Share className="h-4 w-4 text-green-500" /><span>{post.engagement.shares}</span></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Optimal Posting Times</CardTitle>
              <CardDescription>AI-recommended times based on your audience engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bestTimes.map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="font-medium">{time.day}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{time.time}</p>
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
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>Upload media and create engaging content with AI assistance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Media</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center border-gray-200 dark:border-gray-700">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">Drag and drop your image or video here, or click to browse</p>
                    <Button variant="outline" className="mt-4 bg-transparent">
                      <ImageIcon className="h-4 w-4 mr-2" /> Choose File
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea id="caption" placeholder="Write your caption here..." className="min-h-32" />
                  <Button variant="outline" className="w-full bg-transparent">
                    <Sparkles className="h-4 w-4 mr-2" /> Generate AI Caption
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <Input id="hashtags" placeholder="#hashtag1 #hashtag2 #hashtag3" />
                  <Button variant="outline" className="w-full bg-transparent">
                    <Hash className="h-4 w-4 mr-2" /> Suggest Hashtags
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Post Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Post Time</Label>
                    <Input type="time" />
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button className="flex-1 bg-pink-600 hover:bg-pink-700">
                  <Calendar className="h-4 w-4 mr-2" /> Schedule Post
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Your Instagram performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Average Likes per Post</span><span className="text-sm font-medium">127</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Average Comments per Post</span><span className="text-sm font-medium">23</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</span><span className="text-sm font-medium">12.3%</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Best Performing Hashtag</span><span className="text-sm font-medium">#innovation</span></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Top performing content types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Product Photos</span><span className="text-sm font-medium">18.2% engagement</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Behind the Scenes</span><span className="text-sm font-medium">15.7% engagement</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">User Generated Content</span><span className="text-sm font-medium">14.3% engagement</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Educational Posts</span><span className="text-sm font-medium">11.8% engagement</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Instagram Automation Settings</CardTitle>
              <CardDescription>Configure your Instagram posting automation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto Posting</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Automatically post scheduled content</div>
                </div>
                <Switch checked={autoPostEnabled} onCheckedChange={setAutoPostEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">AI-Generated Captions</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Use AI to generate engaging captions</div>
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
              <Button className="bg-pink-600 hover:bg-pink-700">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
