"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Mail, Link2, Loader2, CheckCircle2, XCircle, Play, Square, Zap } from 'lucide-react'

interface AutomationResult {
    emailId: string
    subject: string
    from: string
    status: 'success' | 'error'
    error?: string
}

interface AutomationResponse {
    success: boolean
    message: string
    processed: number
    successCount: number
    errorCount: number
    results: AutomationResult[]
}

interface GmailConnectProps {
    isConnected: boolean
    onConnect: () => Promise<void>
    onDisconnect: () => Promise<void>
    loading?: boolean
    onAutomationComplete?: () => void
}

export function GmailConnect({
    isConnected,
    onConnect,
    onDisconnect,
    loading = false,
    onAutomationComplete
}: GmailConnectProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isAutomating, setIsAutomating] = useState(false)
    const [automationResult, setAutomationResult] = useState<AutomationResponse | null>(null)

    const handleConnect = async () => {
        setIsLoading(true)
        try {
            await onConnect()
        } finally {
            setIsLoading(false)
        }
    }

    const handleDisconnect = async () => {
        if (!confirm('Are you sure you want to disconnect Gmail?')) return
        setIsLoading(true)
        try {
            await onDisconnect()
        } finally {
            setIsLoading(false)
        }
    }

    const handleStartAutomation = async () => {
        setIsAutomating(true)
        setAutomationResult(null)

        try {
            const res = await fetch('/api/gmail/auto-reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ maxEmails: 10, tone: 'professional' })
            })

            const data: AutomationResponse = await res.json()
            setAutomationResult(data)

            if (onAutomationComplete) {
                onAutomationComplete()
            }
        } catch (error) {
            console.error('Automation failed:', error)
            setAutomationResult({
                success: false,
                message: 'Automation failed. Please try again.',
                processed: 0,
                successCount: 0,
                errorCount: 0,
                results: []
            })
        } finally {
            setIsAutomating(false)
        }
    }

    const isProcessing = isLoading || loading

    return (
        <Card className="border-2 border-dashed overflow-hidden">
            <CardContent className="p-4 sm:p-6">
                {/* Stack everything vertically on mobile, horizontal on desktop */}
                <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                    {/* Left side: Icon + Status */}
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 sm:p-3 rounded-full shrink-0 ${isConnected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                            <Mail className={`h-5 w-5 sm:h-6 sm:w-6 ${isConnected ? 'text-green-600' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base">Gmail Connection</h3>
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                                {isConnected ? (
                                    <>
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                        <span className="text-green-600">Connected</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                        <span>Not connected</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right side: Buttons - full width stack on mobile */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
                        {isConnected && (
                            <Button
                                onClick={handleStartAutomation}
                                disabled={isAutomating || isProcessing}
                                size="sm"
                                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            >
                                {isAutomating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-4 w-4" />
                                        Start Automation
                                    </>
                                )}
                            </Button>
                        )}

                        {isConnected ? (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDisconnect}
                                disabled={isProcessing || isAutomating}
                                className="w-full sm:w-auto"
                            >
                                {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Disconnect
                            </Button>
                        ) : (
                            <Button
                                onClick={handleConnect}
                                disabled={isProcessing}
                                size="sm"
                                className="w-full sm:w-auto gap-2"
                            >
                                {isProcessing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Link2 className="h-4 w-4" />
                                )}
                                Connect Gmail
                            </Button>
                        )}
                    </div>
                </div>

                {/* Automation Progress */}
                {isAutomating && (
                    <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span>Analyzing emails and generating AI replies...</span>
                        </div>
                        <Progress value={undefined} className="h-2" />
                    </div>
                )}

                {/* Automation Result */}
                {automationResult && !isAutomating && (
                    <div className="space-y-3 pt-2 border-t">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{automationResult.message}</p>
                            <div className="flex gap-2">
                                {automationResult.successCount > 0 && (
                                    <Badge variant="default" className="bg-green-500">
                                        {automationResult.successCount} Replied
                                    </Badge>
                                )}
                                {automationResult.errorCount > 0 && (
                                    <Badge variant="destructive">
                                        {automationResult.errorCount} Failed
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Show individual results */}
                        {automationResult.results && automationResult.results.length > 0 && (
                            <div className="max-h-40 overflow-y-auto space-y-2">
                                {automationResult.results.map((result, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-between p-2 rounded-lg text-sm ${result.status === 'success'
                                            ? 'bg-green-50 dark:bg-green-950/30'
                                            : 'bg-red-50 dark:bg-red-950/30'
                                            }`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{result.subject}</p>
                                            <p className="text-xs text-muted-foreground truncate">{result.from}</p>
                                        </div>
                                        {result.status === 'success' ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 ml-2" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 ml-2" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
