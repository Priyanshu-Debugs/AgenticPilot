// AI Email Analyzer
// Uses Gemini AI to analyze emails and generate intelligent replies

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { EmailAnalysis, GmailMessage } from '@/lib/gmail/types'

// Initialize Gemini AI
function getGeminiModel() {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured')
    }
    const genAI = new GoogleGenerativeAI(apiKey)
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
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
    try {
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

Respond with ONLY valid JSON in this exact format:
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

        const result = await model.generateContent(prompt)
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
            suggestedReply: analysis.suggestedReply || generateFallbackReply(email, preferredTone),
        }
    } catch (error) {
        console.error('AI analysis error:', error)
        return getFallbackAnalysis(email)
    }
}

// Generate reply with specific tone
export async function generateReply(
    email: GmailMessage,
    tone: string = 'professional',
    additionalContext?: string
): Promise<string> {
    try {
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

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text().trim()
    } catch (error) {
        console.error('Reply generation error:', error)
        return generateFallbackReply(email, tone)
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

// Fallback analysis when AI fails
function getFallbackAnalysis(email: GmailMessage): EmailAnalysis {
    return {
        type: 'other',
        sentiment: 'neutral',
        urgency: 'medium',
        confidence: 0.5,
        summary: `Email from ${email.from} about "${email.subject}"`,
        keywords: email.subject.split(' ').slice(0, 5),
        suggestedReply: generateFallbackReply(email, 'professional'),
    }
}

// Generate fallback reply
function generateFallbackReply(email: GmailMessage, tone: string): string {
    const greeting = tone === 'formal' ? 'Dear Sir/Madam' : 'Hello'

    return `${greeting},

Thank you for your email regarding "${email.subject}".

We have received your message and will review it carefully. Our team will get back to you within 24 hours with a detailed response.

If you need immediate assistance, please don't hesitate to reach out.

Best regards,
AgenticPilot Team`
}
