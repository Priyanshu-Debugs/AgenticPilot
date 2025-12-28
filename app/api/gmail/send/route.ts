// Gmail Send - Send emails/replies
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { sendReply, markAsRead } from '@/lib/gmail/client'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { to, subject, message, replyToId, threadId } = body

        if (!to || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: to, subject, message' },
                { status: 400 }
            )
        }

        const startTime = Date.now()

        // Send the email
        const messageId = await sendReply(user.id, {
            to,
            subject,
            body: message,
            inReplyTo: replyToId,
            threadId,
        })

        // Mark original as read if replying
        if (replyToId) {
            try {
                await markAsRead(user.id, replyToId)
            } catch (e) {
                console.warn('Could not mark as read:', e)
            }
        }

        const responseTime = Date.now() - startTime

        // Log the action
        await supabase.from('gmail_logs').insert({
            user_id: user.id,
            email_id: messageId,
            email_subject: subject,
            email_from: to,
            action: replyToId ? 'replied' : 'sent',
            reply_text: message,
            response_time_ms: responseTime,
            success: true,
        })

        return NextResponse.json({
            success: true,
            messageId,
            responseTime,
        })
    } catch (error: any) {
        console.error('Send error:', error)

        if (error.message?.includes('No tokens found')) {
            return NextResponse.json(
                { error: 'Gmail not connected' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        )
    }
}
