import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { productPhotoGraph } from '@/lib/ai/graphs/product-photo-graph';

interface GenerateRequest {
    productName: string;
    productDescription: string;
    style: 'studio' | 'lifestyle' | 'flat-lay' | 'minimal' | 'dramatic';
    originalImageUrl?: string;
}

const STYLE_SEEDS: Record<string, number> = {
    studio: 100,
    lifestyle: 200,
    'flat-lay': 300,
    minimal: 400,
    dramatic: 500,
};

export async function POST(req: NextRequest) {
    try {
        // Auth check
        const supabase = await createClient(cookies());
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: GenerateRequest = await req.json();
        const { productName, productDescription, style } = body;

        if (!productName || !productDescription || !style) {
            return NextResponse.json(
                { error: 'Missing required fields: productName, productDescription, style' },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'AI API not configured', details: 'Add GEMINI_API_KEY to .env.local' },
                { status: 500 }
            );
        }

        // 1. Use LangGraph product photo agent for structured content generation
        const result = await productPhotoGraph.invoke({
            productName,
            productDescription,
            style,
            aiContent: null,
        });

        const aiContent = result.aiContent || {
            photoDescription: `Beautiful ${style} style product photo of ${productName} — ${productDescription}`,
            caption: `Check out our amazing ${productName}! ✨ ${productDescription} #newproduct`,
            hashtags: ['product', 'photography', 'instagram', productName.toLowerCase().replace(/\s+/g, '')],
            postingTip: 'Post during peak engagement hours for maximum reach.',
        };

        // 2. Fetch a high-quality image from picsum (reliable, free, no auth needed)
        //    Use a deterministic seed per style so the user gets variety across styles
        const seed = (STYLE_SEEDS[style] || 0) + Date.now() % 1000;
        const imageUrl = `https://picsum.photos/seed/${seed}/1024/1024`;

        const imageResponse = await fetch(imageUrl, { redirect: 'follow' });

        if (!imageResponse.ok) {
            return NextResponse.json({
                imageBase64: null,
                imageUrl: imageUrl,
                style,
                aiContent,
                uploaded: false,
                note: 'AI content generated but image fetch failed. Use the image URL directly.',
            });
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

        // 3. Upload to Supabase Storage (skip gracefully if bucket missing)
        let publicUrl: string | null = null;
        let uploadError: any = null;
        try {
            const { data: buckets } = await supabase.storage.listBuckets();
            const bucketExists = buckets?.some(b => b.name === 'product-images');

            if (bucketExists) {
                const fileName = `${user.id}/${Date.now()}_${style}.jpg`;
                const { error: upErr } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, Buffer.from(imageBuffer), {
                        contentType,
                        upsert: false,
                    });
                uploadError = upErr;

                if (!uploadError) {
                    const { data: { publicUrl: url } } = supabase.storage
                        .from('product-images')
                        .getPublicUrl(fileName);
                    publicUrl = url;
                }
            } else {
                console.warn('Storage bucket "product-images" not found — skipping upload.');
            }
        } catch (storageErr) {
            console.warn('Storage upload skipped:', storageErr);
        }

        return NextResponse.json({
            imageBase64: `data:${contentType};base64,${base64Image}`,
            imageUrl: publicUrl || imageUrl,
            style,
            aiContent,
            uploaded: !uploadError,
        });

    } catch (error: any) {
        console.error('Product photo generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate product photo', details: error.message },
            { status: 500 }
        );
    }
}
