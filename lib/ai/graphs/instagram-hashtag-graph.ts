// LangGraph: Instagram Hashtag Suggestion Agent
// 1-node graph with structured output that returns an array of hashtags

import { StateGraph, Annotation, START, END } from '@langchain/langgraph'
import { z } from 'zod'
import { getModel } from '../llm'

// ── Zod Schema ───────────────────────────────────────────────

const HashtagSchema = z.object({
    hashtags: z.array(z.string())
        .describe('Array of relevant Instagram hashtags, each starting with #'),
})

// ── Graph State ──────────────────────────────────────────────

const HashtagState = Annotation.Root({
    // Inputs
    caption: Annotation<string>,
    category: Annotation<string | undefined>,

    // Output
    hashtags: Annotation<string[]>,
})

// ── Node ─────────────────────────────────────────────────────

async function suggestHashtagsNode(state: typeof HashtagState.State) {
    const { caption, category } = state

    const model = getModel()
    const structuredModel = model.withStructuredOutput(HashtagSchema)

    const result = await structuredModel.invoke(
        `You are a social media expert specializing in Instagram hashtag strategy. Suggest relevant hashtags for an Instagram post.

Post Caption: "${caption}"
Category: ${category || 'general'}

Requirements:
1. Provide 10-15 highly relevant hashtags
2. Mix of popular, medium, and niche hashtags for better reach
3. All hashtags must start with #
4. Focus on current trends and high engagement potential
5. Relevant to the content and category
6. No banned or spam hashtags`
    )

    // Ensure all hashtags start with # and limit to 15
    const hashtags = result.hashtags
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
        .filter(tag => tag.length > 1)
        .slice(0, 15)

    return { hashtags }
}

// ── Graph Assembly ───────────────────────────────────────────

const workflow = new StateGraph(HashtagState)
    .addNode('suggestHashtags', suggestHashtagsNode)
    .addEdge(START, 'suggestHashtags')
    .addEdge('suggestHashtags', END)

export const hashtagGraph = workflow.compile()
