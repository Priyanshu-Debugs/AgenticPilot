// AI Email Analyzer
// Uses Gemini AI to analyze emails and generate intelligent replies

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { EmailAnalysis, GmailMessage } from '@/lib/gmail/types'

// Cache Gemini model at module scope to avoid repeated construction
let cachedGeminiModel: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null

// Initialize Gemini AI
function getGeminiModel() {
    if (!cachedGeminiModel) {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not configured')
        }
        const genAI = new GoogleGenerativeAI(apiKey)
        cachedGeminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    }
    return cachedGeminiModel
}

// Analyze email and generate suggested reply
export async function analyzeEmail(
    email: GmailMessage,
    businessContext?: {
        businessName?: string
        industry?: string
        tone?: string
    }
): Promise<EmailAnalysis> {
    const model = getGeminiModel()

    const businessInfo = businessContext?.businessName
        ? `Business: ${businessContext.businessName} (${businessContext.industry || 'General'})`
        : 'Business: AgenticPilot AI Platform'

    const preferredTone = businessContext?.tone || 'professional'

    const prompt = `You are an AI email assistant. Analyze this email and provide a JSON response.

${businessInfo}
Preferred tone: ${preferredTone}

EMAIL TO ANALYZE:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body.substring(0, 2000)}

Respond with ONLY valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "type": "inquiry|support|complaint|feedback|spam|other",
  "sentiment": "positive|neutral|negative",
  "urgency": "low|medium|high",
  "confidence": 0.0 to 1.0,
  "summary": "One sentence summary of the email",
  "keywords": ["key", "words", "from", "email"],
  "suggestedReply": "A complete, helpful reply in ${preferredTone} tone. Sign off with the business name."
}

Guidelines for suggestedReply:
- Be helpful and address the sender's needs
- Match the ${preferredTone} tone
- Keep it concise but complete
- Include a clear call-to-action if appropriate
- End with appropriate closing and business name`

    // Attempt Gemini API call with retry for JSON parse issues
    const MAX_RETRIES = 2
    let lastError: Error | null = null

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const currentPrompt = attempt === 0
                ? prompt
                : prompt + '\n\nIMPORTANT: Return ONLY raw JSON. No markdown code blocks, no explanations, just the JSON object.'

            const result = await model.generateContent(currentPrompt)
            const response = await result.response
            let text = response.text().trim()

            // Clean up markdown code blocks if present
            if (text.startsWith('```')) {
                text = text.replace(/```json?\n?/, '').replace(/\n?```$/, '')
            }

            const analysis: EmailAnalysis = JSON.parse(text)

            // Validate and normalize
            return {
                type: validateType(analysis.type),
                sentiment: validateSentiment(analysis.sentiment),
                urgency: validateUrgency(analysis.urgency),
                confidence: Math.min(1, Math.max(0, analysis.confidence || 0.7)),
                summary: analysis.summary || 'Email analyzed',
                keywords: Array.isArray(analysis.keywords) ? analysis.keywords : [],
                suggestedReply: analysis.suggestedReply || '',
            }
        } catch (error: any) {
            lastError = error
            // Only retry on JSON parse errors, not API errors
            if (error instanceof SyntaxError) {
                console.warn(`Gemini returned non-JSON on attempt ${attempt + 1}, retrying...`)
                continue
            }
            // For API errors (missing key, rate limit, network), fail immediately
            console.error('Gemini API error:', error?.message || error)
            throw new Error(`Gemini AI analysis failed: ${error?.message || 'Unknown API error'}`)
        }
    }

    // All retries exhausted — JSON parsing kept failing
    console.error('All Gemini parse retries failed:', lastError)
    throw new Error(`Gemini AI analysis failed after ${MAX_RETRIES} attempts: Could not parse response as JSON`)
}

// Generate reply with specific tone
export async function generateReply(
    email: GmailMessage,
    tone: string = 'professional',
    additionalContext?: string
): Promise<string> {
    const model = getGeminiModel()

    const prompt = `Generate a ${tone} email reply.

ORIGINAL EMAIL:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body.substring(0, 1500)}

${additionalContext ? `Additional context: ${additionalContext}` : ''}

Write ONLY the reply body (no subject line, no explanations).
Tone: ${tone}
End with an appropriate sign-off.`

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text().trim()
        if (!text) {
            throw new Error('Gemini returned empty reply')
        }
        return text
    } catch (error: any) {
        console.error('Reply generation error:', error?.message || error)
        throw new Error(`Gemini reply generation failed: ${error?.message || 'Unknown error'}`)
    }
}

// Validate type
function validateType(type: string): EmailAnalysis['type'] {
    const validTypes = ['inquiry', 'support', 'complaint', 'feedback', 'spam', 'other']
    return validTypes.includes(type) ? type as EmailAnalysis['type'] : 'other'
}

// Validate sentiment
function validateSentiment(sentiment: string): EmailAnalysis['sentiment'] {
    const valid = ['positive', 'neutral', 'negative']
    return valid.includes(sentiment) ? sentiment as EmailAnalysis['sentiment'] : 'neutral'
}

// Validate urgency
function validateUrgency(urgency: string): EmailAnalysis['urgency'] {
    const valid = ['low', 'medium', 'high']
    return valid.includes(urgency) ? urgency as EmailAnalysis['urgency'] : 'medium'
}

