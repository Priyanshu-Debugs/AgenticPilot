// LangGraph: Instagram Caption Generation Agent
// 1-node graph that generates an engaging Instagram caption

import { StateGraph, Annotation, START, END } from '@langchain/langgraph'
import { getModel } from '../llm'

// ── Graph State ──────────────────────────────────────────────

const CaptionState = Annotation.Root({
    // Inputs
    context: Annotation<string>,
    tone: Annotation<string>,

    // Output
    caption: Annotation<string>,
})

// ── Node ─────────────────────────────────────────────────────

async function generateCaptionNode(state: typeof CaptionState.State) {
    const { context, tone } = state

    const model = getModel()

    const result = await model.invoke(
        `You are a social media expert specializing in Instagram content. Generate an engaging Instagram caption.

Context: ${context || 'General post'}
Tone: ${tone || 'professional'}

Requirements:
1. Use ${tone || 'professional'} tone
2. Make it engaging and authentic
3. Include 2-3 relevant emojis (not excessive)
4. Keep it concise (100-150 characters ideal) 
5. Include a subtle call-to-action if appropriate
6. Do NOT include hashtags (they will be added separately)

Return ONLY the caption text, without any explanations or quotes.`
    )

    const caption = typeof result.content === 'string'
        ? result.content.trim()
        : ''

    return { caption }
}

// ── Graph Assembly ───────────────────────────────────────────

const workflow = new StateGraph(CaptionState)
    .addNode('generateCaption', generateCaptionNode)
    .addEdge(START, 'generateCaption')
    .addEdge('generateCaption', END)

export const captionGraph = workflow.compile()
