// Centralized LLM instance factory
// Single source of truth for model configuration across all LangGraph agents

import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

let cachedModel: ChatGoogleGenerativeAI | null = null

/**
 * Get a shared ChatGoogleGenerativeAI model instance.
 * Caches the model at module scope to avoid repeated construction.
 */
export function getModel(model = 'gemini-2.5-flash'): ChatGoogleGenerativeAI {
    if (!cachedModel) {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not configured')
        }

        cachedModel = new ChatGoogleGenerativeAI({
            model,
            apiKey,
            temperature: 0.7,
        })
    }
    return cachedModel
}
