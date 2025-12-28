// Gmail Inbox - Fetch emails
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { fetchEmails, getEmail } from '@/lib/gmail/client'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const maxResults = parseInt(searchParams.get('limit') || '20')
        const unreadOnly = searchParams.get('unread') === 'true'
        const query = searchParams.get('q') || ''
        const emailId = searchParams.get('id')

        // If specific email ID requested
        if (emailId) {
            const email = await getEmail(user.id, emailId)
            if (!email) {
                return NextResponse.json({ error: 'Email not found' }, { status: 404 })
            }
            return NextResponse.json({ email })
        }

        // Fetch emails
        const emails = await fetchEmails(user.id, {
            maxResults,
            unreadOnly,
            query,
        })

        return NextResponse.json({
            emails,
            count: emails.length,
        })
    } catch (error: any) {
        console.error('Inbox error:', error)

        // Check if it's an auth error
        if (error.message?.includes('No tokens found')) {
            return NextResponse.json(
                { error: 'Gmail not connected', code: 'NOT_CONNECTED' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to fetch emails' },
            { status: 500 }
        )
    }
}
