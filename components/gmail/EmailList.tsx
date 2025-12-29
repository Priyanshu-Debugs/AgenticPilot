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
        <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto">
            {emails.map((email) => (
                <Card
                    key={email.id}
                    className={`transition-all hover:shadow-md ${selectedId === email.id ? 'ring-2 ring-primary shadow-md' : ''
                        } ${email.isUnread ? 'border-l-2 border-l-primary bg-primary/5' : 'border-l-2 border-l-transparent'}`}
                >
                    <CardContent className="p-3 sm:p-4">
                        {/* Email header: sender and date */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="text-xs sm:text-sm font-medium truncate">
                                    {extractName(email.from)}
                                </span>
                                {email.isUnread && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">New</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                                <Clock className="h-3 w-3" />
                                {formatDate(email.date)}
                            </div>
                        </div>

                        {/* Subject */}
                        <h4 className={`text-sm font-semibold truncate mb-1 ${email.isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {email.subject || '(No Subject)'}
                        </h4>

                        {/* Snippet */}
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {email.snippet}
                        </p>

                        {/* Expanded content */}
                        {expandedId === email.id && (
                            <div className="mt-3 p-2.5 bg-muted/50 rounded-lg text-xs whitespace-pre-wrap max-h-40 overflow-y-auto border border-border/50">
                                {email.body.substring(0, 1000)}
                                {email.body.length > 1000 && '...'}
                            </div>
                        )}

                        {/* Actions - compact row */}
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/30">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onAnalyze(email)
                                }}
                                className="h-7 px-2 gap-1 text-xs hover:bg-primary/10 hover:text-primary"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                Analyze
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onReply(email)
                                }}
                                className="h-7 px-2 gap-1 text-xs hover:bg-primary/10 hover:text-primary"
                            >
                                <Send className="h-3.5 w-3.5" />
                                Reply
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setExpandedId(expandedId === email.id ? null : email.id)
                                }}
                                className="h-7 w-7 ml-auto text-muted-foreground"
                            >
                                {expandedId === email.id ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
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
