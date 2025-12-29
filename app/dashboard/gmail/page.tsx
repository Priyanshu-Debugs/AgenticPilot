"use client"

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Icons
import {
    Mail,
    RefreshCw,
    Inbox,
    Activity,
    Search,
    Filter,
    Loader2
} from 'lucide-react'

// Gmail Components
import { GmailConnect } from '@/components/gmail/GmailConnect'
import { EmailList } from '@/components/gmail/EmailList'
import { AnalysisResult } from '@/components/gmail/AnalysisResult'
import { ComposeReply } from '@/components/gmail/ComposeReply'
import { ActivityLog } from '@/components/gmail/ActivityLog'

// Types
import type { GmailMessage, EmailAnalysis, GmailLog, GmailStats } from '@/lib/gmail/types'

// Wrapper component for Suspense boundary
export default function GmailAutomationPage() {
    return (
        <Suspense fallback={
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3">Loading Gmail Automation...</span>
            </div>
        }>
            <GmailAutomationContent />
        </Suspense>
    )
}

function GmailAutomationContent() {
    const router = useRouter()

    const searchParams = useSearchParams()

    // Connection state
    const [isConnected, setIsConnected] = useState(false)
    const [connectionLoading, setConnectionLoading] = useState(true)

    // Email state
    const [emails, setEmails] = useState<GmailMessage[]>([])
    const [emailsLoading, setEmailsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [unreadOnly, setUnreadOnly] = useState(false)

    // Analysis state
    const [selectedEmail, setSelectedEmail] = useState<GmailMessage | null>(null)
    const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null)
    const [analyzing, setAnalyzing] = useState(false)

    // Reply state
    const [replyEmail, setReplyEmail] = useState<GmailMessage | null>(null)
    const [replyBody, setReplyBody] = useState('')
    const [sending, setSending] = useState(false)

    // Drawer/Modal state
    const [analysisDrawerOpen, setAnalysisDrawerOpen] = useState(false)
    const [replyModalOpen, setReplyModalOpen] = useState(false)

    // Activity state
    const [logs, setLogs] = useState<GmailLog[]>([])
    const [stats, setStats] = useState<GmailStats>({
        totalProcessed: 0,
        totalReplied: 0,
        avgResponseTime: 0,
        successRate: 100,
    })
    const [logsLoading, setLogsLoading] = useState(false)

    // Check connection status on mount
    useEffect(() => {
        checkConnection()

        // Handle OAuth callback messages
        const success = searchParams.get('success')
        const error = searchParams.get('error')

        if (success === 'connected') {
            toast.success('Gmail connected successfully!')
            router.replace('/dashboard/gmail')
        } else if (error) {
            const errorMessages: Record<string, string> = {
                oauth_denied: 'Gmail authorization was denied',
                session_mismatch: 'Session mismatch - please try again',
                callback_failed: 'Connection failed - please try again',
                missing_params: 'Invalid callback - please try again',
            }
            toast.error(errorMessages[error] || 'Connection failed')
            router.replace('/dashboard/gmail')
        }
    }, [searchParams, router])

    // Check Gmail connection status
    const checkConnection = async () => {
        setConnectionLoading(true)
        try {
            const res = await fetch('/api/gmail/connect')
            const data = await res.json()
            setIsConnected(data.connected)

            if (data.connected) {
                loadEmails()
                loadLogs()
            }
        } catch (error) {
            console.error('Connection check failed:', error)
        } finally {
            setConnectionLoading(false)
        }
    }

    // Connect Gmail account
    const handleConnect = async () => {
        try {
            const res = await fetch('/api/gmail/connect', { method: 'POST' })
            const data = await res.json()

            if (data.authUrl) {
                window.location.href = data.authUrl
            } else {
                toast.error('Failed to get authorization URL')
            }
        } catch (error) {
            toast.error('Connection failed')
        }
    }

    // Disconnect Gmail account
    const handleDisconnect = async () => {
        try {
            await fetch('/api/gmail/disconnect', { method: 'POST' })
            setIsConnected(false)
            setEmails([])
            setAnalysis(null)
            toast.success('Gmail disconnected')
        } catch (error) {
            toast.error('Disconnect failed')
        }
    }

    // Load emails
    const loadEmails = useCallback(async () => {
        setEmailsLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchQuery) params.set('q', searchQuery)
            if (unreadOnly) params.set('unread', 'true')

            const res = await fetch(`/api/gmail/inbox?${params}`)
            const data = await res.json()

            if (data.error) {
                if (data.code === 'NOT_CONNECTED') {
                    setIsConnected(false)
                }
                throw new Error(data.error)
            }

            setEmails(data.emails || [])
        } catch (error: any) {
            toast.error(error.message || 'Failed to load emails')
        } finally {
            setEmailsLoading(false)
        }
    }, [searchQuery, unreadOnly])

    // Load activity logs
    const loadLogs = async () => {
        setLogsLoading(true)
        try {
            const res = await fetch('/api/gmail/logs')
            const data = await res.json()
            setLogs(data.logs || [])
            setStats(data.stats || {
                totalProcessed: 0,
                totalReplied: 0,
                avgResponseTime: 0,
                successRate: 100,
            })
        } catch (error) {
            console.error('Failed to load logs:', error)
        } finally {
            setLogsLoading(false)
        }
    }

    // Analyze email
    const handleAnalyze = async (email: GmailMessage) => {
        setSelectedEmail(email)
        setAnalyzing(true)
        setAnalysis(null)
        setAnalysisDrawerOpen(true) // Open drawer

        try {
            const res = await fetch('/api/gmail/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailId: email.id }),
            })

            const data = await res.json()

            if (data.error) {
                throw new Error(data.error)
            }

            setAnalysis(data.analysis)
            toast.success('Analysis complete!')
            loadLogs() // Refresh logs
        } catch (error: any) {
            toast.error(error.message || 'Analysis failed')
        } finally {
            setAnalyzing(false)
        }
    }

    // Open reply dialog
    const handleOpenReply = (email: GmailMessage) => {
        setReplyEmail(email)
        setReplyBody(analysis?.suggestedReply || '')
        setReplyModalOpen(true) // Open modal
    }

    // Generate AI reply
    const generateAIReply = async (tone: string): Promise<string> => {
        if (!replyEmail) return ''

        try {
            const res = await fetch('/api/gmail/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailId: replyEmail.id,
                    tone,
                    generateReplyOnly: true
                }),
            })

            const data = await res.json()
            return data.reply || ''
        } catch (error) {
            toast.error('Failed to generate reply')
            return ''
        }
    }

    // Send reply
    const handleSendReply = async (data: { to: string; subject: string; message: string }) => {
        setSending(true)
        try {
            const res = await fetch('/api/gmail/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    replyToId: replyEmail?.id,
                    threadId: replyEmail?.threadId,
                }),
            })

            const result = await res.json()

            if (result.error) {
                throw new Error(result.error)
            }

            toast.success('Reply sent successfully!')
            setReplyEmail(null)
            setReplyBody('')
            setReplyModalOpen(false) // Close modal
            loadEmails() // Refresh inbox
            loadLogs() // Refresh logs
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reply')
        } finally {
            setSending(false)
        }
    }

    // Use suggested reply
    const useSuggestedReply = (reply: string) => {
        if (selectedEmail) {
            setReplyEmail(selectedEmail)
            setReplyBody(reply)
            setReplyModalOpen(true) // Open reply modal
            setAnalysisDrawerOpen(false) // Close analysis drawer
        }
    }

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
            {/* Header - stacks vertically on mobile */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                        <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
                        <span>Gmail Automation</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        AI-powered email analysis and automated responses
                    </p>
                </div>
                {isConnected && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { loadEmails(); loadLogs(); }}
                        disabled={emailsLoading}
                        className="w-full sm:w-auto"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${emailsLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                )}
            </div>

            {/* Connection Card */}
            <GmailConnect
                isConnected={isConnected}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                loading={connectionLoading}
                onAutomationComplete={() => { loadEmails(); loadLogs(); }}
            />

            {/* Main Content */}
            {isConnected && (
                <Tabs defaultValue="inbox" className="space-y-4">
                    <TabsList className="w-full sm:w-auto">
                        <TabsTrigger value="inbox" className="gap-1.5 sm:gap-2 flex-1 sm:flex-none">
                            <Inbox className="h-4 w-4" />
                            <span>Inbox</span>
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="gap-1.5 sm:gap-2 flex-1 sm:flex-none">
                            <Activity className="h-4 w-4" />
                            <span>Activity</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="inbox" className="space-y-4">
                        {/* Search and Filters - stacks on mobile */}
                        <Card>
                            <CardContent className="p-3 sm:p-4">
                                <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search emails..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 h-9"
                                            onKeyDown={(e) => e.key === 'Enter' && loadEmails()}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={unreadOnly ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => {
                                                setUnreadOnly(!unreadOnly)
                                                setTimeout(loadEmails, 100)
                                            }}
                                            className="flex-1 sm:flex-none gap-1.5"
                                        >
                                            <Filter className="h-4 w-4" />
                                            <span className="hidden sm:inline">Unread only</span>
                                            <span className="sm:hidden">Unread</span>
                                        </Button>
                                        <Button
                                            onClick={loadEmails}
                                            disabled={emailsLoading}
                                            size="sm"
                                            className="flex-1 sm:flex-none"
                                        >
                                            {emailsLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                'Search'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Email List - Full Width */}
                        <div className="max-w-4xl mx-auto">
                            <EmailList
                                emails={emails}
                                loading={emailsLoading}
                                onAnalyze={handleAnalyze}
                                onReply={handleOpenReply}
                                selectedId={selectedEmail?.id}
                            />
                        </div>

                        {/* Analysis Drawer */}
                        <Sheet open={analysisDrawerOpen} onOpenChange={setAnalysisDrawerOpen}>
                            <SheetContent className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Email Analysis</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4">
                                    <AnalysisResult
                                        analysis={analysis}
                                        loading={analyzing}
                                        onUseReply={useSuggestedReply}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Reply Modal */}
                        <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                {replyEmail && (
                                    <ComposeReply
                                        email={replyEmail}
                                        initialBody={replyBody}
                                        onSend={handleSendReply}
                                        onGenerateAI={generateAIReply}
                                        onClose={() => setReplyModalOpen(false)}
                                        sending={sending}
                                    />
                                )}
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    <TabsContent value="activity">
                        <ActivityLog
                            logs={logs}
                            stats={stats}
                            loading={logsLoading}
                        />
                    </TabsContent>
                </Tabs>
            )}

            {/* Not Connected State */}
            {!connectionLoading && !isConnected && (
                <Card className="border-dashed">
                    <CardContent className="py-8 sm:py-12 px-4 sm:px-6 text-center">
                        <Mail className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground/30" />
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">Connect Your Gmail</h3>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                            Connect your Gmail account to start using AI-powered email automation.
                            Analyze emails, generate intelligent responses, and save time.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
