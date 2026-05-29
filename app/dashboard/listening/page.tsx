"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Recharts imports for premium visualization
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Icons
import {
    TrendingUp,
    Bot,
    Sparkles,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    RefreshCw,
    ArrowRight,
    Send,
    Eye,
    Check,
    Copy,
    Flame,
    Activity,
} from 'lucide-react'

// Trend Types
interface TrendMetric {
    keyword: string
    trendingScore: number
    sentiment: 'positive' | 'neutral' | 'critical'
    explanation: string
}

interface SuggestedPost {
    trendKeyword: string
    title: string
    contentDraft: string
    platform: 'linkedin' | 'twitter'
}

interface TrendAnalysisData {
    id: string
    summary: string
    buzz_score: number
    keywords: string[]
    trend_metrics: TrendMetric[]
    suggested_posts: SuggestedPost[]
    created_at: string
}

export default function SocialListeningPage() {
    const router = useRouter()
    
    // States
    const [data, setData] = useState<TrendAnalysisData | null>(null)
    const [loading, setLoading] = useState(true)
    const [scanning, setScanning] = useState(false)
    const [scanStep, setScanStep] = useState(0) // 0: Idle, 1: Scrape, 2: LangGraph, 3: AI Drafts
    const [selectedTrend, setSelectedTrend] = useState<TrendMetric | null>(null)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [customKeyword, setCustomKeyword] = useState('')
    const [keywordsList, setKeywordsList] = useState<string[]>(['Next.js', 'React Compiler', 'AI Agents'])
    const [dbWarning, setDbWarning] = useState<string | null>(null)

    // Load initial data
    useEffect(() => {
        loadLatestTrends()
    }, [])

    const loadLatestTrends = async () => {
        setLoading(true)
        setDbWarning(null)
        try {
            const res = await fetch('/api/listening/trends')
            const result = await res.json()
            
            if (result.warning) {
                setDbWarning(result.warning)
            }

            if (result.success && result.data) {
                setData(result.data)
                // Select first trend by default
                if (result.data.trend_metrics && result.data.trend_metrics.length > 0) {
                    setSelectedTrend(result.data.trend_metrics[0])
                }
            }
        } catch (err) {
            console.error('Failed to load trends:', err)
            toast.error('Failed to retrieve social trends')
        } finally {
            setLoading(false)
        }
    }

    // Trigger LangGraph workflow
    const handleTriggerScan = async () => {
        setScanning(true)
        setScanStep(1) // Scrape Node
        setDbWarning(null)

        // Visual simulation of LangGraph node transitions
        const step1Timer = setTimeout(() => setScanStep(2), 2000) // Sentiment Node
        const step2Timer = setTimeout(() => setScanStep(3), 4000) // Copywriting Node

        try {
            const res = await fetch('/api/listening/trends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: keywordsList }),
            })

            const result = await res.json()

            if (result.warning) {
                setDbWarning(result.warning)
            }

            if (result.success && result.data) {
                clearTimeout(step1Timer)
                clearTimeout(step2Timer)
                setScanStep(3)
                
                // Extra brief timeout to let user appreciate the loading complete animation
                await new Promise(resolve => setTimeout(resolve, 800))
                
                setData(result.data)
                toast.success('Social listening analysis completed via LangGraph!')
                
                if (result.data.trend_metrics && result.data.trend_metrics.length > 0) {
                    setSelectedTrend(result.data.trend_metrics[0])
                }
            } else {
                throw new Error(result.error || 'Scan failed')
            }
        } catch (err: any) {
            console.error('Scan trigger failed:', err)
            toast.error(err.message || 'Failed to complete trend analysis')
        } finally {
            clearTimeout(step1Timer)
            clearTimeout(step2Timer)
            setScanning(false)
            setScanStep(0)
        }
    }

    // Add search topic keywords
    const handleAddKeyword = () => {
        const trimmed = customKeyword.trim()
        if (!trimmed) return
        if (keywordsList.includes(trimmed)) {
            toast.error('Keyword already monitored')
            return
        }
        if (keywordsList.length >= 5) {
            toast.error('Maximum 5 keywords can be monitored on free tier')
            return
        }
        setKeywordsList([...keywordsList, trimmed])
        setCustomKeyword('')
        toast.success(`Monitoring topic: "${trimmed}"`)
    }

    const handleRemoveKeyword = (keyword: string) => {
        setKeywordsList(keywordsList.filter(k => k !== keyword))
        toast.info(`Removed topic: "${keyword}"`)
    }

    // Action integration copy-redirects
    const handleSendToLinkedIn = (draftText: string) => {
        localStorage.setItem('linkedin_draft_copy', draftText)
        navigator.clipboard.writeText(draftText)
        toast.success('Draft copy copied! Redirecting to LinkedIn generator...')
        router.push('/dashboard/linkedin')
    }

    const handleCopyText = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        toast.success('Copied draft copy to clipboard!')
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    // Get color badge based on sentiment string
    const getSentimentBadge = (sentiment: string) => {
        switch (sentiment) {
            case 'positive':
                return (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-medium">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Positive
                    </Badge>
                )
            case 'critical':
                return (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-medium">
                        <XCircle className="h-3 w-3 mr-1" />
                        Critical
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 font-medium">
                        <Activity className="h-3 w-3 mr-1" />
                        Neutral
                    </Badge>
                )
        }
    }

    // Prepare chart data representing search score metrics
    const chartData = data?.trend_metrics.map(trend => ({
        name: trend.keyword,
        buzz: trend.trendingScore,
        sentiment: trend.sentiment === 'positive' ? 85 : trend.sentiment === 'critical' ? 30 : 60
    })) || [
        { name: 'Next.js', buzz: 75, sentiment: 70 },
        { name: 'React Compiler', buzz: 85, sentiment: 80 },
        { name: 'AI Agents', buzz: 90, sentiment: 90 },
    ]

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                            Social Listening Agent
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            LangGraph state machine tracking trending developer insights and AI copywriting suggestions
                        </p>
                    </div>
                </div>
                {!scanning && (
                    <Button
                        onClick={handleTriggerScan}
                        disabled={loading}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2 shrink-0"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Trigger Live Scan
                    </Button>
                )}
            </div>

            {/* Supabase Schema warning banner */}
            {dbWarning && (
                <Card className="border-amber-500/30 bg-amber-500/5">
                    <CardContent className="flex items-start gap-4 py-4">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-sm text-amber-400">Database Table Migration Required</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {dbWarning}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Keyword Monitor Settings Card */}
            <Card className="bg-muted/10 border-border/50">
                <CardHeader className="py-4">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Bot className="h-4 w-4 text-blue-500" />
                        Niche Topic Settings
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Configure keywords parsed by the LangGraph fetch node to gather targeted feed posts
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                            <Input
                                placeholder="Add custom topic (e.g. Next.js, WebAssembly)"
                                value={customKeyword}
                                onChange={(e) => setCustomKeyword(e.target.value)}
                                className="bg-background border-border/50 text-sm"
                                disabled={scanning}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                            />
                        </div>
                        <Button onClick={handleAddKeyword} disabled={scanning} variant="outline" size="sm" className="font-medium shrink-0">
                            Monitor Topic
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {keywordsList.map((tag) => (
                            <Badge 
                                key={tag} 
                                className="bg-slate-900 border border-border/50 text-slate-300 gap-1 text-xs py-1 px-2.5 font-normal rounded-full"
                            >
                                {tag}
                                {!scanning && (
                                    <button 
                                        onClick={() => handleRemoveKeyword(tag)}
                                        className="text-muted-foreground hover:text-white shrink-0 ml-1 transition-colors"
                                    >
                                        &times;
                                    </button>
                                )}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Multi-step loading bar based on LangGraph nodes execution */}
            {scanning && (
                <Card className="border-blue-500/20 bg-blue-500/5">
                    <CardContent className="py-8 text-center space-y-6">
                        <div className="relative w-16 h-16 mx-auto">
                            <div className="w-16 h-16 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
                            <Bot className="h-6 w-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold">LangGraph Execution In Progress</h3>
                            <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                The agent is currently transitioning through execution graph nodes. Please wait.
                            </p>
                        </div>
                        
                        {/* Step items */}
                        <div className="max-w-xl mx-auto grid grid-cols-3 gap-2 pt-2">
                            {[
                                { step: 1, title: 'Fetch & Scrape Feed', desc: 'RSS & Subreddits' },
                                { step: 2, title: 'Analyze Sentiment', desc: 'Gemini buzz model' },
                                { step: 3, title: 'Draft Copy drafts', desc: 'Social posts copywriting' },
                            ].map((s) => {
                                const isCurrent = scanStep === s.step
                                const isPassed = scanStep > s.step
                                return (
                                    <div 
                                        key={s.step} 
                                        className={`p-3 rounded-lg border text-center transition-all ${
                                            isCurrent 
                                                ? 'border-blue-500 bg-blue-500/10' 
                                                : isPassed 
                                                    ? 'border-emerald-500/30 bg-emerald-500/5' 
                                                    : 'border-border/40 bg-muted/5'
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-1.5 mb-1">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                                isCurrent 
                                                    ? 'bg-blue-500 text-white' 
                                                    : isPassed 
                                                        ? 'bg-emerald-500 text-white' 
                                                        : 'bg-muted text-muted-foreground'
                                            }`}>
                                                {s.step}
                                            </span>
                                            <span className="text-xs font-semibold block truncate">
                                                {s.title}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground block truncate">
                                            {isCurrent ? 'Processing...' : isPassed ? 'Completed' : s.desc}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Core Data Dash (Loading & No Data States) */}
            {!scanning && (loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-muted-foreground text-sm font-medium">Running trend parser...</span>
                </div>
            ) : !data ? (
                <Card className="border-dashed py-12 text-center">
                    <CardContent className="space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Bot className="h-8 w-8 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">No Trend Analysis Available</h3>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                                Trigger a real-time scan using the button above to execute the LangGraph state machine agent.
                            </p>
                        </div>
                        <Button onClick={handleTriggerScan} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
                            <RefreshCw className="h-3.5 w-3.5" />
                            Trigger Agent Scan
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4 sm:space-y-6">
                    {/* Executive Summary Card */}
                    <Card className="bg-muted/10 border-border/50">
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                AI Trend Intelligence Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                {data.summary}
                            </p>
                            <div className="flex items-center gap-4 flex-wrap mt-4 text-xs text-muted-foreground border-t border-border/50 pt-4">
                                <div>
                                    Overall Buzz Score: <span className="font-semibold text-blue-400">{data.buzz_score}/100</span>
                                </div>
                                <span className="text-border/80">•</span>
                                <div>
                                    Scan Run: <span className="font-semibold">{new Date(data.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chart Visualization Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Recharts Trend buzz volume */}
                        <Card className="lg:col-span-2 bg-muted/10 border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-blue-500" />
                                    Trend Score metrics
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Volume scoring per trending topic detected in raw feeds
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-64 pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3d" vertical={false} />
                                        <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                                        <YAxis stroke="#6b7280" fontSize={11} tickLine={false} domain={[0, 100]} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                            labelStyle={{ fontWeight: 'bold' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="buzz" 
                                            stroke="#3b82f6" 
                                            fill="#3b82f6" 
                                            fillOpacity={0.1} 
                                            strokeWidth={2.5}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top Buzz indicators */}
                        <Card className="bg-muted/10 border-border/50 flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Flame className="h-4 w-4 text-red-500" />
                                    Niche Hot Topics
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Ecosystem interest rating from scrape parser
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-center space-y-3 pt-2">
                                {data.trend_metrics.slice(0, 3).map((item, index) => (
                                    <div 
                                        key={item.keyword}
                                        onClick={() => setSelectedTrend(item)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                            selectedTrend?.keyword === item.keyword 
                                                ? 'border-blue-500 bg-blue-500/5' 
                                                : 'border-border/40 hover:bg-muted/20'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <span className="text-xs font-semibold truncate block">
                                                {item.keyword}
                                            </span>
                                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-medium text-[10px] py-0 px-2">
                                                Score {item.trendingScore}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getSentimentBadge(item.sentiment)}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Lower Detail panels & AI Post suggestions */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                        {/* Topic list */}
                        <div className="lg:col-span-5 space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
                                Identified Trends
                            </h3>
                            <div className="space-y-2">
                                {data.trend_metrics.map((item) => (
                                    <div
                                        key={item.keyword}
                                        onClick={() => setSelectedTrend(item)}
                                        className={`p-4 rounded-lg border text-left cursor-pointer transition-all ${
                                            selectedTrend?.keyword === item.keyword
                                                ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/10'
                                                : 'border-border/50 bg-muted/10 hover:border-blue-500/30'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <h4 className="text-sm font-semibold truncate block text-slate-100">
                                                {item.keyword}
                                            </h4>
                                            <Badge className="bg-slate-900 border border-border/50 text-slate-300 font-medium text-[10px]">
                                                Buzz: {item.trendingScore}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                                            {item.explanation}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {getSentimentBadge(item.sentiment)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Suggested copy drafts for selected trend */}
                        <div className="lg:col-span-7 space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
                                Suggested Post Drafts
                            </h3>
                            {selectedTrend ? (
                                <div className="space-y-3">
                                    {data.suggested_posts.filter(p => p.trendKeyword === selectedTrend.keyword).length === 0 ? (
                                        <Card className="bg-muted/10 border-border/50 py-10 text-center">
                                            <CardContent className="text-xs text-muted-foreground">
                                                No specific social copy drafts configured for this topic keyword.
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        data.suggested_posts
                                            .filter(p => p.trendKeyword === selectedTrend.keyword)
                                            .map((post, idx) => (
                                                <Card key={idx} className="bg-muted/10 border-border/50 overflow-hidden">
                                                    <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border/50 flex flex-row items-center justify-between gap-2">
                                                        <div className="space-y-0.5">
                                                            <CardTitle className="text-xs font-bold text-slate-200">
                                                                {post.title}
                                                            </CardTitle>
                                                        </div>
                                                        <Badge className="bg-blue-600 text-white text-[9px] uppercase font-bold py-0.5 px-2">
                                                            {post.platform}
                                                        </Badge>
                                                    </CardHeader>
                                                    <CardContent className="p-4 space-y-4">
                                                        <div className="rounded bg-black/20 border border-border/40 p-3">
                                                            <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                                                                {post.contentDraft}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Actions */}
                                                        <div className="flex flex-wrap gap-2 pt-1.5">
                                                            {post.platform === 'linkedin' ? (
                                                                <Button
                                                                    onClick={() => handleSendToLinkedIn(post.contentDraft)}
                                                                    size="sm"
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-1.5"
                                                                >
                                                                    <Send className="h-3 w-3" />
                                                                    Send to LinkedIn Generator
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    onClick={() => handleCopyText(post.contentDraft, idx)}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="font-semibold text-xs gap-1.5"
                                                                >
                                                                    {copiedIndex === idx ? (
                                                                        <>
                                                                            <Check className="h-3 w-3 text-emerald-500" />
                                                                            Copied!
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy className="h-3 w-3" />
                                                                            Copy Tweet Thread
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            )}
                                                            {post.platform === 'linkedin' && (
                                                                <Button
                                                                    onClick={() => handleCopyText(post.contentDraft, idx)}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="font-semibold text-xs gap-1.5"
                                                                >
                                                                    {copiedIndex === idx ? (
                                                                        <Check className="h-3 w-3 text-emerald-500" />
                                                                    ) : (
                                                                        <Copy className="h-3 w-3" />
                                                                    )}
                                                                    Copy Text
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                    )}
                                </div>
                            ) : (
                                <Card className="bg-muted/10 border-border/50 py-16 text-center">
                                    <CardContent className="text-xs text-muted-foreground">
                                        Select an identified trend keyword on the left to review its pre-drafted social copies
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
