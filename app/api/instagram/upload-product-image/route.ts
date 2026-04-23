import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient(cookies());
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10MB' },
                { status: 400 }
            );
        }

        const ext = file.name.split('.').pop() || 'png';
        const fileName = `${user.id}/original_${Date.now()}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Ensure the storage bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === 'product-images');
        if (!bucketExists) {
            const { error: createBucketError } = await supabase.storage.createBucket('product-images', {
                public: true,
                fileSizeLimit: 10 * 1024 * 1024, // 10MB
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            });
            if (createBucketError) {
                console.error('Bucket creation error:', createBucketError);
                return NextResponse.json(
                    {
                        error: 'Storage not configured. Please create a "product-images" bucket in your Supabase dashboard → Storage.',
                        details: createBucketError.message,
                    },
                    { status: 500 }
                );
            }
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json(
                { error: `Failed to upload image: ${uploadError.message}`, details: uploadError.message },
                { status: 500 }
            );
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

        return NextResponse.json({
            imageUrl: publicUrl,
            fileName,
            fileSize: file.size,
            fileType: file.type,
        });

    } catch (error: any) {
        console.error('Product image upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload image', details: error.message },
            { status: 500 }
        );
    }
}
