// Gmail Analyze - AI email analysis
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { getEmail } from '@/lib/gmail/client'
import { analyzeEmail, generateReply } from '@/lib/ai/email-analyzer'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { emailId, tone = 'professional', generateReplyOnly = false } = body

        if (!emailId) {
            return NextResponse.json(
                { error: 'emailId is required' },
                { status: 400 }
            )
        }

        // Fetch the email
        const email = await getEmail(user.id, emailId)
        if (!email) {
            return NextResponse.json(
                { error: 'Email not found' },
                { status: 404 }
            )
        }

        const startTime = Date.now()

        // Get business context if available
        const { data: businessInfo } = await supabase
            .from('business_info')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (generateReplyOnly) {
            // Just generate a reply
            const reply = await generateReply(email, tone)

            return NextResponse.json({
                reply,
                tone,
                generatedAt: new Date().toISOString(),
            })
        }

        // Full analysis
        const analysis = await analyzeEmail(email, {
            businessName: businessInfo?.business_name,
            industry: businessInfo?.industry,
            tone,
        })

        const responseTime = Date.now() - startTime

        // Log the analysis
        await supabase.from('gmail_logs').insert({
            user_id: user.id,
            email_id: emailId,
            email_subject: email.subject,
            email_from: email.from,
            action: 'analyzed',
            confidence: analysis.confidence,
            response_time_ms: responseTime,
            success: true,
            details: JSON.stringify({
                type: analysis.type,
                sentiment: analysis.sentiment,
                urgency: analysis.urgency,
            }),
        })

        return NextResponse.json({
            analysis,
            email: {
                id: email.id,
                from: email.from,
                subject: email.subject,
                snippet: email.snippet,
            },
            responseTime,
        })
    } catch (error: any) {
        console.error('Analyze error:', error)

        if (error.message?.includes('No tokens found')) {
            return NextResponse.json(
                { error: 'Gmail not connected' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to analyze email' },
            { status: 500 }
        )
    }
}
