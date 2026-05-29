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
            try {
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
            } catch (geminiError: any) {
                console.warn('Gemini API limit or error hit, using intelligent local template fallback:', geminiError)
                postContent = generateFallbackPost(topic || 'professional growth', tone || 'professional')
            }

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

function generateFallbackPost(topic: string, tone: string): string {
    // Standardize topic - strip surrounding quotes if any
    const cleanTopic = topic.trim().replace(/^["']|["']$/g, '')
    
    // Select styling and vocabulary based on tone
    let hook = ''
    let bodyPoints: string[] = []
    let cta = ''
    let hashtags: string[] = []

    switch (tone) {
        case 'casual':
            hook = `Let's talk about ${cleanTopic} for a second. 👇`
            bodyPoints = [
                `Honestly, it's one of those things that sounds complex but actually changes how you approach daily work once you get the hang of it.`,
                `Instead of overthinking the process, focusing on the core fundamentals of ${cleanTopic} is what really moves the needle.`,
                `Small, consistent steps are infinitely better than trying to optimize everything all at once.`
            ]
            cta = `How are you handling this in your own projects? Let's chat in the comments!`
            hashtags = ['#WorkLife', '#Ecosystem', '#Productivity', '#TechTalk']
            break
            
        case 'inspirational':
            hook = `The journey of mastering ${cleanTopic} is never a straight line. 🚀`
            bodyPoints = [
                `Every challenge we face in this area is actually an invitation to innovate, refine our processes, and grow.`,
                `True progress isn't about being perfect from day one—it's about the relentless pursuit of learning and adaptation.`,
                `When we look back, the breakthroughs we are most proud of are usually born from the hardest problems.`
            ]
            cta = `Keep pushing boundaries and staying curious. What is keeping you inspired today?`
            hashtags = ['#Inspiration', '#GrowthMindset', '#Leadership', '#Success']
            break

        case 'educational':
            hook = `💡 Quick breakdown on ${cleanTopic} and why it should be on your radar right now:`
            bodyPoints = [
                `1️⃣ Streamlined Efficiency: Focusing here removes major bottlenecks in your workflow almost immediately.`,
                `2️⃣ Scalable Design: Adopting solid principles early guarantees your projects remain maintainable over time.`,
                `3️⃣ Competitive Advantage: Understanding these shifts keeps you ahead of standard industry benchmarks.`
            ]
            cta = `What is your number one takeaway when dealing with this? Let me know below!`
            hashtags = ['#Learning', '#CareerDevelopment', '#BestPractices', '#KnowledgeSharing']
            break

        case 'thought-leadership':
            hook = `The landscape of our industry is being fundamentally reshaped by ${cleanTopic}. 🌐`
            bodyPoints = [
                `We are moving past simple optimizations. The true pioneers are re-architecting their entire strategy around these concepts.`,
                `To stay competitive, organizations must transition from passive observation to active experimentation.`,
                `The future belongs to those who build with adaptability and resilience at their core.`
            ]
            cta = `How is your team positioning itself for this next phase? Let's discuss.`
            hashtags = ['#ThoughtLeadership', '#Innovation', '#Strategy', '#FutureOfWork']
            break

        case 'professional':
        default:
            hook = `Reflecting on some key insights regarding ${cleanTopic} and its ongoing impact on our industry. 💼`
            bodyPoints = [
                `As professional workflows evolve, maintaining high standards in this area has become a primary driver of success.`,
                `Collaboration and robust design choices are essential to unlocking the full value of these modern practices.`,
                `Leveraging the right systems allows us to optimize efficiency without sacrificing quality.`
            ]
            cta = `Would love to hear your thoughts on how this is shaping your current business objectives!`
            hashtags = ['#ProfessionalGrowth', '#BusinessStrategy', '#IndustryInsights', '#LinkedInNetworking']
            break
    }

    // Assemble post
    return `${hook}

${bodyPoints.join('\n\n')}

${cta}

${hashtags.join(' ')}`
}
