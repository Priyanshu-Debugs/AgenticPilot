// X/Twitter Tweet — Create and publish a tweet (with optional AI generation)
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { postTweet, isTokenExpired, refreshAccessToken } from '@/lib/twitter/client'
import { getModel } from '@/lib/ai/llm'
import { HumanMessage } from '@langchain/core/messages'
import type { TwitterConnection } from '@/lib/twitter/types'

// Zod schema for request validation
const createTweetSchema = z.object({
    productName: z.string().optional(),
    productDescription: z.string().optional(),
    productUrl: z.string().url().optional().or(z.literal('')),
    tone: z.string().optional().default('professional'),
    aiGenerate: z.boolean(),
    content: z.string().optional(),
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
        const parseResult = createTweetSchema.safeParse(body)

        if (!parseResult.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: parseResult.error.flatten() },
                { status: 400 }
            )
        }

        const { productName, productDescription, productUrl, tone, aiGenerate, content } = parseResult.data

        // Fetch X connection
        const { data: connection, error: connError } = await supabase
            .from('twitter_connections')
            .select('*')
            .eq('user_id', user.id)
            .single<TwitterConnection>()

        if (connError || !connection || !connection.access_token) {
            console.error('Twitter connection error:', connError?.message || 'No connection found')
            return NextResponse.json(
                { error: 'X account not connected' },
                { status: 400 }
            )
        }

        // Auto-refresh token if expired
        let accessToken = connection.access_token

        if (isTokenExpired(connection.expires_at) && connection.refresh_token) {
            try {
                const refreshed = await refreshAccessToken(
                    connection.client_id,
                    connection.client_secret,
                    connection.refresh_token
                )

                accessToken = refreshed.accessToken

                const newExpiresAt = refreshed.expiresIn
                    ? new Date(Date.now() + refreshed.expiresIn * 1000).toISOString()
                    : null

                await supabase
                    .from('twitter_connections')
                    .update({
                        access_token: refreshed.accessToken,
                        refresh_token: refreshed.refreshToken || connection.refresh_token,
                        expires_at: newExpiresAt,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('user_id', user.id)
            } catch (refreshError) {
                return NextResponse.json(
                    { error: 'Token expired. Please reconnect your X account.' },
                    { status: 401 }
                )
            }
        }

        // Determine tweet content
        let tweetContent: string

        if (aiGenerate) {
            // Generate tweet content using Gemini AI
            const model = getModel()

            const urlInstruction = productUrl
                ? `\n- Include this URL in the tweet: ${productUrl}\n- Make sure the total tweet (including URL) stays under 280 characters`
                : ''

            const prompt = `Write a tweet about this product:

Product: "${productName || 'a product'}"
Description: "${productDescription || 'a great product'}"

Tone: ${tone || 'professional'}

Requirements:
- Maximum 280 characters total
- Engaging and attention-grabbing
- Include 2-3 relevant hashtags
- Plain text only, no markdown
- Do NOT wrap the tweet in quotes${urlInstruction}

Write ONLY the tweet content, nothing else.`

            const response = await model.invoke([new HumanMessage(prompt)])
            tweetContent = typeof response.content === 'string'
                ? response.content.trim()
                : String(response.content).trim()

            // Enforce character limit
            if (tweetContent.length > 280) {
                tweetContent = tweetContent.substring(0, 280)
            }
        } else {
            if (!content) {
                return NextResponse.json(
                    { error: 'Content is required when aiGenerate is false' },
                    { status: 400 }
                )
            }
            tweetContent = content
        }

        // Publish to X
        console.log('Posting tweet, content length:', tweetContent.length)
        try {
            const result = await postTweet(accessToken, tweetContent)

            // Save to database as published
            const { data: savedTweet } = await supabase
                .from('twitter_tweets')
                .insert({
                    user_id: user.id,
                    content: tweetContent,
                    ai_generated: aiGenerate,
                    tone: tone || null,
                    product_name: productName || null,
                    product_description: productDescription || null,
                    x_tweet_id: result.id,
                    status: 'published',
                })
                .select('id')
                .single<{ id: string }>()

            return NextResponse.json({
                success: true,
                tweetId: savedTweet?.id,
                xTweetId: result.id,
                content: tweetContent,
            })
        } catch (postError: unknown) {
            console.error('X API post error (full):', postError)
            const errorMessage = postError instanceof Error
                ? postError.message
                : 'Unknown error posting to X'

            // Save as failed
            await supabase
                .from('twitter_tweets')
                .insert({
                    user_id: user.id,
                    content: tweetContent,
                    ai_generated: aiGenerate,
                    tone: tone || null,
                    product_name: productName || null,
                    product_description: productDescription || null,
                    status: 'failed',
                    error_message: errorMessage,
                })

            return NextResponse.json(
                { error: errorMessage, content: tweetContent },
                { status: 500 }
            )
        }
    } catch (err: unknown) {
        console.error('Twitter tweet error:', err)
        const message = err instanceof Error ? err.message : 'Failed to create tweet'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
