// LinkedIn Post — Create and publish a post (with optional AI generation)
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { createLinkedInPost, registerLinkedInImage, uploadLinkedInImage, isTokenExpired } from '@/lib/linkedin/client'
import { getModel } from '@/lib/ai/llm'
import { HumanMessage } from '@langchain/core/messages'
import type { LinkedInConnection } from '@/lib/linkedin/types'

// Zod schema for request validation
const createPostSchema = z.object({
    topic: z.string().optional(),
    tone: z.string().optional().default('professional'),
    aiGenerate: z.boolean(),
    content: z.string().optional(),
    imageUrl: z.string().optional(),
})

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Validate request body
        const body = await req.json()
        const parseResult = createPostSchema.safeParse(body)

        if (!parseResult.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: parseResult.error.flatten() },
                { status: 400 }
            )
        }

        const { topic, tone, aiGenerate, content, imageUrl } = parseResult.data

        // Fetch LinkedIn connection
        const { data: connection, error: connError } = await supabase
            .from('linkedin_connections')
            .select('*')
            .eq('user_id', user.id)
            .single<LinkedInConnection>()

        if (connError || !connection) {
            return NextResponse.json(
                { error: 'LinkedIn account not connected' },
                { status: 400 }
            )
        }

        // Check token expiry
        if (isTokenExpired(connection.expires_at)) {
            return NextResponse.json(
                { error: 'LinkedIn token expired. Please reconnect your account.' },
                { status: 401 }
            )
        }

        // Determine post content
        let postContent: string

        if (aiGenerate) {
            // Generate post content using Gemini AI
            const model = getModel()
            const prompt = `Write a LinkedIn post about: "${topic || 'a professional topic'}"

Tone: ${tone || 'professional'}

Requirements:
- Maximum 1300 characters
- Engaging opening hook
- Include 3-5 relevant hashtags at the end
- Use line breaks for readability
- Professional but authentic voice
- Include a call to action or thought-provoking question at the end
- Do NOT use markdown formatting — plain text only
- Do NOT wrap the post in quotes

Write ONLY the post content, nothing else.`

            const response = await model.invoke([new HumanMessage(prompt)])
            postContent = typeof response.content === 'string'
                ? response.content.trim()
                : String(response.content).trim()

            // Enforce character limit
            if (postContent.length > 3000) {
                postContent = postContent.substring(0, 3000)
            }
        } else {
            if (!content) {
                return NextResponse.json(
                    { error: 'Content is required when aiGenerate is false' },
                    { status: 400 }
                )
            }
            postContent = content
        }

        // Publish to LinkedIn
        try {
            let mediaUrn: string | undefined = undefined

            if (imageUrl) {
                try {
                    const imageResponse = await fetch(imageUrl)
                    if (imageResponse.ok) {
                        const imageBuffer = await imageResponse.arrayBuffer()
                        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
                        
                        const registration = await registerLinkedInImage(
                            connection.access_token,
                            connection.linkedin_person_urn
                        )
                        
                        await uploadLinkedInImage(
                            registration.uploadUrl,
                            Buffer.from(imageBuffer),
                            contentType
                        )
                        
                        mediaUrn = registration.assetUrn
                    }
                } catch (mediaErr: any) {
                    console.error('LinkedIn image registration/upload failed:', mediaErr)
                    throw new Error(`Failed to upload attached image to LinkedIn: ${mediaErr.message}`)
                }
            }

            const result = await createLinkedInPost(
                connection.access_token,
                connection.linkedin_person_urn,
                postContent,
                mediaUrn
            )

            // Save to database as published
            const { data: savedPost } = await supabase
                .from('linkedin_posts')
                .insert({
                    user_id: user.id,
                    content: postContent,
                    ai_generated: aiGenerate,
                    tone: tone || null,
                    published_at: new Date().toISOString(),
                    linkedin_post_id: result.id,
                    status: 'published',
                })
                .select('id')
                .single<{ id: string }>()

            return NextResponse.json({
                success: true,
                postId: savedPost?.id,
                linkedinPostId: result.id,
                content: postContent,
            })
        } catch (postError: unknown) {
            const errorMessage = postError instanceof Error
                ? postError.message
                : 'Unknown error publishing to LinkedIn'

            // Save as failed
            await supabase
                .from('linkedin_posts')
                .insert({
                    user_id: user.id,
                    content: postContent,
                    ai_generated: aiGenerate,
                    tone: tone || null,
                    status: 'failed',
                    error_message: errorMessage,
                })

            return NextResponse.json(
                { error: errorMessage, content: postContent },
                { status: 500 }
            )
        }
    } catch (err: unknown) {
        console.error('LinkedIn post error:', err)
        const message = err instanceof Error ? err.message : 'Failed to create post'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
