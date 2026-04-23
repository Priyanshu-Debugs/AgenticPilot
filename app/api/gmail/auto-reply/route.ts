// Gmail Auto-Reply - Automatically analyze and reply to unread emails
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { fetchEmails, getEmail, sendReply, markAsRead } from '@/lib/gmail/client'
import { analyzeEmail, generateReply } from '@/lib/ai/email-analyzer'
import { formatReplyWithTemplate } from '@/lib/gmail/reply-template'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { maxEmails = 10, tone = 'professional' } = body

        // Fetch unread emails
        const emails = await fetchEmails(user.id, { unreadOnly: true, maxResults: maxEmails })

        if (!emails || emails.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No unread emails to process',
                processed: 0,
                results: []
            })
        }

        // Get business context if available
        const { data: businessInfo } = await supabase
            .from('business_info')
            .select('*')
            .eq('user_id', user.id)
            .single()

        // Get human review setting
        const { data: tokenSettings } = await supabase
            .from('gmail_tokens')
            .select('human_review_enabled')
            .eq('user_id', user.id)
            .single()

        const humanReviewEnabled = tokenSettings?.human_review_enabled ?? false

        const results: Array<{
            emailId: string
            subject: string
            from: string
            status: 'success' | 'escalated' | 'error'
            error?: string
            escalationReason?: string
        }> = []

        // Process each email
        for (const emailSummary of emails) {
            const startTime = Date.now()

            try {
                // Fetch full email details
                const email = await getEmail(user.id, emailSummary.id)
                if (!email) {
                    results.push({
                        emailId: emailSummary.id,
                        subject: emailSummary.subject || 'Unknown',
                        from: emailSummary.from || 'Unknown',
                        status: 'error',
                        error: 'Could not fetch email details'
                    })
                    continue
                }

                // Analyze and generate reply
                const analysis = await analyzeEmail(email, {
                    businessName: businessInfo?.business_name,
                    industry: businessInfo?.industry,
                    tone,
                }, { humanReviewEnabled })

                const responseTime = Date.now() - startTime

                // Escalation: risky email — notify owner, skip reply
                if (analysis.escalated) {
                    await supabase.from('gmail_logs').insert({
                        user_id: user.id,
                        email_id: email.id,
                        email_subject: email.subject,
                        email_from: email.from,
                        action: 'escalated',
                        confidence: analysis.confidence,
                        response_time_ms: responseTime,
                        success: true,
                        details: JSON.stringify({
                            type: analysis.type,
                            sentiment: analysis.sentiment,
                            urgency: analysis.urgency,
                            escalationReason: analysis.escalationReason,
                        }),
                    })

                    try {
                        await supabase.from('notifications').insert({
                            user_id: user.id,
                            title: '\u26a0\ufe0f Email needs your review',
                            message: `AI skipped auto-reply for "${email.subject}" from ${email.from}.\n\nReason: ${analysis.escalationReason}\n\nPlease review and reply manually.`,
                            type: 'warning',
                            category: 'automation',
                            action_url: '/dashboard/gmail',
                            action_label: 'Review Email',
                            read: false,
                            created_at: new Date().toISOString(),
                        })
                    } catch (notifError) {
                        console.warn('Failed to create escalation notification:', notifError)
                    }

                    results.push({
                        emailId: email.id,
                        subject: email.subject || 'Unknown',
                        from: email.from || 'Unknown',
                        status: 'escalated',
                        escalationReason: analysis.escalationReason,
                    })
                    continue
                }

                if (!analysis.suggestedReply) {
                    results.push({
                        emailId: email.id,
                        subject: email.subject || 'Unknown',
                        from: email.from || 'Unknown',
                        status: 'error',
                        error: 'Could not generate reply'
                    })
                    continue
                }

                const formattedReply = formatReplyWithTemplate(analysis.suggestedReply, email.from)

                // Send the reply
                const messageId = await sendReply(user.id, {
                    to: email.from,
                    subject: email.subject?.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
                    body: formattedReply,
                    inReplyTo: email.id,
                    threadId: email.threadId,
                })

                // Mark as read
                try {
                    await markAsRead(user.id, email.id)
                } catch (e) {
                    console.warn('Could not mark as read:', e)
                }

                // Log the auto-reply action
                await supabase.from('gmail_logs').insert({
                    user_id: user.id,
                    email_id: email.id,
                    email_subject: email.subject,
                    email_from: email.from,
                    action: 'auto_replied',
                    reply_text: formattedReply,
                    confidence: analysis.confidence,
                    response_time_ms: responseTime,
                    success: true,
                    details: JSON.stringify({
                        type: analysis.type,
                        sentiment: analysis.sentiment,
                        urgency: analysis.urgency,
                        tone,
                    }),
                })

                results.push({
                    emailId: email.id,
                    subject: email.subject || 'Unknown',
                    from: email.from || 'Unknown',
                    status: 'success'
                })

            } catch (emailError: any) {
                console.error(`Error processing email ${emailSummary.id}:`, emailError)
                results.push({
                    emailId: emailSummary.id,
                    subject: emailSummary.subject || 'Unknown',
                    from: emailSummary.from || 'Unknown',
                    status: 'error',
                    error: emailError.message || 'Processing failed'
                })
            }
        }

        const successCount = results.filter(r => r.status === 'success').length
        const escalatedCount = results.filter(r => r.status === 'escalated').length
        const errorCount = results.filter(r => r.status === 'error').length

        // Create in-app notification if any emails were auto-replied
        if (successCount > 0) {
            const successfulReplies = results.filter(r => r.status === 'success')
            const emailList = successfulReplies
                .slice(0, 3)
                .map(r => `• "${r.subject}" from ${r.from}`)
                .join('\n')
            const remainingCount = successfulReplies.length - 3
            const remainingText = remainingCount > 0 ? `\n...and ${remainingCount} more` : ''

            try {
                await supabase.from('notifications').insert({
                    user_id: user.id,
                    title: `\ud83d\udce7 Auto-replied to ${successCount} email${successCount !== 1 ? 's' : ''}`,
                    message: `Your AI assistant replied to:\n${emailList}${remainingText}`,
                    type: 'success',
                    category: 'automation',
                    action_url: '/dashboard/gmail',
                    action_label: 'View Gmail Dashboard',
                    read: false,
                    created_at: new Date().toISOString(),
                })
            } catch (notifError) {
                console.warn('Failed to create notification:', notifError)
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${results.length} emails: ${successCount} replied, ${escalatedCount} escalated, ${errorCount} failed`,
            processed: results.length,
            successCount,
            escalatedCount,
            errorCount,
            results
        })

    } catch (error: any) {
        console.error('Auto-reply error:', error)

        if (error.message?.includes('No tokens found')) {
            return NextResponse.json(
                { error: 'Gmail not connected' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to process auto-replies' },
            { status: 500 }
        )
    }
}
