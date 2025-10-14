import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    // Get current user
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { subject, recipient, additionalContext, tone = 'professional' } = body;

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject is required' },
        { status: 400 }
      );
    }

    // Tone descriptions
    const toneDescriptions: Record<string, string> = {
      professional: "professional, formal, and business-appropriate",
      friendly: "warm, friendly, and approachable while maintaining professionalism",
      empathetic: "empathetic, understanding, and compassionate",
      enthusiastic: "enthusiastic, positive, and energetic",
      calm: "calm, reassuring, and composed",
      formal: "very formal, respectful, and traditional"
    }

    // Get business info for context (optional)
    const { data: businessInfo } = await supabase
      .from('business_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Generate AI reply using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const businessContext = businessInfo
      ? `
Business Context:
- Business Name: ${businessInfo.business_name || 'AgenticPilot'}
- Industry: ${businessInfo.industry || 'Technology'}
- Description: ${businessInfo.description || 'AI-powered automation platform'}
${
  businessInfo.faq && businessInfo.faq.length > 0
    ? `\nFrequently Asked Questions:\n${businessInfo.faq.map((f: any, i: number) => `${i + 1}. Q: ${f.question}\n   A: ${f.answer}`).join('\n')}`
    : ''
}
`
      : `
Business Context:
- Business Name: AgenticPilot
- Industry: Technology
- Description: AI-powered automation platform
`;

    const toneDescription = toneDescriptions[tone] || toneDescriptions.professional;

    const prompt = `You are a professional email assistant helping to compose a reply email.

${businessContext}

Email Details:
- Subject: ${subject}
${recipient ? `- Recipient: ${recipient}` : ''}
${additionalContext ? `- Additional Context/Original Email: ${additionalContext}` : ''}

TONE REQUIREMENT: Write this email in a ${toneDescription} tone.

Please generate an email reply following these guidelines:

1. Use an appropriate greeting that matches the ${tone} tone
2. Acknowledge the subject matter and original email if context is provided
3. Provide a helpful, informative, and relevant response
4. Maintain the ${tone} tone throughout the entire email
5. Be concise but comprehensive
6. Include clear next steps or call-to-action if appropriate
7. End with an appropriate closing that matches the tone
8. Sign off with the business name

Important: 
- Generate ONLY the email body text
- Do NOT include subject line, email headers, or any commentary
- Do NOT use markdown formatting
- Maintain the ${tone} tone consistently`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedReply = response.text();

    // Clean up the reply (remove any markdown formatting if present)
    generatedReply = generatedReply
      .trim()
      .replace(/^```[\w]*\n?/, '')
      .replace(/\n?```$/, '');

    return NextResponse.json({
      success: true,
      reply: generatedReply,
      confidence: 0.9,
    });

  } catch (error) {
    console.error('Gemini AI generation error:', error);
    
    // Parse request body for fallback
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      requestBody = {};
    }
    
    // Fallback reply if AI fails
    const fallbackReply = `Dear Valued Customer,

Thank you for your email${requestBody?.subject ? ` regarding "${requestBody.subject}"` : ''}.

We have received your message and our team will get back to you within 24 hours with a detailed response.

If you need immediate assistance, please don't hesitate to contact us directly.

Best regards,
AgenticPilot Team`;

    return NextResponse.json({
      success: true,
      reply: fallbackReply,
      confidence: 0.5,
      fallback: true,
      error: error instanceof Error ? error.message : 'AI generation failed, using fallback',
    });
  }
}
