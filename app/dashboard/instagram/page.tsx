"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { useInstagram, type PhotoStyle } from "@/utils/hooks/useInstagram"
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
  Download,
  Copy,
  Check,
  Loader2,
  Camera,
  Wand2,
  X,
  ArrowRight,
} from "lucide-react"

const PHOTO_STYLES: { value: PhotoStyle; label: string; icon: string; desc: string }[] = [
  { value: "studio", label: "Studio", icon: "📸", desc: "Clean white background, professional lighting" },
  { value: "lifestyle", label: "Lifestyle", icon: "🌿", desc: "Natural setting, warm ambient feel" },
  { value: "flat-lay", label: "Flat Lay", icon: "🎨", desc: "Top-down view, styled arrangement" },
  { value: "minimal", label: "Minimal", icon: "✨", desc: "Elegant simplicity, negative space" },
  { value: "dramatic", label: "Dramatic", icon: "🔥", desc: "Dark moody, cinematic lighting" },
]

export default function InstagramAutomation() {
  const {
    posts,
    settings,
    loading,
    createPost,
    generateCaption,
    suggestHashtags,
    updateSettings,
    getAnalytics,
    getPostsByStatus,
    // Product Studio
    uploadedImageUrl,
    productPhotos,
    isGeneratingPhotos,
    isUploading,
    uploadProductImage,
    generateProductPhotos,
    clearProductStudio,
  } = useInstagram()

  const [isAutomationActive, setIsAutomationActive] = useState(false)
  const [activeTab, setActiveTab] = useState("product-studio")

  // Product Studio state
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [selectedStyles, setSelectedStyles] = useState<PhotoStyle[]>(["studio", "lifestyle", "flat-lay", "minimal"])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create Post state
  const [caption, setCaption] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false)
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [postDate, setPostDate] = useState("")
  const [postTime, setPostTime] = useState("")

  // Auto post settings
  const [autoPostEnabled, setAutoPostEnabled] = useState(settings?.auto_post_enabled ?? true)
  const [aiCaptionsEnabled, setAiCaptionsEnabled] = useState(settings?.ai_captions_enabled ?? true)

  const analytics = getAnalytics()

  // Drag-and-drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      await handleFileUpload(files[0])
    }
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      await handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase
    try {
      await uploadProductImage(file)
    } catch {
      // Error already handled by hook
    }
  }

  const handleGeneratePhotos = async () => {
    if (!productName.trim() || !productDescription.trim()) return
    const results = await generateProductPhotos(productName, productDescription, selectedStyles)
    // Auto-populate caption from the first photo's AI content
    if (results && results.length > 0 && results[0].aiContent) {
      setCaption(results[0].aiContent.caption)
      setHashtags(results[0].aiContent.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' '))
    }
  }

  const handleGenerateCaption = async () => {
    setIsGeneratingCaption(true)
    try {
      const result = await generateCaption(
        `Product: ${productName}. ${productDescription}`,
        settings?.content_style || "professional"
      )
      setCaption(result)
    } finally {
      setIsGeneratingCaption(false)
    }
  }

  const handleSuggestHashtags = async () => {
    if (!caption) return
    setIsGeneratingHashtags(true)
    try {
      const result = await suggestHashtags(caption, "product")
      setHashtags(Array.isArray(result) ? result.join(" ") : result)
    } finally {
      setIsGeneratingHashtags(false)
    }
  }

  const handleCopyCaption = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleUseAsPost = (photo: { imageBase64: string; aiContent?: { caption: string; hashtags: string[]; postingTip: string } }) => {
    setActiveTab("create")
    // Auto-fill from photo's AI content
    if (photo.aiContent) {
      setCaption(photo.aiContent.caption)
      setHashtags(photo.aiContent.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' '))
    } else if (!caption && productName) {
      handleGenerateCaption()
    }
  }

  const toggleStyle = (style: PhotoStyle) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    )
  }

  const handleCreatePost = async () => {
    if (!caption) return
    try {
      await createPost({
        caption,
        hashtags: hashtags.split(/\s+/).filter(Boolean),
        scheduled_time: postDate && postTime ? `${postDate}T${postTime}:00` : undefined,
        status: postDate && postTime ? "scheduled" : "draft",
        ai_generated: true,
        image_url: productPhotos[0]?.imageUrl || uploadedImageUrl || undefined,
      })
      setCaption("")
      setHashtags("")
      setPostDate("")
      setPostTime("")
    } catch {
      // Error handled by hook
    }
  }

  const clearPreview = () => {
    setPreviewImage(null)
    clearProductStudio()
    setProductName("")
    setProductDescription("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

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

  const bestTimes = settings?.best_posting_times?.length
    ? settings.best_posting_times
    : [
      { day: "Monday", time: "9:00 AM", engagement: "High" },
      { day: "Wednesday", time: "2:00 PM", engagement: "Very High" },
      { day: "Friday", time: "6:00 PM", engagement: "High" },
      { day: "Sunday", time: "11:00 AM", engagement: "Medium" },
    ]

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
              AI-powered product photography & content generation
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
        {[
          { metric: "Total Posts", value: String(analytics.totalPosts || "0"), change: `${analytics.postedPosts || 0} posted`, icon: Instagram, color: "text-pink-500" },
          { metric: "Avg Engagement", value: `${analytics.avgEngagement || "0"}%`, change: "Engagement rate", icon: TrendingUp, color: "text-emerald-500" },
          { metric: "AI Photos Generated", value: String(productPhotos.length), change: "This session", icon: Camera, color: "text-purple-500" },
          { metric: "Reach", value: analytics.totalReach || "0", change: "Total views", icon: Eye, color: "text-primary" },
        ].map((stat) => (
          <Card key={stat.metric} className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.metric}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="product-studio" className="flex items-center gap-1.5">
            <Wand2 className="h-3.5 w-3.5" />
            Product Studio
          </TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* ==================== PRODUCT STUDIO TAB ==================== */}
        <TabsContent value="product-studio" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Upload & Product Details */}
              <div className="space-y-6">
                {/* Upload Zone */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-purple-500" />
                      Product Image
                    </CardTitle>
                    <CardDescription>Upload your product photo to generate professional variations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {previewImage ? (
                      <div className="relative group">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative rounded-lg overflow-hidden"
                        >
                          <img
                            src={previewImage}
                            alt="Product preview"
                            className="w-full h-64 object-contain bg-muted/50 rounded-lg"
                          />
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                              <div className="text-center">
                                <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-2" />
                                <p className="text-sm text-white">Uploading...</p>
                              </div>
                            </div>
                          )}
                          <button
                            onClick={clearPreview}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                        {uploadedImageUrl && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 flex items-center gap-1.5 text-xs text-emerald-500"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Uploaded to cloud storage
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${dragActive
                          ? "border-purple-500 bg-purple-500/10 scale-[1.02]"
                          : "border-border hover:border-purple-500/50 hover:bg-muted/50"
                          }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <motion.div
                          animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Upload className={`h-12 w-12 mx-auto mb-4 ${dragActive ? "text-purple-500" : "text-muted-foreground"}`} />
                        </motion.div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Drag & drop your product image here
                        </p>
                        <p className="text-xs text-muted-foreground/70 mb-4">
                          JPEG, PNG, WebP — Max 10MB
                        </p>
                        <Button variant="outline" size="sm">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Browse Files
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Product Details */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      Product Details
                    </CardTitle>
                    <CardDescription>Tell AI about your product for better results</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input
                        id="product-name"
                        placeholder="e.g. Premium Wireless Headphones"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-desc">Description</Label>
                      <Textarea
                        id="product-desc"
                        placeholder="e.g. Sleek black over-ear headphones with active noise cancellation, premium leather cushions, and brushed metal accents"
                        className="min-h-20"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Style Selection */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-blue-500" />
                      Photo Styles
                    </CardTitle>
                    <CardDescription>Select styles for your professional photos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PHOTO_STYLES.map((style) => (
                        <motion.button
                          key={style.value}
                          onClick={() => toggleStyle(style.value)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 rounded-lg border text-left transition-all ${selectedStyles.includes(style.value)
                            ? "border-purple-500 bg-purple-500/10 ring-1 ring-purple-500/30"
                            : "border-border hover:border-purple-500/30 bg-muted/30"
                            }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{style.icon}</span>
                            <span className="font-medium text-sm">{style.label}</span>
                            {selectedStyles.includes(style.value) && (
                              <Check className="h-3.5 w-3.5 text-purple-500 ml-auto" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{style.desc}</p>
                        </motion.button>
                      ))}
                    </div>

                    <Button
                      onClick={handleGeneratePhotos}
                      disabled={!productName.trim() || !productDescription.trim() || selectedStyles.length === 0 || isGeneratingPhotos}
                      className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      size="lg"
                    >
                      {isGeneratingPhotos ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating {selectedStyles.length} Photos...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate {selectedStyles.length} Professional Photos
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Generated Photos Gallery */}
              <div className="space-y-6">
                <Card className="card-elevated min-h-[400px]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-emerald-500" />
                        Generated Photos
                      </span>
                      {productPhotos.length > 0 && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {productPhotos.length} photos
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {productPhotos.length > 0
                        ? "Click on a photo to use it for your post"
                        : "Your AI-generated professional photos will appear here"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="wait">
                      {isGeneratingPhotos && productPhotos.length === 0 ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-16"
                        >
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                            <Sparkles className="h-6 w-6 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <p className="mt-4 text-sm text-muted-foreground">AI is creating your professional photos...</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">This typically takes 30-60 seconds per photo</p>
                        </motion.div>
                      ) : productPhotos.length > 0 ? (
                        <motion.div
                          key="photos"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          {productPhotos.map((photo, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.15, type: "spring" }}
                              className="group relative rounded-lg overflow-hidden border border-border"
                            >
                              <img
                                src={photo.imageBase64}
                                alt={`${photo.style} style`}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-3 left-3 right-3">
                                  <Badge className="bg-white/20 text-white border-white/30 mb-2 capitalize">
                                    {photo.style}
                                  </Badge>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="flex-1 h-8 text-xs"
                                      onClick={() => handleUseAsPost(photo)}
                                    >
                                      <ArrowRight className="h-3 w-3 mr-1" />
                                      Use as Post
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        const a = document.createElement("a")
                                        a.href = photo.imageBase64
                                        a.download = `product-${photo.style}-${Date.now()}.png`
                                        a.click()
                                      }}
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              {isGeneratingPhotos && index === productPhotos.length - 1 && (
                                <div className="absolute top-2 right-2">
                                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                </div>
                              )}
                            </motion.div>
                          ))}
                          {isGeneratingPhotos && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center justify-center h-48 rounded-lg border border-dashed border-purple-500/30 bg-purple-500/5"
                            >
                              <div className="text-center">
                                <Loader2 className="h-6 w-6 animate-spin text-purple-500 mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground">Generating next...</p>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center py-16 text-center"
                        >
                          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                            <Camera className="h-8 w-8 text-muted-foreground/50" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">No photos generated yet</p>
                          <p className="text-xs text-muted-foreground/70">Upload a product image, fill in the details, and click Generate</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Quick Caption Generation */}
                {productPhotos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="card-elevated">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-pink-500" />
                          Quick Caption
                        </CardTitle>
                        <CardDescription>Generate an AI caption for your product</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          placeholder="Your AI-generated caption will appear here..."
                          className="min-h-20"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleGenerateCaption}
                            disabled={isGeneratingCaption}
                            variant="outline"
                            className="flex-1"
                          >
                            {isGeneratingCaption ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4 mr-2" />
                            )}
                            Generate Caption
                          </Button>
                          <Button
                            onClick={handleSuggestHashtags}
                            disabled={isGeneratingHashtags || !caption}
                            variant="outline"
                            className="flex-1"
                          >
                            {isGeneratingHashtags ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Hash className="h-4 w-4 mr-2" />
                            )}
                            Hashtags
                          </Button>
                        </div>
                        {hashtags && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                          >
                            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground flex items-start justify-between gap-2">
                              <span>{hashtags}</span>
                              <button
                                onClick={() => handleCopyCaption(hashtags, -1)}
                                className="shrink-0 p-1 hover:text-foreground transition-colors"
                              >
                                {copiedIndex === -1 ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </motion.div>
                        )}
                        {caption && (
                          <Button
                            onClick={() => setActiveTab("create")}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Continue to Create Post
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* ==================== POSTS TAB ==================== */}
        <TabsContent value="posts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Posts</h2>
            <Button
              onClick={() => setActiveTab("create")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>

          {posts.length === 0 ? (
            <Card className="card-elevated">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Instagram className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-2">No posts yet</p>
                <p className="text-sm text-muted-foreground/70 mb-4">Start by creating professional product photos in the Product Studio</p>
                <Button onClick={() => setActiveTab("product-studio")} variant="outline">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Open Product Studio
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="card-elevated overflow-hidden">
                    {post.image_url && (
                      <CardHeader className="p-0">
                        <img
                          src={post.image_url}
                          alt="Post preview"
                          className="w-full h-48 object-cover"
                        />
                      </CardHeader>
                    )}
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(post.status)}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {post.scheduled_time
                            ? new Date(post.scheduled_time).toLocaleDateString()
                            : new Date(post.created_at).toLocaleDateString()
                          }
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3">{post.caption}</p>

                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.hashtags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {post.status === "posted" && (
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span>{post.engagement_likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4 text-primary" />
                            <span>{post.engagement_comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share className="h-4 w-4 text-emerald-500" />
                            <span>{post.engagement_shares}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ==================== CREATE POST TAB ==================== */}
        <TabsContent value="create" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>Upload media and create engaging content with AI assistance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Show selected product photo if available */}
                {productPhotos.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Product Photo</Label>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {productPhotos.map((photo, i) => (
                        <img
                          key={i}
                          src={photo.imageBase64}
                          alt={photo.style}
                          className="w-24 h-24 rounded-lg object-cover border-2 border-purple-500/30 shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    placeholder="Write your caption here..."
                    className="min-h-32"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGenerateCaption}
                    disabled={isGeneratingCaption}
                  >
                    {isGeneratingCaption ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate AI Caption
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <Input
                    id="hashtags"
                    placeholder="#hashtag1 #hashtag2 #hashtag3"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSuggestHashtags}
                    disabled={isGeneratingHashtags || !caption}
                  >
                    {isGeneratingHashtags ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Hash className="h-4 w-4 mr-2" />
                    )}
                    Suggest Hashtags
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Post Date</Label>
                    <Input
                      type="date"
                      value={postDate}
                      onChange={(e) => setPostDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Post Time</Label>
                    <Input
                      type="time"
                      value={postTime}
                      onChange={(e) => setPostTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleCreatePost}
                  disabled={!caption}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {postDate && postTime ? "Schedule Post" : "Save as Draft"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setActiveTab("product-studio")}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Back to Studio
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== SCHEDULE TAB ==================== */}
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

        {/* ==================== SETTINGS TAB ==================== */}
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
