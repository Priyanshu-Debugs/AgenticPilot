import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface EmailAnalysis {
  type: 'review' | 'inquiry' | 'complaint' | 'support' | 'other';
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: 'low' | 'medium' | 'high';
  suggestedReply: string;
  confidence: number;
  keywords: string[];
}

export interface EmailContext {
  subject: string;
  from: string;
  body: string;
  snippet: string;
}

export interface BusinessContext {
  businessName?: string;
  industry?: string;
  description?: string;
  faq?: Array<{ question: string; answer: string }>;
}

/**
 * Analyze email using Gemini AI
 */
export async function analyzeEmail(
  email: EmailContext,
  businessContext?: BusinessContext
): Promise<EmailAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const businessInfo = businessContext
      ? `
Business Information:
- Name: ${businessContext.businessName || 'Not provided'}
- Industry: ${businessContext.industry || 'Not provided'}
- Description: ${businessContext.description || 'Not provided'}
${
  businessContext.faq && businessContext.faq.length > 0
    ? `\nFAQs:\n${businessContext.faq.map((f, i) => `${i + 1}. Q: ${f.question}\n   A: ${f.answer}`).join('\n')}`
    : ''
}
`
      : 'No business context provided.';

    const prompt = `You are an AI email assistant. Analyze the following email and provide insights.

${businessInfo}

Email Details:
- From: ${email.from}
- Subject: ${email.subject}
- Body: ${email.body || email.snippet}

Please analyze this email and provide a JSON response with the following structure:
{
  "type": "review" | "inquiry" | "complaint" | "support" | "other",
  "sentiment": "positive" | "neutral" | "negative",
  "urgency": "low" | "medium" | "high",
  "suggestedReply": "A professional and helpful reply to this email",
  "confidence": 0.0 to 1.0,
  "keywords": ["extracted", "keywords"]
}

Important guidelines for the suggested reply:
1. Be professional, friendly, and helpful
2. Address the sender's concerns or questions
3. Include relevant information from the business context if applicable
4. Keep it concise but comprehensive
5. End with an appropriate call-to-action or next steps
6. Sign off appropriately with the business name`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    const analysis: EmailAnalysis = JSON.parse(jsonText);

    return analysis;
  } catch (error) {
    console.error('Gemini AI analysis error:', error);
    
    // Fallback to basic analysis
    return fallbackEmailAnalysis(email);
  }
}

/**
 * Generate a custom email reply using Gemini AI
 */
export async function generateEmailReply(
  email: EmailContext,
  instructions: string,
  businessContext?: BusinessContext
): Promise<{ reply: string; confidence: number }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const businessInfo = businessContext
      ? `
Business Information:
- Name: ${businessContext.businessName || 'Not provided'}
- Industry: ${businessContext.industry || 'Not provided'}
- Description: ${businessContext.description || 'Not provided'}
${
  businessContext.faq && businessContext.faq.length > 0
    ? `\nFAQs:\n${businessContext.faq.map((f, i) => `${i + 1}. Q: ${f.question}\n   A: ${f.answer}`).join('\n')}`
    : ''
}
`
      : '';

    const prompt = `You are an AI email assistant helping to compose a professional email reply.

${businessInfo}

Original Email:
- From: ${email.from}
- Subject: ${email.subject}
- Body: ${email.body || email.snippet}

Instructions for the reply:
${instructions}

Please generate a professional, helpful, and appropriate email reply. Follow these guidelines:
1. Be professional and courteous
2. Address all points mentioned in the instructions
3. Use information from the business context when relevant
4. Keep the tone friendly but professional
5. Include a proper greeting and sign-off
6. Make it concise but comprehensive

Provide only the email reply text, without any additional commentary or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    return {
      reply: reply.trim(),
      confidence: 0.9, // High confidence for custom generation
    };
  } catch (error) {
    console.error('Gemini AI reply generation error:', error);
    throw new Error('Failed to generate email reply');
  }
}

/**
 * Improve an email template using Gemini AI
 */
export async function improveEmailTemplate(
  template: string,
  templateType: string,
  businessContext?: BusinessContext
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const businessInfo = businessContext
      ? `Business: ${businessContext.businessName || 'Generic business'} (${businessContext.industry || 'Various industries'})`
      : 'Generic business template';

    const prompt = `You are an expert email copywriter. Improve the following ${templateType} email template.

${businessInfo}

Current Template:
${template}

Please improve this template by:
1. Making it more professional and polished
2. Ensuring it's friendly and approachable
3. Adding clear call-to-action where appropriate
4. Making it adaptable with variables like {business_name}, {sender_name}, {subject}
5. Keeping it concise but effective
6. Ensuring proper email etiquette

Provide only the improved template text, without any additional commentary.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvedTemplate = response.text();

    return improvedTemplate.trim();
  } catch (error) {
    console.error('Gemini AI template improvement error:', error);
    throw new Error('Failed to improve email template');
  }
}

/**
 * Fallback email analysis when AI is unavailable
 */
function fallbackEmailAnalysis(email: EmailContext): EmailAnalysis {
  const text = (email.subject + ' ' + (email.body || email.snippet)).toLowerCase();
  
  // Determine type
  let type: EmailAnalysis['type'] = 'other';
  if (text.match(/review|feedback|rating|testimonial/)) type = 'review';
  else if (text.match(/question|help|support|how|what|inquiry/)) type = 'inquiry';
  else if (text.match(/complaint|issue|problem|not working|broken/)) type = 'complaint';
  else if (text.match(/urgent|asap|immediately|help|support/)) type = 'support';

  // Determine sentiment
  let sentiment: EmailAnalysis['sentiment'] = 'neutral';
  const positiveWords = ['thank', 'great', 'excellent', 'happy', 'love', 'appreciate'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'angry'];
  
  const hasPositive = positiveWords.some(word => text.includes(word));
  const hasNegative = negativeWords.some(word => text.includes(word));
  
  if (hasPositive && !hasNegative) sentiment = 'positive';
  else if (hasNegative && !hasPositive) sentiment = 'negative';

  // Determine urgency
  let urgency: EmailAnalysis['urgency'] = 'low';
  if (text.match(/urgent|asap|immediately|emergency|critical/)) urgency = 'high';
  else if (text.match(/soon|quick|timely|important/)) urgency = 'medium';

  // Generate basic suggested reply
  const suggestedReply = `Thank you for your email regarding "${email.subject}".

We have received your message and will respond with more details shortly.

If you need immediate assistance, please don't hesitate to contact us directly.

Best regards,
[Your Business Name]`;

  return {
    type,
    sentiment,
    urgency,
    suggestedReply,
    confidence: 0.6, // Lower confidence for fallback
    keywords: extractKeywords(text),
  };
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by']);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Return top 5 keywords
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}
