"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Mail,
    Sparkles,
    Send,
    Loader2,
    ChevronDown,
    ChevronUp,
    Clock,
    User
} from 'lucide-react'
import type { GmailMessage, EmailAnalysis } from '@/lib/gmail/types'

interface EmailListProps {
    emails: GmailMessage[]
    loading?: boolean
    onAnalyze: (email: GmailMessage) => void
    onReply: (email: GmailMessage) => void
    selectedId?: string
}

export function EmailList({
    emails,
    loading = false,
    onAnalyze,
    onReply,
    selectedId
}: EmailListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-3 text-muted-foreground">Loading emails...</span>
            </div>
        )
    }

    if (emails.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No emails found</p>
                <p className="text-sm">Your inbox is empty or try a different filter</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {emails.map((email) => (
                <Card
                    key={email.id}
                    className={`transition-all hover:shadow-md ${selectedId === email.id ? 'ring-2 ring-primary' : ''
                        } ${email.isUnread ? 'border-l-4 border-l-primary' : ''}`}
                >
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm font-medium truncate">
                                        {extractName(email.from)}
                                    </span>
                                    {email.isUnread && (
                                        <Badge variant="secondary" className="text-xs">New</Badge>
                                    )}
                                </div>

                                <h4 className={`font-semibold truncate ${email.isUnread ? '' : 'text-muted-foreground'}`}>
                                    {email.subject || '(No Subject)'}
                                </h4>

                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {email.snippet}
                                </p>

                                {expandedId === email.id && (
                                    <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                                        {email.body.substring(0, 1000)}
                                        {email.body.length > 1000 && '...'}
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onAnalyze(email)}
                                        className="gap-1"
                                    >
                                        <Sparkles className="h-3 w-3" />
                                        Analyze
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onReply(email)}
                                        className="gap-1"
                                    >
                                        <Send className="h-3 w-3" />
                                        Reply
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
                                    >
                                        {expandedId === email.id ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col items-end text-xs text-muted-foreground flex-shrink-0">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(email.date)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function extractName(from: string): string {
    const match = from.match(/^([^<]+)/)
    return match ? match[1].trim().replace(/"/g, '') : from
}

function formatDate(dateStr: string): string {
    try {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffHours = diffMs / (1000 * 60 * 60)

        if (diffHours < 1) return 'Just now'
        if (diffHours < 24) return `${Math.round(diffHours)}h ago`
        if (diffHours < 48) return 'Yesterday'

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    } catch {
        return dateStr
    }
}
