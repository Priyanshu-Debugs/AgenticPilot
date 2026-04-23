// LangGraph: Product Photo Content Generation Agent
// 1-node graph with structured output for product photo descriptions, captions, hashtags, and tips

import { StateGraph, Annotation, START, END } from '@langchain/langgraph'
import { z } from 'zod'
import { getModel } from '../llm'

// ── Zod Schema ───────────────────────────────────────────────

const ProductPhotoSchema = z.object({
    photoDescription: z.string()
        .describe('A vivid 2-sentence description of how the product photo looks in the chosen style'),
    caption: z.string()
        .describe('An engaging Instagram caption for this product photo with emojis and call to action'),
    hashtags: z.array(z.string())
        .describe('Array of 10 relevant hashtags without the # symbol'),
    postingTip: z.string()
        .describe('One short tip on the best way to post this style of photo on Instagram'),
})

export type ProductPhotoContent = z.infer<typeof ProductPhotoSchema>

// ── Style Descriptions ───────────────────────────────────────

const STYLE_DESCRIPTIONS: Record<string, string> = {
    studio: 'Studio shot — clean white background, professional softbox lighting',
    lifestyle: 'Lifestyle shot — natural setting, warm ambient lighting, aspirational context',
    'flat-lay': 'Flat lay — top-down view, styled arrangement, editorial look',
    minimal: 'Minimal — solid color background, hero shot, elegant simplicity',
    dramatic: 'Dramatic — dark moody background, rim lighting, cinematic luxury feel',
}

// ── Graph State ──────────────────────────────────────────────

const ProductPhotoState = Annotation.Root({
    // Inputs
    productName: Annotation<string>,
    productDescription: Annotation<string>,
    style: Annotation<string>,

    // Output
    aiContent: Annotation<ProductPhotoContent | null>,
})

// ── Node ─────────────────────────────────────────────────────

async function generateContentNode(state: typeof ProductPhotoState.State) {
    const { productName, productDescription, style } = state

    const styleDesc = STYLE_DESCRIPTIONS[style] || STYLE_DESCRIPTIONS.studio

    const model = getModel()
    const structuredModel = model.withStructuredOutput(ProductPhotoSchema)

    const aiContent = await structuredModel.invoke(
        `You are a professional product photography director and Instagram marketing expert.

Product: ${productName}
Description: ${productDescription}
Photo Style: ${styleDesc}

Generate a vivid photo description, an engaging Instagram caption with emojis and call to action, 10 relevant hashtags (without # symbol), and one short posting tip.`
    )

    return { aiContent }
}

// ── Graph Assembly ───────────────────────────────────────────

const workflow = new StateGraph(ProductPhotoState)
    .addNode('generateContent', generateContentNode)
    .addEdge(START, 'generateContent')
    .addEdge('generateContent', END)

export const productPhotoGraph = workflow.compile()
