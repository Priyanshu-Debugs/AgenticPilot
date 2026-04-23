import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { captionGraph } from '@/lib/ai/graphs/instagram-caption-graph';

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

        // Use LangGraph caption agent
        const result = await captionGraph.invoke({
            context: context || 'General post',
            tone: tone || 'professional',
            caption: '',
        });

        return NextResponse.json({
            caption: result.caption,
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
                error: 'AI generation failed; using fallback'
            },
            { status: 200 } // Return 200 with fallback instead of error
        );
    }
}
