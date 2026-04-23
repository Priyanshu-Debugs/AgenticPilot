// AI Email Analyzer
// Uses LangGraph agents to analyze emails and generate intelligent replies

import type { EmailAnalysis, GmailMessage } from '@/lib/gmail/types'
import { emailAnalysisGraph } from './graphs/email-analysis-graph'
import { replyGraph } from './graphs/reply-graph'
import { formatReplyWithTemplate } from '@/lib/gmail/reply-template'

// Analyze email and generate suggested reply
export async function analyzeEmail(
    email: GmailMessage,
    businessContext?: {
        businessName?: string
        industry?: string
        tone?: string
    },
    options?: {
        humanReviewEnabled?: boolean
    }
): Promise<EmailAnalysis> {
    try {
        const result = await emailAnalysisGraph.invoke({
            email,
            businessContext,
            enableEscalation: options?.humanReviewEnabled ?? false,
            analysis: null,
        })

        if (!result.analysis) {
            throw new Error('Email analysis graph returned no analysis')
        }

        return result.analysis
    } catch (error: any) {
        console.error('Email analysis error:', error?.message || error)
        throw new Error(`AI email analysis failed: ${error?.message || 'Unknown error'}`)
    }
}

// Generate reply with specific tone
export async function generateReply(
    email: GmailMessage,
    tone: string = 'professional',
    additionalContext?: string
): Promise<string> {
    try {
        const result = await replyGraph.invoke({
            email,
            tone,
            additionalContext,
            reply: '',
        })

        if (!result.reply) {
            throw new Error('Reply graph returned empty reply')
        }

        return result.reply
    } catch (error: any) {
        console.error('Reply generation error:', error?.message || error)
        throw new Error(`AI reply generation failed: ${error?.message || 'Unknown error'}`)
    }
}
