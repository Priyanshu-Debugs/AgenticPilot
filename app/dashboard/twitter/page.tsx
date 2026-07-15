"use client"

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import {
    Twitter,
    Loader2,
    RefreshCw,
    Send,
    Sparkles,
    Unplug,
    CheckCircle2,
    XCircle,
    Clock,
    FileEdit,
    Eye,
    ExternalLink,
    KeyRound,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'

import type { TwitterConnectionPublic, TwitterTweet, TweetTone } from '@/lib/twitter/types'

export default function TwitterAutomationPage() {
    return (
        <Suspense fallback={
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-primary" />
                <span className="ml-3">Loading X/Twitter Automation…</span>
            </div>
        }>
            <TwitterAutomationContent />
        </Suspense>
    )
}

function TwitterAutomationContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [isConnected, setIsConnected] = useState(false)
    const [connectionLoading, setConnectionLoading] = useState(true)
    const [connectionInfo, setConnectionInfo] = useState<TwitterConnectionPublic | null>(null)
    const [callbackUrl, setCallbackUrl] = useState('')

    const [clientId, setClientId] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [connecting, setConnecting] = useState(false)
    const [showSetup, setShowSetup] = useState(false)

    const [productName, setProductName] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [productUrl, setProductUrl] = useState('')
    const [tone, setTone] = useState<TweetTone>('professional')
    const [generatedContent, setGeneratedContent] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState('')

    const [tweets, setTweets] = useState<TwitterTweet[]>([])
    const [tweetsLoading, setTweetsLoading] = useState(false)
    const [disconnecting, setDisconnecting] = useState(false)

    useEffect(() => {
        checkConnection()

        const connected = searchParams.get('connected')
        const error = searchParams.get('error')

        if (connected === 'true') {
            toast.success('X account connected successfully!')
            router.replace('/dashboard/twitter')
        } else if (error) {
            const errorMessages: Record<string, string> = {
                oauth_denied: 'X authorization was denied',
                state_mismatch: 'Security check failed — please try again',
                callback_failed: 'Connection failed — please try again',
                missing_params: 'Invalid callback — please try again',
                unauthorized: 'Please sign in first',
                save_failed: 'Failed to save connection — please try again',
                missing_verifier: 'PKCE verification failed — please try again',
            }
            toast.error(errorMessages[error] || 'Connection failed')
            router.replace('/dashboard/twitter')
        }
    }, [searchParams, router])

    const checkConnection = async () => {
        setConnectionLoading(true)
        try {
            const res = await fetch('/api/twitter/connect')
            const data = await res.json()
            setIsConnected(data.connected)
            setConnectionInfo(data.connection || null)
            if (data.callbackUrl) setCallbackUrl(data.callbackUrl)
            if (data.connected) loadTweets()
        } catch (err) {
            console.error('Connection check failed:', err)
        } finally {
            setConnectionLoading(false)
        }
    }

    const handleConnect = async () => {
        if (!clientId.trim() || !clientSecret.trim()) {
            toast.error('Please enter your X Client ID and Client Secret')
            return
        }
        setConnecting(true)
        try {
            const res = await fetch('/api/twitter/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId: clientId.trim(), clientSecret: clientSecret.trim() }),
            })
            const data = await res.json()
            if (data.authUrl) {
                window.location.href = data.authUrl
            } else {
                toast.error(data.error || 'Failed to get authorization URL')
            }
        } catch {
            toast.error('Connection failed')
        } finally {
            setConnecting(false)
        }
    }

    const handleDisconnect = async () => {
        setDisconnecting(true)
        try {
            const res = await fetch('/api/twitter/disconnect', { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                setIsConnected(false)
                setConnectionInfo(null)
                setGeneratedContent('')
                setTweets([])
                toast.success('X account disconnected')
            } else {
                toast.error('Disconnect failed')
            }
        } catch {
            toast.error('Disconnect failed')
        } finally {
            setDisconnecting(false)
        }
    }

    const loadTweets = useCallback(async () => {
        setTweetsLoading(true)
        try {
            const res = await fetch('/api/twitter/tweets')
            const data = await res.json()
            setTweets(data.tweets || [])
        } catch (err) {
            console.error('Failed to load tweets:', err)
        } finally {
            setTweetsLoading(false)
        }
    }, [])

    const handleGenerate = async () => {
        if (!productName.trim()) {
            toast.error('Please enter a product name')
            return
        }
        setIsGenerating(true)
        setGeneratedContent('')
        setIsEditing(false)
        try {
            const res = await fetch('/api/twitter/tweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName, productDescription, productUrl: productUrl || undefined, tone, aiGenerate: true,
                }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setGeneratedContent(data.content)
            setEditContent(data.content)
            toast.success('Tweet generated and published!')
            loadTweets()
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to generate tweet'
            toast.error(message)
        } finally {
            setIsGenerating(false)
        }
    }

    const handlePublish = async () => {
        const content = isEditing ? editContent : generatedContent
        if (!content.trim()) { toast.error('No content to publish'); return }
        setIsPosting(true)
        try {
            const res = await fetch('/api/twitter/tweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aiGenerate: false, content, tone }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            toast.success('Posted to X!')
            setGeneratedContent('')
            setEditContent('')
            setProductName('')
            setProductDescription('')
            setProductUrl('')
            setIsEditing(false)
            loadTweets()
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to publish'
            toast.error(message)
        } finally {
            setIsPosting(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return (<Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle2 className="size-3 mr-1" />Published</Badge>)
            case 'failed':
                return (<Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="size-3 mr-1" />Failed</Badge>)
            case 'draft':
                return (<Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><Clock className="size-3 mr-1" />Draft</Badge>)
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const formatRelativeTime = (dateString: string): string => {
        const diffMs = Date.now() - new Date(dateString).getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)
        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return new Date(dateString).toLocaleDateString()
    }

    const currentContent = isEditing ? editContent : generatedContent
    const charCount = currentContent.length

    return (
        <div className="p-4 sm:p-6 flex flex-col gap-y-4 sm:gap-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="gap-y-3 sm:gap-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center gap-x-3 sm:gap-x-4">
                    <div className="size-10 sm:w-12 sm:h-12 bg-sky-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <Twitter className="size-5 sm:h-6 sm:w-6 text-sky-500" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                            X/Twitter Automation
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            AI-powered product tweet generation and publishing
                        </p>
                    </div>
                </div>
                {isConnected && (
                    <Button variant="outline" size="sm" onClick={loadTweets} disabled={tweetsLoading} className="w-full sm:w-auto">
                        <RefreshCw className={`size-4 mr-2 ${tweetsLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                )}
            </div>

            {/* Setup Guide */}
            <details className="group border border-border bg-card rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                        <Twitter className="size-4 text-sky-500" />
                        How to Connect & Use X/Twitter Automation
                    </div>
                    <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                </summary>
                <div className="mt-4 text-sm text-muted-foreground flex flex-col gap-y-2 pl-6 border-l-2 border-sky-500/20 ml-2">
                    <p>1. Go to the <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noreferrer" className="text-sky-500 hover:underline">X Developer Portal</a> and create a Project and App.</p>
                    <p>2. Set up User authentication settings with OAuth 2.0. Type: Web App, App permissions: Read and write.</p>
                    <p>3. Set the Callback URI to <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/twitter/callback</code></p>
                    <p>4. Copy your <strong className="text-foreground">Client ID</strong> and <strong className="text-foreground">Client Secret</strong> into the fields below and click Connect.</p>
                    <p>5. Once connected, use the <strong className="text-foreground">AI Tweet Generator</strong> to create optimized posts.</p>
                </div>
            </details>

            {/* Loading */}
            {connectionLoading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <span className="ml-3 text-muted-foreground">Checking connection…</span>
                </div>
            )}

            {/* Not Connected */}
            {!connectionLoading && !isConnected && (
                <Card className="border-dashed">
                    <CardContent className="py-10 sm:py-14 px-4 sm:px-6">
                        <div className="text-center mb-8">
                            <div className="size-20 mx-auto mb-6 bg-sky-500/10 rounded-2xl flex items-center justify-center">
                                <Twitter className="size-10 text-sky-500" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2">Connect Your X Account</h3>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
                                Connect your X account to generate AI-powered product tweets and publish them directly.
                                You&apos;ll need your own X Developer App credentials.
                            </p>
                        </div>

                        {/* Setup Instructions */}
                        <div className="max-w-lg mx-auto flex flex-col gap-y-6">
                            <button
                                onClick={() => setShowSetup(!showSetup)}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors text-sm font-medium"
                            >
                                <span className="flex items-center gap-2">
                                    <KeyRound className="size-4 text-sky-500" />
                                    How to get your X API credentials
                                </span>
                                {showSetup ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                            </button>

                            {showSetup && (
                                <div className="rounded-lg border border-border/50 bg-muted/20 p-4 flex flex-col gap-y-3 text-sm">
                                    <ol className="list-decimal list-inside flex flex-col gap-y-2 text-muted-foreground">
                                        <li>Go to <a href="https://developer.x.com" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline inline-flex items-center gap-1">developer.x.com <ExternalLink className="size-3" /></a> and create a Project + App</li>
                                        <li>In your App settings, go to <strong className="text-foreground">User Authentication Settings</strong> → Set up</li>
                                        <li>Set App permissions to <strong className="text-foreground">Read and Write</strong></li>
                                        <li>Set Type of App to <strong className="text-foreground">Web App</strong></li>
                                        <li>Set Callback URL to: <code className="px-1.5 py-0.5 rounded bg-muted text-xs text-foreground break-all">{callbackUrl || `${window.location.origin}/api/twitter/callback`}</code></li>
                                        <li>Set Website URL to your site URL</li>
                                        <li>Copy the <strong className="text-foreground">Client ID</strong> and <strong className="text-foreground">Client Secret</strong> below</li>
                                    </ol>
                                    <p className="text-xs text-muted-foreground/70 pt-1">
                                        Note: X API uses pay-per-use pricing (~$0.01/tweet). You control your own costs.
                                    </p>
                                </div>
                            )}

                            {/* Credential Inputs */}
                            <div className="flex flex-col gap-y-4">
                                <div className="flex flex-col gap-y-2">
                                    <Label htmlFor="x-client-id">Client ID</Label>
                                    <Input
                                        id="x-client-id"
                                        placeholder="Paste your X Client ID..."
                                        value={clientId}
                                        onChange={(e) => setClientId(e.target.value)}
                                        className="bg-muted/30 border-border/50"
                                    />
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    <Label htmlFor="x-client-secret">Client Secret</Label>
                                    <Input
                                        id="x-client-secret"
                                        type="password"
                                        placeholder="Paste your X Client Secret..."
                                        value={clientSecret}
                                        onChange={(e) => setClientSecret(e.target.value)}
                                        className="bg-muted/30 border-border/50"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleConnect}
                                disabled={connecting || !clientId.trim() || !clientSecret.trim()}
                                size="lg"
                                className="w-full gap-2"
                            >
                                {connecting ? (
                                    <><Loader2 className="size-4 animate-spin" /> Connecting…</>
                                ) : (
                                    <><Twitter className="size-5" /> Connect X Account</>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Connected State */}
            {!connectionLoading && isConnected && (
                <div className="flex flex-col gap-y-4 sm:gap-y-6">
                    {/* Profile Row */}
                    <Card className="card-elevated">
                        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {connectionInfo?.x_profile_image ? (
                                    <img
                                        src={connectionInfo.x_profile_image}
                                        alt={connectionInfo.x_name || 'X profile'}
                                        className="size-12 rounded-full border-2 border-sky-500/30 shrink-0"
                                    />
                                ) : (
                                    <div className="size-12 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0">
                                        <Twitter className="size-6 text-sky-500" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-sm sm:text-base truncate">
                                            {connectionInfo?.x_name || 'X User'}
                                        </h3>
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                            Connected
                                        </Badge>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                        @{connectionInfo?.x_username || ''}
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
                                {disconnecting ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Unplug className="size-4 mr-2" />}
                                Disconnect
                            </Button>
                        </CardContent>
                    </Card>

                    {/* AI Tweet Generator */}
                    <Card className="card-elevated border-sky-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="size-5 text-sky-500" />
                                AI Tweet Generator
                            </CardTitle>
                            <CardDescription>
                                Generate product tweets powered by Gemini AI
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-y-2">
                                    <Label htmlFor="tweet-product-name">Product Name</Label>
                                    <Input
                                        id="tweet-product-name"
                                        placeholder="e.g. AgenticPilot"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        className="bg-muted/30 border-border/50"
                                    />
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    <Label htmlFor="tweet-product-url">Product URL (optional)</Label>
                                    <Input
                                        id="tweet-product-url"
                                        placeholder="https://your-product.com"
                                        value={productUrl}
                                        onChange={(e) => setProductUrl(e.target.value)}
                                        className="bg-muted/30 border-border/50"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="tweet-product-desc">Product Description</Label>
                                <Textarea
                                    id="tweet-product-desc"
                                    placeholder="Describe your product in a few sentences..."
                                    value={productDescription}
                                    onChange={(e) => setProductDescription(e.target.value)}
                                    rows={2}
                                    className="bg-muted/30 border-border/50"
                                />
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <Label>Tone</Label>
                                <Select value={tone} onValueChange={(v) => setTone(v as TweetTone)}>
                                    <SelectTrigger className="w-full sm:w-64 bg-muted/30 border-border/50">
                                        <SelectValue placeholder="Select tone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="casual">Casual</SelectItem>
                                        <SelectItem value="witty">Witty / Fun</SelectItem>
                                        <SelectItem value="hype">Hype 🔥</SelectItem>
                                        <SelectItem value="educational">Educational</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button onClick={handleGenerate} disabled={isGenerating || !productName.trim()} className="gap-2">
                                {isGenerating ? (
                                    <><Loader2 className="size-4 animate-spin" /> Generating &amp; Publishing…</>
                                ) : (
                                    <><Sparkles className="size-4" /> Generate with AI</>
                                )}
                            </Button>

                            {/* Preview / Editor */}
                            {generatedContent && (
                                <div className="flex flex-col gap-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium flex items-center gap-2">
                                            {isEditing ? <><FileEdit className="size-4" /> Edit Tweet</> : <><Eye className="size-4" /> Tweet Preview</>}
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs ${charCount > 280 ? 'text-red-400' : 'text-muted-foreground'}`}>
                                                {charCount} / 280
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">Edit</span>
                                                <Switch
                                                    checked={isEditing}
                                                    onCheckedChange={(checked) => {
                                                        setIsEditing(checked)
                                                        if (checked) setEditContent(generatedContent)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={4}
                                            className="bg-muted/30 border-border/50 font-mono text-sm"
                                        />
                                    ) : (
                                        <div className="rounded-lg bg-muted/30 border border-border/50 p-4">
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{generatedContent}</p>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2">
                                        <Button onClick={handlePublish} disabled={isPosting || charCount === 0} className="gap-2">
                                            {isPosting ? <><Loader2 className="size-4 animate-spin" /> Publishing…</> : <><Send className="size-4" /> Post to X</>}
                                        </Button>
                                        <Button variant="outline" onClick={handleGenerate} disabled={isGenerating || !productName.trim()} className="gap-2">
                                            <RefreshCw className={`size-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                            Regenerate
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Tweets */}
                    <Card className="card-elevated">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="size-5" />
                                Recent Tweets
                            </CardTitle>
                            <CardDescription>Your latest X posts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {tweetsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                                    <span className="ml-2 text-sm text-muted-foreground">Loading tweets…</span>
                                </div>
                            ) : tweets.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground">
                                        No tweets yet. Use the AI Tweet Generator above to create your first tweet!
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-y-3">
                                    {tweets.map((tweet) => (
                                        <div
                                            key={tweet.id}
                                            className="rounded-lg border border-border/50 bg-muted/20 p-4 flex flex-col gap-y-2 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="text-sm leading-relaxed line-clamp-3 flex-1">{tweet.content}</p>
                                                {getStatusBadge(tweet.status)}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span>{formatRelativeTime(tweet.created_at)}</span>
                                                {tweet.ai_generated && (
                                                    <Badge variant="outline" className="text-xs py-0">
                                                        <Sparkles className="size-3 mr-1" />
                                                        AI Generated
                                                    </Badge>
                                                )}
                                                {tweet.tone && <span className="capitalize">{tweet.tone}</span>}
                                                {tweet.product_name && (
                                                    <span className="truncate max-w-[150px]">{tweet.product_name}</span>
                                                )}
                                                {tweet.error_message && (
                                                    <span className="text-red-400 truncate max-w-[200px]" title={tweet.error_message}>
                                                        {tweet.error_message}
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
