import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

        // Use Gemini AI to suggest hashtags
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a social media expert specializing in Instagram hashtag strategy. Suggest relevant hashtags for an Instagram post.

Post Caption: "${caption}"
Category: ${category || 'general'}

Requirements:
1. Provide 10-15 highly relevant hashtags
2. Mix of popular, medium, and niche hashtags for better reach
3. All hashtags must start with #
4. Focus on current trends and high engagement potential
5. Relevant to the content and category
6. No banned or spam hashtags

Return ONLY a comma-separated list of hashtags (e.g., #hashtag1, #hashtag2, #hashtag3), nothing else.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const hashtagsText = response.text().trim();

        // Parse hashtags from the response in a robust way:
        // extract all hashtag-like tokens regardless of commas/newlines/bullets.
        const hashtagMatches = hashtagsText.match(/#\w+/g) || [];
        const hashtags = hashtagMatches
            .map(tag => tag.trim())
            .filter(tag => tag.length > 1)
            .slice(0, 15); // Limit to 15 hashtags

        // Ensure we have at least some hashtags
        if (hashtags.length === 0) {
            throw new Error('No valid hashtags generated');
        }

        return NextResponse.json({
            hashtags,
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
