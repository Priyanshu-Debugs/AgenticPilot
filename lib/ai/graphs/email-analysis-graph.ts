// LangGraph: Email Analysis Agent
// Analyzes + generates reply in a SINGLE LLM call, then conditionally
// routes through escalation check:
//
//   START → analyzeAndReply → [shouldEscalate?] → passThrough → END
//                                               → escalate    → END

import { StateGraph, Annotation, START, END } from '@langchain/langgraph'
import { z } from 'zod'
import { getModel } from '../llm'
import type { EmailAnalysis, GmailMessage } from '@/lib/gmail/types'
import { formatReplyWithTemplate } from '@/lib/gmail/reply-template'

// ── Zod Schema (single call — classification + reply) ────────

const AnalysisWithReplySchema = z.object({
    type: z.enum(['inquiry', 'support', 'complaint', 'feedback', 'spam', 'other'])
        .describe('The category of this email'),
    sentiment: z.enum(['positive', 'neutral', 'negative'])
        .describe('Overall sentiment of the email'),
    urgency: z.enum(['low', 'medium', 'high'])
        .describe('How urgently this email needs a response'),
    confidence: z.number().min(0).max(1)
        .describe('Confidence score for this classification (0.0 to 1.0)'),
    summary: z.string()
        .describe('One sentence summary of the email'),
    keywords: z.array(z.string())
        .describe('Key words and phrases from the email'),
    suggestedReply: z.string()
        .describe('A helpful reply to the email. Write ONLY the reply body, no subject line, no greeting, no sign-off.'),
})

// ── Graph State ──────────────────────────────────────────────

const EmailAnalysisState = Annotation.Root({
    // Inputs
    email: Annotation<GmailMessage>,
    businessContext: Annotation<{
        businessName?: string
        industry?: string
        tone?: string
    } | undefined>,
    enableEscalation: Annotation<boolean>,

    // Output
    analysis: Annotation<EmailAnalysis | null>,
})

// ── Escalation Rules ─────────────────────────────────────────

function getEscalationReason(analysis: {
    type: string
    sentiment: string
    urgency: string
    confidence: number
}): string | null {
    const { type, sentiment, urgency, confidence } = analysis

    if (confidence < 0.7) {
        return `Low AI confidence (${(confidence * 100).toFixed(0)}%) — email may be misclassified`
    }
    if (type === 'spam') {
        return 'Email classified as spam — skipping auto-reply'
    }
    if (type === 'complaint' && sentiment === 'negative') {
        return 'Negative complaint detected — requires human review'
    }
    if (urgency === 'high' && sentiment === 'negative') {
        return 'High urgency negative email — too sensitive for automated response'
    }
    if (urgency === 'high' && confidence < 0.85) {
        return `High urgency email with moderate confidence (${(confidence * 100).toFixed(0)}%) — escalating to be safe`
    }

    return null
}

// ── Nodes ────────────────────────────────────────────────────

async function analyzeAndReplyNode(state: typeof EmailAnalysisState.State) {
    const { email, businessContext } = state

    const businessInfo = businessContext?.businessName
        ? `Business: ${businessContext.businessName} (${businessContext.industry || 'General'})`
        : 'Business: AgenticPilot AI Platform'

    const tone = businessContext?.tone || 'professional'

    const model = getModel()
    const structuredModel = model.withStructuredOutput(AnalysisWithReplySchema)

    const result = await structuredModel.invoke(
        `You are an AI email assistant. Analyze this email and generate a reply in one step.

${businessInfo}

EMAIL TO ANALYZE:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body.substring(0, 2000)}

Instructions:
1. Classify the email (type, sentiment, urgency)
2. Provide a confidence score for your classification
3. Write a one-sentence summary
4. Extract key words
5. Generate a ${tone} reply that addresses the sender's needs. Be concise but complete. Include a call-to-action if appropriate. Write ONLY the reply body — no subject line, no greeting, no sign-off.`
    )

    const suggestedReply = formatReplyWithTemplate(result.suggestedReply, email.from)

    const analysis: EmailAnalysis = {
        type: result.type,
        sentiment: result.sentiment,
        urgency: result.urgency,
        confidence: result.confidence,
        summary: result.summary,
        keywords: result.keywords,
        suggestedReply,
        escalated: false,
    }

    return { analysis }
}

/** Pass-through node for safe emails — analysis is already complete */
function passThroughNode(state: typeof EmailAnalysisState.State) {
    return {} // analysis already set by analyzeAndReply
}

/** Escalation node — clears the reply and flags for human review */
function escalateNode(state: typeof EmailAnalysisState.State) {
    const { analysis } = state

    if (!analysis) {
        return {
            analysis: {
                type: 'other' as const,
                sentiment: 'neutral' as const,
                urgency: 'medium' as const,
                confidence: 0,
                summary: 'Could not analyze email',
                keywords: [],
                suggestedReply: '',
                escalated: true,
                escalationReason: 'Analysis failed — escalated for safety',
            }
        }
    }

    const reason = getEscalationReason(analysis) || 'Escalated for human review'

    return {
        analysis: {
            ...analysis,
            suggestedReply: '', // Clear the auto-reply
            escalated: true,
            escalationReason: reason,
        }
    }
}

// ── Conditional Router ───────────────────────────────────────

function shouldEscalate(state: typeof EmailAnalysisState.State): string {
    if (!state.enableEscalation) {
        return 'passThrough' // Escalation disabled — keep the reply
    }

    const { analysis } = state
    if (!analysis) {
        return 'escalate'
    }

    const reason = getEscalationReason(analysis)
    return reason ? 'escalate' : 'passThrough'
}

// ── Graph Assembly ───────────────────────────────────────────

const workflow = new StateGraph(EmailAnalysisState)
    .addNode('analyzeAndReply', analyzeAndReplyNode)
    .addNode('passThrough', passThroughNode)
    .addNode('escalate', escalateNode)
    .addEdge(START, 'analyzeAndReply')
    .addConditionalEdges('analyzeAndReply', shouldEscalate, ['passThrough', 'escalate'])
    .addEdge('passThrough', END)
    .addEdge('escalate', END)

export const emailAnalysisGraph = workflow.compile()
