import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
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

        const { templateBody, templateType, tone } = await req.json();

        if (!templateBody) {
            return NextResponse.json(
                { error: 'Template body is required' },
                { status: 400 }
            );
        }

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                {
                    error: 'AI feature not configured',
                    details: 'GEMINI_API_KEY environment variable is not set'
                },
                { status: 500 }
            );
        }

        // Use Gemini AI to improve the template
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are an expert email copywriter. Improve the following email template to be more professional, engaging, and effective.

Template Type: ${templateType || 'general'}
Desired Tone: ${tone || 'professional'}

Current Template:
${templateBody}

Please provide an improved version that:
1. Maintains the same general structure and purpose
2. Uses ${tone || 'professional'} tone
3. Is more engaging and personalized
4. Includes clear call-to-action where appropriate
5. Is concise and easy to read

Return ONLY the improved template text, without any explanations or additional commentary.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const improvedTemplate = response.text();

        return NextResponse.json({
            improvedTemplate,
            originalTemplate: templateBody,
        });

    } catch (error: any) {
        console.error('Template improvement error:', error);

        return NextResponse.json(
            {
                error: 'Failed to improve template',
                details: error.message
            },
            { status: 500 }
        );
    }
}
