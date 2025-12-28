// Gmail Disconnect - Revoke access
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { deleteTokens } from '@/lib/gmail/oauth'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Delete tokens from database
        await deleteTokens(user.id)

        // Log the disconnection
        await supabase.from('gmail_logs').insert({
            user_id: user.id,
            action: 'disconnected',
            success: true,
            details: 'Gmail account disconnected',
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Disconnect error:', error)
        return NextResponse.json(
            { error: 'Failed to disconnect Gmail' },
            { status: 500 }
        )
    }
}
