// Cron Job: Auto-Reply to unread emails for all users with automation enabled
// Secured with CRON_SECRET — called by Vercel Cron or manual trigger
// This runs WITHOUT user cookies — uses admin Supabase client

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { getAutomationEnabledUsers } from '@/lib/gmail/oauth-admin'
import { fetchEmailsAdmin, getEmailAdmin, sendReplyAdmin, markAsReadAdmin } from '@/lib/gmail/client-admin'
import { analyzeEmail, generateReply } from '@/lib/ai/email-analyzer'
import { formatReplyWithTemplate } from '@/lib/gmail/reply-template'

// Vercel Cron calls GET endpoints
export async function GET(req: NextRequest) {
    try {
        // Verify cron secret for security
        const authHeader = req.headers.get('authorization')
        const cronSecret = process.env.CRON_SECRET

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabase = createAdminClient()

        // Get all users with automation enabled
        const users = await getAutomationEnabledUsers()

        if (users.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No users with automation enabled',
                usersProcessed: 0,
            })
        }

        const allResults: Array<{
            userId: string
            processed: number
            successCount: number
            escalatedCount: number
            errorCount: number
            errors: string[]
        }> = []

        // Process each user
        for (const userRecord of users) {
            const userId = userRecord.user_id
            const userResult = {
                userId,
                processed: 0,
                successCount: 0,
                escalatedCount: 0,
                errorCount: 0,
                errors: [] as string[],
            }

            try {
                // Fetch unread emails for this user
                const emails = await fetchEmailsAdmin(userId, {
                    unreadOnly: true,
                    maxResults: 10,
                })

                if (!emails || emails.length === 0) {
                    allResults.push(userResult)
                    continue
                }

                // Get business context if available
                const { data: businessInfoData } = await supabase
                    .from('business_info')
                    .select('*')
                    .eq('user_id', userId)
                    .single()

                const businessInfo = businessInfoData as Record<string, string> | null

                // Get human review setting
                const { data: tokenSettings } = await supabase
                    .from('gmail_tokens')
                    .select('human_review_enabled')
                    .eq('user_id', userId)
                    .single()

                const humanReviewEnabled = tokenSettings?.human_review_enabled ?? false

                const repliedEmails: Array<{ subject: string; from: string }> = []
                const escalatedEmails: Array<{ subject: string; from: string; reason: string }> = []

                // Process each email
                for (const emailSummary of emails) {
                    const startTime = Date.now()

                    try {
                        // Fetch full email details
                        const email = await getEmailAdmin(userId, emailSummary.id)
                        if (!email) {
                            userResult.errorCount++
                            userResult.errors.push(`Could not fetch email ${emailSummary.id}`)
                            continue
                        }

                        // Analyze and generate reply using LangGraph
                        const analysis = await analyzeEmail(email, {
                            businessName: businessInfo?.business_name,
                            industry: businessInfo?.industry,
                            tone: 'professional',
                        }, { humanReviewEnabled })

                        const responseTime = Date.now() - startTime

                        // Escalation: risky email — notify owner, skip reply
                        if (analysis.escalated) {
                            await supabase.from('gmail_logs').insert({
                                user_id: userId,
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
                                    source: 'cron',
                                }),
                            })

                            escalatedEmails.push({
                                subject: email.subject || 'No Subject',
                                from: email.from || 'Unknown',
                                reason: analysis.escalationReason || 'Needs review',
                            })

                            userResult.escalatedCount++
                            userResult.processed++
                            continue
                        }

                        if (!analysis.suggestedReply) {
                            userResult.errorCount++
                            userResult.errors.push(`No reply generated for: ${email.subject}`)
                            userResult.processed++
                            continue
                        }

                        const formattedReply = formatReplyWithTemplate(analysis.suggestedReply, email.from)

                        // Send the reply
                        await sendReplyAdmin(userId, {
                            to: email.from,
                            subject: email.subject?.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
                            body: formattedReply,
                            inReplyTo: email.id,
                            threadId: email.threadId,
                        })

                        // Mark as read
                        try {
                            await markAsReadAdmin(userId, email.id)
                        } catch (e) {
                            console.warn('Could not mark as read:', e)
                        }

                        // Log the auto-reply action
                        await supabase.from('gmail_logs').insert({
                            user_id: userId,
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
                                source: 'cron',
                            }),
                        })

                        repliedEmails.push({
                            subject: email.subject || 'No Subject',
                            from: email.from || 'Unknown',
                        })

                        userResult.successCount++
                    } catch (emailError: any) {
                        console.error(`Error processing email ${emailSummary.id} for user ${userId}:`, emailError)
                        userResult.errorCount++
                        userResult.errors.push(emailError.message || 'Processing failed')
                    }

                    userResult.processed++
                }

                // Notification for auto-replied emails
                if (repliedEmails.length > 0) {
                    const emailList = repliedEmails
                        .slice(0, 3)
                        .map(e => `• "${e.subject}" from ${e.from}`)
                        .join('\n')

                    const remainingCount = repliedEmails.length - 3
                    const remainingText = remainingCount > 0 ? `\n...and ${remainingCount} more` : ''

                    await supabase.from('notifications').insert({
                        user_id: userId,
                        title: `📧 Auto-replied to ${repliedEmails.length} email${repliedEmails.length !== 1 ? 's' : ''}`,
                        message: `Your AI assistant automatically replied to:\n${emailList}${remainingText}`,
                        type: 'success',
                        category: 'automation',
                        action_url: '/dashboard/gmail',
                        action_label: 'View Gmail Dashboard',
                        read: false,
                        created_at: new Date().toISOString(),
                    })
                }

                // Notification for escalated emails that need human review
                if (escalatedEmails.length > 0) {
                    const escList = escalatedEmails
                        .slice(0, 3)
                        .map(e => `• "${e.subject}" from ${e.from}\n  Reason: ${e.reason}`)
                        .join('\n')

                    const remainingEsc = escalatedEmails.length - 3
                    const remainingEscText = remainingEsc > 0 ? `\n...and ${remainingEsc} more` : ''

                    await supabase.from('notifications').insert({
                        user_id: userId,
                        title: `⚠️ ${escalatedEmails.length} email${escalatedEmails.length !== 1 ? 's need' : ' needs'} your review`,
                        message: `AI skipped auto-reply for these emails:\n${escList}${remainingEscText}\n\nPlease review and reply manually.`,
                        type: 'warning',
                        category: 'automation',
                        action_url: '/dashboard/gmail',
                        action_label: 'Review Emails',
                        read: false,
                        created_at: new Date().toISOString(),
                    })
                }

            } catch (userError: any) {
                console.error(`Error processing user ${userId}:`, userError)
                userResult.errors.push(`User-level error: ${userError.message}`)
            }

            allResults.push(userResult)
        }

        const totalProcessed = allResults.reduce((sum, r) => sum + r.processed, 0)
        const totalSuccess = allResults.reduce((sum, r) => sum + r.successCount, 0)
        const totalEscalated = allResults.reduce((sum, r) => sum + r.escalatedCount, 0)
        const totalErrors = allResults.reduce((sum, r) => sum + r.errorCount, 0)

        return NextResponse.json({
            success: true,
            message: `Cron completed: ${users.length} users, ${totalProcessed} emails processed, ${totalSuccess} replied, ${totalEscalated} escalated, ${totalErrors} failed`,
            usersProcessed: users.length,
            totalProcessed,
            totalSuccess,
            totalEscalated,
            totalErrors,
            results: allResults,
        })

    } catch (error: any) {
        console.error('Cron auto-reply error:', error)
        return NextResponse.json(
            { error: 'Cron job failed', details: error.message },
            { status: 500 }
        )
    }
}
