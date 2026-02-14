// Gmail Automation Toggle API
// Enables/disables background auto-reply for the current user

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

// GET: Check automation status
export async function GET() {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data } = await supabase
            .from('gmail_tokens')
            .select('auto_reply_enabled')
            .eq('user_id', user.id)
            .single()

        return NextResponse.json({
            enabled: data?.auto_reply_enabled ?? false,
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST: Toggle automation on/off
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { enabled } = await req.json()

        if (typeof enabled !== 'boolean') {
            return NextResponse.json({ error: 'enabled must be a boolean' }, { status: 400 })
        }

        // Check if user has Gmail connected
        const { data: tokens } = await supabase
            .from('gmail_tokens')
            .select('user_id')
            .eq('user_id', user.id)
            .single()

        if (!tokens) {
            return NextResponse.json(
                { error: 'Gmail not connected. Connect Gmail first to enable automation.' },
                { status: 400 }
            )
        }

        // Update the automation setting
        const { error: updateError } = await supabase
            .from('gmail_tokens')
            .update({ auto_reply_enabled: enabled })
            .eq('user_id', user.id)

        if (updateError) {
            console.error('Failed to update automation setting:', updateError)
            return NextResponse.json(
                { error: 'Failed to update automation setting' },
                { status: 500 }
            )
        }

        // Create a notification about the change
        await supabase.from('notifications').insert({
            user_id: user.id,
            title: enabled
                ? '🤖 Background Automation Enabled'
                : '⏸️ Background Automation Disabled',
            message: enabled
                ? 'Your AI assistant will now automatically scan and reply to new emails every 5 minutes.'
                : 'Background email automation has been paused. You can still trigger auto-reply manually.',
            type: 'info',
            category: 'automation',
            action_url: '/dashboard/gmail',
            action_label: 'View Gmail Dashboard',
            read: false,
            created_at: new Date().toISOString(),
        })

        return NextResponse.json({
            success: true,
            enabled,
            message: enabled
                ? 'Background automation enabled'
                : 'Background automation disabled',
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
