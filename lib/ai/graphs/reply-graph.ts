// LangGraph: Standalone Reply Generation Agent
// Simple 1-node graph for generating an email reply with a specific tone

import { StateGraph, Annotation, START, END } from '@langchain/langgraph'
import { getModel } from '../llm'
import type { GmailMessage } from '@/lib/gmail/types'
import { formatReplyWithTemplate } from '@/lib/gmail/reply-template'

// ── Graph State ──────────────────────────────────────────────

const ReplyState = Annotation.Root({
    // Inputs
    email: Annotation<GmailMessage>,
    tone: Annotation<string>,
    additionalContext: Annotation<string | undefined>,

    // Output
    reply: Annotation<string>,
})

// ── Node ─────────────────────────────────────────────────────

async function generateNode(state: typeof ReplyState.State) {
    const { email, tone, additionalContext } = state

    const model = getModel()

    const result = await model.invoke(
        `Generate a ${tone} email reply.

ORIGINAL EMAIL:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body.substring(0, 1500)}

${additionalContext ? `Additional context: ${additionalContext}` : ''}

Write ONLY the reply body (no subject line, no explanations).
Tone: ${tone}
Do NOT include greeting or sign-off lines.`
    )

    const text = typeof result.content === 'string'
        ? result.content.trim()
        : ''

    if (!text) {
        throw new Error('LLM returned empty reply')
    }

    const reply = formatReplyWithTemplate(text, email.from)
    return { reply }
}

// ── Graph Assembly ───────────────────────────────────────────

const workflow = new StateGraph(ReplyState)
    .addNode('generate', generateNode)
    .addEdge(START, 'generate')
    .addEdge('generate', END)

export const replyGraph = workflow.compile()
