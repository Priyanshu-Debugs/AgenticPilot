"use client"

import { useState, useEffect, useCallback, Suspense } from 'react'
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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3">Loading LinkedIn Automation...</span>
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
                }),
            })

            const data = await res.json()

            if (data.error) {
                throw new Error(data.error)
            }

            setGeneratedContent(data.content)
            setEditContent(data.content)
            toast.success('Post generated and published!')
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
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Published
                    </Badge>
                )
            case 'failed':
                return (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        <XCircle className="h-3 w-3 mr-1" />
                        Failed
                    </Badge>
                )
            case 'draft':
                return (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        <Clock className="h-3 w-3 mr-1" />
                        Draft
                    </Badge>
                )
            case 'scheduled':
                return (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        <Clock className="h-3 w-3 mr-1" />
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
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                        <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
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
                        <RefreshCw className={`h-4 w-4 mr-2 ${postsLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                )}
            </div>

            {/* Loading State */}
            {connectionLoading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-3 text-muted-foreground">Checking connection...</span>
                </div>
            )}

            {/* Token Expired Warning */}
            {!connectionLoading && isConnected && tokenExpired && (
                <Card className="border-amber-500/30 bg-amber-500/5">
                    <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
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
                        <div className="w-20 h-20 mx-auto mb-6 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                            <Linkedin className="h-10 w-10 text-blue-500" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">
                            Connect Your LinkedIn Account
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-6">
                            Connect your LinkedIn account to generate AI-powered posts,
                            publish directly, and track your content performance.
                        </p>
                        <Button onClick={handleConnect} size="lg" className="gap-2">
                            <Linkedin className="h-5 w-5" />
                            Connect LinkedIn Account
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Connected State */}
            {!connectionLoading && isConnected && !tokenExpired && (
                <div className="space-y-4 sm:space-y-6">
                    {/* Profile Row */}
                    <Card className="card-elevated">
                        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {connectionInfo?.linkedin_picture ? (
                                    <img
                                        src={connectionInfo.linkedin_picture}
                                        alt={connectionInfo.linkedin_name || 'LinkedIn profile'}
                                        className="w-12 h-12 rounded-full border-2 border-blue-500/30 shrink-0"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                                        <Linkedin className="h-6 w-6 text-blue-500" />
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
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Unplug className="h-4 w-4 mr-2" />
                                )}
                                Disconnect
                            </Button>
                        </CardContent>
                    </Card>

                    {/* AI Post Generator */}
                    <Card className="card-elevated border-blue-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-blue-500" />
                                AI Post Generator
                            </CardTitle>
                            <CardDescription>
                                Generate professional LinkedIn posts powered by Gemini AI
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Topic Input */}
                            <div className="space-y-2">
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
                            <div className="space-y-2">
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

                            {/* Generate Button */}
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !topic.trim()}
                                className="gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generating & Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        Generate with AI
                                    </>
                                )}
                            </Button>

                            {/* Post Preview / Editor */}
                            {generatedContent && (
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium flex items-center gap-2">
                                            {isEditing ? (
                                                <>
                                                    <FileEdit className="h-4 w-4" />
                                                    Edit Post
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="h-4 w-4" />
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
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={8}
                                            className="bg-muted/30 border-border/50 font-mono text-sm"
                                        />
                                    ) : (
                                        <div className="rounded-lg bg-muted/30 border border-border/50 p-4">
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                                {generatedContent}
                                            </p>
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
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Publishing...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4" />
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
                                            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
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
                                <Clock className="h-5 w-5" />
                                Recent Posts
                            </CardTitle>
                            <CardDescription>
                                Your latest LinkedIn posts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {postsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    <span className="ml-2 text-sm text-muted-foreground">Loading posts...</span>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground">
                                        No posts yet. Use the AI Post Generator above to create your first post!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {posts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2 transition-colors hover:bg-muted/30"
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
                                                        <Sparkles className="h-3 w-3 mr-1" />
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
