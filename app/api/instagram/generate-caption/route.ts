import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    let context: string | undefined;
    let tone: string | undefined;

    try {
        // Get current user
        const supabase = await createClient(cookies());
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        context = body.context;
        tone = body.tone;

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                {
                    error: 'AI feature not configured',
                    details: 'GEMINI_API_KEY environment variable is not set. Please add it to your environment variables.'
                },
                { status: 500 }
            );
        }

        // Use Gemini AI to generate caption
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are a social media expert specializing in Instagram content. Generate an engaging Instagram caption.

Context: ${context || 'General post'}
Tone: ${tone || 'professional'}

Requirements:
1. Use ${tone || 'professional'} tone
2. Make it engaging and authentic
3. Include 2-3 relevant emojis (not excessive)
4. Keep it concise (100-150 characters ideal) 
5. Include a subtle call-to-action if appropriate
6. Do NOT include hashtags (they will be added separately)

Return ONLY the caption text, without any explanations or quotes.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const caption = response.text().trim();

        return NextResponse.json({
            caption,
            aiGenerated: true,
        });

    } catch (error: any) {
        console.error('Caption generation error:', error);

        // Provide fallback caption if AI fails
        const fallbackCaption = context
            ? `Excited to share this with you! ${context} ✨`
            : 'Check out this amazing post! ✨';

        return NextResponse.json(
            {
                caption: fallbackCaption,
                aiGenerated: false,
                fallback: true,
                error: error.message
            },
            { status: 200 } // Return 200 with fallback instead of error
        );
    }
}

