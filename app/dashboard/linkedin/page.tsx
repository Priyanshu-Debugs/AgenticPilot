"use client"

import { useState, useEffect, useCallback, Suspense, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

// Icons
import {
    Linkedin,
    Loader2,
    RefreshCw,
    Send,
    Sparkles,
    Unplug,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Clock,
    FileEdit,
    Eye,
    Upload,
    X,
    ImageIcon,
    Check,
} from 'lucide-react'

// Types
import type { LinkedInConnection, LinkedInPost, PostTone } from '@/lib/linkedin/types'

// ============================================================
// Types for component state
// ============================================================
interface ConnectionInfo {
    id: string
    linkedin_name: string | null
    linkedin_email: string | null
    linkedin_picture: string | null
    linkedin_person_urn: string
    expires_at: string | null
    updated_at: string
}

// ============================================================
// Main page with Suspense wrapper (matches Gmail pattern)
// ============================================================
export default function LinkedInAutomationPage() {
    return (
        <Suspense fallback={
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-primary" />
                <span className="ml-3">Loading LinkedIn Automation…</span>
            </div>
        }>
            <LinkedInAutomationContent />
        </Suspense>
    )
}

// ============================================================
// Core content component
// ============================================================
function LinkedInAutomationContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Connection state
    const [isConnected, setIsConnected] = useState(false)
    const [connectionLoading, setConnectionLoading] = useState(true)
    const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null)
    const [tokenExpired, setTokenExpired] = useState(false)

    // Post generator state
    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState<PostTone>('professional')
    const [generatedContent, setGeneratedContent] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState('')

    // Posts state
    const [posts, setPosts] = useState<LinkedInPost[]>([])
    const [postsLoading, setPostsLoading] = useState(false)

    // Disconnecting state
    const [disconnecting, setDisconnecting] = useState(false)

    // Image upload state
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // ============================================================
    // Effects
    // ============================================================

    useEffect(() => {
        checkConnection()

        // Handle OAuth callback query params
        const connected = searchParams.get('connected')
        const error = searchParams.get('error')

        if (connected === 'true') {
            toast.success('LinkedIn connected successfully!')
            router.replace('/dashboard/linkedin')
        } else if (error) {
            const errorMessages: Record<string, string> = {
                oauth_denied: 'LinkedIn authorization was denied',
                state_mismatch: 'Security check failed — please try again',
                callback_failed: 'Connection failed — please try again',
                missing_params: 'Invalid callback — please try again',
                unauthorized: 'Please sign in first',
                save_failed: 'Failed to save connection — please try again',
            }
            toast.error(errorMessages[error] || 'Connection failed')
            router.replace('/dashboard/linkedin')
        }
    }, [searchParams, router])

    useEffect(() => {
        if (typeof window !== 'undefined' && !connectionLoading && isConnected && !tokenExpired) {
            const savedDraft = localStorage.getItem('linkedin_draft_copy')
            if (savedDraft) {
                setTopic(savedDraft)
                setGeneratedContent(savedDraft)
                setEditContent(savedDraft)
                setIsEditing(true)
                localStorage.removeItem('linkedin_draft_copy')
                toast.info('Loaded post draft from Social Listening Agent!')
            }
        }
    }, [connectionLoading, isConnected, tokenExpired])

    // ============================================================
    // API Calls
    // ============================================================

    const checkConnection = async () => {
        setConnectionLoading(true)
        try {
            const res = await fetch('/api/linkedin/connect')
            const data = await res.json()
            setIsConnected(data.connected)
            setConnectionInfo(data.connection || null)

            if (data.connected && data.connection?.expires_at) {
                const expired = new Date(data.connection.expires_at).getTime() < Date.now()
                setTokenExpired(expired)
            }

            if (data.connected) {
                loadPosts()
            }
        } catch (err) {
            console.error('Connection check failed:', err)
        } finally {
            setConnectionLoading(false)
        }
    }

    const handleConnect = async () => {
        try {
            const res = await fetch('/api/linkedin/connect', { method: 'POST' })
            const data = await res.json()

            if (data.authUrl) {
                window.location.href = data.authUrl
            } else {
                toast.error('Failed to get authorization URL')
            }
        } catch (err) {
            toast.error('Connection failed')
        }
    }

    const handleDisconnect = async () => {
        setDisconnecting(true)
        try {
            const res = await fetch('/api/linkedin/disconnect', { method: 'DELETE' })
            const data = await res.json()

            if (data.success) {
                setIsConnected(false)
                setConnectionInfo(null)
                setTokenExpired(false)
                setGeneratedContent('')
                setPosts([])
                toast.success('LinkedIn disconnected')
            } else {
                toast.error('Disconnect failed')
            }
        } catch (err) {
            toast.error('Disconnect failed')
        } finally {
            setDisconnecting(false)
        }
    }

    const loadPosts = useCallback(async () => {
        setPostsLoading(true)
        try {
            const res = await fetch('/api/linkedin/posts')
            const data = await res.json()
            setPosts(data.posts || [])
        } catch (err) {
            console.error('Failed to load posts:', err)
        } finally {
            setPostsLoading(false)
        }
    }, [])

    // ============================================================
    // Image Drag & Drop and Upload handlers
    // ============================================================
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
        // Validate type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Allowed: JPEG, PNG, WebP, GIF')
            return
        }

        // Validate size (max 10MB)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            toast.error('File too large. Maximum size is 10MB')
            return
        }

        // Render preview immediately
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreviewImage(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/linkedin/upload-image', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error)
            }

            setUploadedImageUrl(data.imageUrl)
            toast.success('Image ready for post!')
        } catch (err: any) {
            console.error('LinkedIn image upload failed:', err)
            toast.error(err.message || 'Failed to upload image')
            setPreviewImage(null)
            setUploadedImageUrl(null)
        } finally {
            setIsUploading(false)
        }
    }

    const clearPreview = () => {
        setPreviewImage(null)
        setUploadedImageUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a topic for your post')
            return
        }

        setIsGenerating(true)
        setGeneratedContent('')
        setIsEditing(false)

        try {
            const res = await fetch('/api/linkedin/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    tone,
                    aiGenerate: true,
                    imageUrl: uploadedImageUrl || undefined,
                }),
            })

            const data = await res.json()

            if (data.error) {
                throw new Error(data.error)
            }

            setGeneratedContent(data.content)
            setEditContent(data.content)
            toast.success('Post generated and published!')
            setUploadedImageUrl(null)
            setPreviewImage(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            loadPosts()
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to generate post'
            toast.error(message)
        } finally {
            setIsGenerating(false)
        }
    }

    const handlePublish = async () => {
        const content = isEditing ? editContent : generatedContent

        if (!content.trim()) {
            toast.error('No content to publish')
            return
        }

        setIsPosting(true)

        try {
            const res = await fetch('/api/linkedin/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aiGenerate: false,
                    content,
                    tone,
                    imageUrl: uploadedImageUrl || undefined,
                }),
            })

            const data = await res.json()

            if (data.error) {
                throw new Error(data.error)
            }

            toast.success('Posted to LinkedIn!')
            setGeneratedContent('')
            setEditContent('')
            setTopic('')
            setIsEditing(false)
            setUploadedImageUrl(null)
            setPreviewImage(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            loadPosts()
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to publish'
            toast.error(message)
        } finally {
            setIsPosting(false)
        }
    }

    // ============================================================
    // Helpers
    // ============================================================

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <CheckCircle2 className="size-3 mr-1" />
                        Published
                    </Badge>
                )
            case 'failed':
                return (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        <XCircle className="size-3 mr-1" />
                        Failed
                    </Badge>
                )
            case 'draft':
                return (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        <Clock className="size-3 mr-1" />
                        Draft
                    </Badge>
                )
            case 'scheduled':
                return (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        <Clock className="size-3 mr-1" />
                        Scheduled
                    </Badge>
                )
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const formatRelativeTime = (dateString: string): string => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString()
    }

    const currentContent = isEditing ? editContent : generatedContent
    const charCount = currentContent.length

    // ============================================================
    // Render
    // ============================================================

    return (
        <div className="p-4 sm:p-6 flex flex-col gap-y-4 sm:gap-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="gap-y-3 sm:gap-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center gap-x-3 sm:gap-x-4">
                    <div className="size-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                        <Linkedin className="size-5 sm:h-6 sm:w-6 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                            LinkedIn Automation
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            AI-powered post generation and publishing
                        </p>
                    </div>
                </div>
                {isConnected && !tokenExpired && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadPosts}
                        disabled={postsLoading}
                        className="w-full sm:w-auto"
                    >
                        <RefreshCw className={`size-4 mr-2 ${postsLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                )}
            </div>

            {/* Setup Guide */}
            <details className="group border border-border bg-card rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                        <Linkedin className="size-4 text-blue-500" />
                        How to Connect & Use LinkedIn Automation
                    </div>
                    <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                </summary>
                <div className="mt-4 text-sm text-muted-foreground flex flex-col gap-y-2 pl-6 border-l-2 border-blue-500/20 ml-2">
                    <p>1. Go to <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">LinkedIn Developers</a> and create an App.</p>
                    <p>2. Go to the Products tab and add <strong className="text-foreground">Sign In with LinkedIn</strong> and <strong className="text-foreground">Share on LinkedIn</strong>.</p>
                    <p>3. Under Auth, set your OAuth 2.0 redirect URL to: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/linkedin/callback</code></p>
                    <p>4. Add your Client ID and Client Secret in your <strong className="text-foreground">.env.local</strong> file.</p>
                    <p>5. Click <strong className="text-foreground">Connect LinkedIn</strong> below to authorize your account and start generating posts.</p>
                </div>
            </details>

            {/* Loading State */}
            {connectionLoading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <span className="ml-3 text-muted-foreground">Checking connection…</span>
                </div>
            )}

            {/* Token Expired Warning */}
            {!connectionLoading && isConnected && tokenExpired && (
                <Card className="border-amber-500/30 bg-amber-500/5">
                    <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                <AlertTriangle className="size-5 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Token Expired</h3>
                                <p className="text-xs text-muted-foreground">
                                    Your LinkedIn access token has expired. Reconnect to continue posting.
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleConnect} size="sm">
                            Reconnect
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Not Connected State */}
            {!connectionLoading && !isConnected && (
                <Card className="border-dashed">
                    <CardContent className="py-12 sm:py-16 px-4 sm:px-6 text-center">
                        <div className="size-20 mx-auto mb-6 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                            <Linkedin className="size-10 text-blue-500" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">
                            Connect Your LinkedIn Account
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-6">
                            Connect your LinkedIn account to generate AI-powered posts,
                            publish directly, and track your content performance.
                        </p>
                        <Button onClick={handleConnect} size="lg" className="gap-2">
                            <Linkedin className="size-5" />
                            Connect LinkedIn Account
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Connected State */}
            {!connectionLoading && isConnected && !tokenExpired && (
                <div className="flex flex-col gap-y-4 sm:gap-y-6">
                    {/* Profile Row */}
                    <Card className="card-elevated">
                        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {connectionInfo?.linkedin_picture ? (
                                    <img
                                        src={connectionInfo.linkedin_picture}
                                        alt={connectionInfo.linkedin_name || 'LinkedIn profile'}
                                        className="size-12 rounded-full border-2 border-blue-500/30 shrink-0"
                                    />
                                ) : (
                                    <div className="size-12 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                                        <Linkedin className="size-6 text-blue-500" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-sm sm:text-base truncate">
                                            {connectionInfo?.linkedin_name || 'LinkedIn User'}
                                        </h3>
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                            Connected
                                        </Badge>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                        {connectionInfo?.linkedin_email || ''}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDisconnect}
                                disabled={disconnecting}
                                className="w-full sm:w-auto text-destructive hover:text-destructive"
                            >
                                {disconnecting ? (
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                ) : (
                                    <Unplug className="size-4 mr-2" />
                                )}
                                Disconnect
                            </Button>
                        </CardContent>
                    </Card>

                    {/* AI Post Generator */}
                    <Card className="card-elevated border-blue-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="size-5 text-blue-500" />
                                AI Post Generator
                            </CardTitle>
                            <CardDescription>
                                Generate professional LinkedIn posts powered by Gemini AI
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-y-4">
                            {/* Topic Input */}
                            <div className="flex flex-col gap-y-2">
                                <label className="text-sm font-medium" htmlFor="linkedin-topic">
                                    Topic
                                </label>
                                <Textarea
                                    id="linkedin-topic"
                                    placeholder="What do you want to post about? e.g., 'The future of AI in software development'"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    rows={3}
                                    className="bg-muted/30 border-border/50"
                                />
                            </div>

                            {/* Tone Selector */}
                            <div className="flex flex-col gap-y-2">
                                <label className="text-sm font-medium">Tone</label>
                                <Select
                                    value={tone}
                                    onValueChange={(v) => setTone(v as PostTone)}
                                >
                                    <SelectTrigger className="w-full sm:w-64 bg-muted/30 border-border/50">
                                        <SelectValue placeholder="Select tone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="casual">Casual</SelectItem>
                                        <SelectItem value="inspirational">Inspirational</SelectItem>
                                        <SelectItem value="educational">Educational</SelectItem>
                                        <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Image Upload */}
                            <div className="flex flex-col gap-y-2">
                                <label className="text-sm font-medium">Post Image (Optional)</label>
                                {previewImage ? (
                                    <div className="relative group rounded-lg overflow-hidden border border-border/50 max-w-md bg-muted/20">
                                        <img
                                            src={previewImage}
                                            alt="Post image preview"
                                            className="w-full h-48 object-contain bg-black/10"
                                        />
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-background/85 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Loader2 className="size-6 animate-spin text-blue-500 mx-auto mb-2" />
                                                    <p className="text-xs text-muted-foreground">Uploading image…</p>
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={clearPreview}
                                            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-slate-200 hover:bg-slate-900 hover:text-white transition-colors"
                                            aria-label="Remove image"
                                        >
                                            <X className="size-4" />
                                        </button>
                                        {uploadedImageUrl && !isUploading && (
                                            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-medium">
                                                <Check className="size-3" />
                                                Ready to post
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border border-dashed rounded-lg p-6 text-center transition-all cursor-pointer bg-muted/10 ${
                                            dragActive
                                                ? 'border-blue-500 bg-blue-500/5'
                                                : 'border-border/50 hover:border-blue-500/50 hover:bg-muted/20'
                                        }`}
                                    >
                                        <Upload className={`size-8 mx-auto mb-2 ${dragActive ? 'text-blue-500 animate-bounce' : 'text-muted-foreground'}`} />
                                        <p className="text-sm font-medium text-muted-foreground mb-0.5">
                                            Drag and drop an image, or click to browse
                                        </p>
                                        <p className="text-xs text-muted-foreground/60">
                                            Supports PNG, JPEG, WebP, GIF (Max 10MB)
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Generate Button */}
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !topic.trim()}
                                className="gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Generating & Publishing…
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="size-4" />
                                        Generate with AI
                                    </>
                                )}
                            </Button>

                            {/* Post Preview / Editor */}
                            {generatedContent && (
                                <div className="flex flex-col gap-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium flex items-center gap-2">
                                            {isEditing ? (
                                                <>
                                                    <FileEdit className="size-4" />
                                                    Edit Post
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="size-4" />
                                                    Post Preview
                                                </>
                                            )}
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs ${charCount > 3000 ? 'text-red-400' : 'text-muted-foreground'}`}>
                                                {charCount} / 3000
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">Edit</span>
                                                <Switch
                                                    checked={isEditing}
                                                    onCheckedChange={(checked) => {
                                                        setIsEditing(checked)
                                                        if (checked) {
                                                            setEditContent(generatedContent)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <div className="flex flex-col gap-y-3">
                                            <Textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                rows={8}
                                                className="bg-muted/30 border-border/50 font-mono text-sm"
                                            />
                                            {previewImage && (
                                                <div className="rounded border border-border/40 overflow-hidden bg-black/10 max-h-60 flex items-center justify-center max-w-md">
                                                    <img
                                                        src={previewImage}
                                                        alt="LinkedIn Post attachment preview"
                                                        className="max-h-60 object-contain w-full"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg bg-muted/30 border border-border/50 p-4 flex flex-col gap-y-3">
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                                {generatedContent}
                                            </p>
                                            {previewImage && (
                                                <div className="rounded border border-border/40 overflow-hidden bg-black/10 max-h-60 flex items-center justify-center">
                                                    <img
                                                        src={previewImage}
                                                        alt="LinkedIn Post attachment preview"
                                                        className="max-h-60 object-contain w-full"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            onClick={handlePublish}
                                            disabled={isPosting || charCount === 0}
                                            className="gap-2"
                                        >
                                            {isPosting ? (
                                                <>
                                                    <Loader2 className="size-4 animate-spin" />
                                                    Publishing…
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="size-4" />
                                                    Post to LinkedIn
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleGenerate}
                                            disabled={isGenerating || !topic.trim()}
                                            className="gap-2"
                                        >
                                            <RefreshCw className={`size-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                            Regenerate
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Posts */}
                    <Card className="card-elevated">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="size-5" />
                                Recent Posts
                            </CardTitle>
                            <CardDescription>
                                Your latest LinkedIn posts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {postsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                                    <span className="ml-2 text-sm text-muted-foreground">Loading posts…</span>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground">
                                        No posts yet. Use the AI Post Generator above to create your first post!
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-y-3">
                                    {posts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="rounded-lg border border-border/50 bg-muted/20 p-4 flex flex-col gap-y-2 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="text-sm leading-relaxed line-clamp-3 flex-1">
                                                    {post.content}
                                                </p>
                                                {getStatusBadge(post.status)}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span>{formatRelativeTime(post.created_at)}</span>
                                                {post.ai_generated && (
                                                    <Badge variant="outline" className="text-xs py-0">
                                                        <Sparkles className="size-3 mr-1" />
                                                        AI Generated
                                                    </Badge>
                                                )}
                                                {post.tone && (
                                                    <span className="capitalize">{post.tone}</span>
                                                )}
                                                {post.error_message && (
                                                    <span className="text-red-400 truncate max-w-[200px]" title={post.error_message}>
                                                        {post.error_message}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
