import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { hashtagGraph } from '@/lib/ai/graphs/instagram-hashtag-graph';

export async function POST(req: NextRequest) {
    let category: string | undefined;
    let caption: string | undefined;

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
        caption = body.caption;
        category = body.category;

        if (!caption) {
            return NextResponse.json(
                { error: 'Caption is required' },
                { status: 400 }
            );
        }

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            // Return default hashtags as fallback
            const defaultHashtags = [
                '#instagram',
                '#instagood',
                '#photooftheday',
                '#beautiful',
                '#happy',
                '#love',
                '#instadaily',
                '#followme',
            ];

            return NextResponse.json({
                hashtags: defaultHashtags.slice(0, 10),
                aiGenerated: false,
                fallback: true,
            });
        }

        // Use LangGraph hashtag agent
        const result = await hashtagGraph.invoke({
            caption,
            category,
            hashtags: [],
        });

        // Ensure we have at least some hashtags
        if (!result.hashtags || result.hashtags.length === 0) {
            throw new Error('No valid hashtags generated');
        }

        return NextResponse.json({
            hashtags: result.hashtags,
            aiGenerated: true,
        });

    } catch (error: any) {
        console.error('Hashtag suggestion error:', error);

        // Provide fallback hashtags based on category
        const categoryHashtags: Record<string, string[]> = {
            business: ['#business', '#entrepreneur', '#startup', '#marketing', '#success', '#businessowner', '#entrepreneurship', '#motivation'],
            lifestyle: ['#lifestyle', '#lifestyleblogger', '#life', '#inspiration', '#motivation', '#happy', '#instagood', '#goals'],
            food: ['#food', '#foodie', '#foodporn', '#instafood', '#foodstagram', '#yummy', '#delicious', '#foodphotography'],
            travel: ['#travel', '#travelphotography', '#wanderlust', '#instatravel', '#travelgram', '#adventure', '#explore', '#vacation'],
            fashion: ['#fashion', '#style', '#ootd', '#fashionblogger', '#instafashion', '#outfit', '#fashionista', '#trendy'],
            general: ['#instagram', '#instagood', '#photooftheday', '#beautiful', '#happy', '#love', '#instadaily', '#followme'],
        };

        const fallbackHashtags = categoryHashtags[category?.toLowerCase() || 'general'] || categoryHashtags.general;

        return NextResponse.json(
            {
                hashtags: fallbackHashtags.slice(0, 10),
                aiGenerated: false,
                fallback: true,
                error: 'AI hashtag generation failed; using fallback hashtags.',
            },
            { status: 200 } // Return 200 with fallback instead of error
        );
    }
}
