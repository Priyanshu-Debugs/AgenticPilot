"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Brain,
    ThumbsUp,
    ThumbsDown,
    Minus,
    AlertTriangle,
    Copy,
    Sparkles
} from 'lucide-react'
import type { EmailAnalysis } from '@/lib/gmail/types'

interface AnalysisResultProps {
    analysis: EmailAnalysis | null
    loading?: boolean
    onUseReply: (reply: string) => void
}

export function AnalysisResult({ analysis, loading, onUseReply }: AnalysisResultProps) {
    if (loading) {
        return (
            <div className="animate-pulse p-6 border rounded-lg">
                <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-primary animate-bounce" />
                    <span>Analyzing email with AI...</span>
                </div>
            </div>
        )
    }

    if (!analysis) {
        return (
            <div className="border-dashed border-2 rounded-lg p-6 text-center text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>Select an email and click "Analyze" to see AI insights</p>
            </div>
        )
    }

    const sentimentIcon = {
        positive: <ThumbsUp className="h-4 w-4 text-green-500" />,
        neutral: <Minus className="h-4 w-4 text-gray-500" />,
        negative: <ThumbsDown className="h-4 w-4 text-red-500" />,
    }

    const urgencyColor = {
        low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    }

    const typeColor = {
        inquiry: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        support: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        complaint: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        feedback: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        spam: 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400',
        other: 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400',
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">AI Analysis</h3>
                </div>
                <Badge variant="outline" className="font-mono">
                    {Math.round(analysis.confidence * 100)}% confidence
                </Badge>
            </div>

            {/* Classification badges */}
            <div className="flex flex-wrap gap-2">
                <Badge className={typeColor[analysis.type]}>
                    {analysis.type.charAt(0).toUpperCase() + analysis.type.slice(1)}
                </Badge>
                <Badge variant="outline" className="gap-1">
                    {sentimentIcon[analysis.sentiment]}
                    {analysis.sentiment}
                </Badge>
                <Badge className={urgencyColor[analysis.urgency]}>
                    {analysis.urgency === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {analysis.urgency} urgency
                </Badge>
            </div>

            {/* Summary */}
            <div>
                <h4 className="font-medium text-sm mb-1">Summary</h4>
                <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>

            {/* Keywords */}
            {analysis.keywords.length > 0 && (
                <div>
                    <h4 className="font-medium text-sm mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-1">
                        {analysis.keywords.map((keyword, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                                {keyword}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggested Reply */}
            <div className="pt-2 border-t">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Suggested Reply</h4>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUseReply(analysis.suggestedReply)}
                        className="gap-1"
                    >
                        <Copy className="h-3 w-3" />
                        Use This
                    </Button>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {analysis.suggestedReply}
                </div>
            </div>
        </div>
    )
}
