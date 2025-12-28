"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Activity,
    CheckCircle,
    XCircle,
    Clock,
    Loader2
} from 'lucide-react'
import type { GmailLog, GmailStats } from '@/lib/gmail/types'

interface ActivityLogProps {
    logs: GmailLog[]
    stats: GmailStats
    loading?: boolean
}

export function ActivityLog({ logs, stats, loading }: ActivityLogProps) {
    if (loading) {
        return (
            <Card>
                <CardContent className="p-6 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span className="text-muted-foreground">Loading activity...</span>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    label="Processed"
                    value={stats.totalProcessed}
                />
                <StatCard
                    label="Replied"
                    value={stats.totalReplied}
                />
                <StatCard
                    label="Avg Response"
                    value={`${(stats.avgResponseTime / 1000).toFixed(1)}s`}
                />
                <StatCard
                    label="Success Rate"
                    value={`${stats.successRate}%`}
                />
            </div>

            {/* Activity list */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {logs.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6">
                            No activity yet. Analyze or reply to emails to see logs.
                        </p>
                    ) : (
                        <div className="space-y-3 max-h-[calc(100vh-500px)] overflow-y-auto pr-2">
                            {logs.slice(0, 20).map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-start gap-3 text-sm"
                                >
                                    <div className={`mt-0.5 ${log.success ? 'text-green-500' : 'text-red-500'}`}>
                                        {log.success ? (
                                            <CheckCircle className="h-4 w-4" />
                                        ) : (
                                            <XCircle className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {log.action}
                                            </Badge>
                                            {log.confidence && (
                                                <span className="text-xs text-muted-foreground">
                                                    {Math.round(log.confidence * 100)}% conf
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground truncate mt-1">
                                            {log.emailSubject || 'No subject'}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(log.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <Card>
            <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
        </Card>
    )
}

function formatTime(dateStr: string): string {
    try {
        const date = new Date(dateStr)
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        })
    } catch {
        return dateStr
    }
}
