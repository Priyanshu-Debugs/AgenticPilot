// Gmail Connect - Initiates OAuth flow
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { getAuthUrl } from '@/lib/gmail/oauth'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const authUrl = getAuthUrl(user.id)

        return NextResponse.json({ authUrl })
    } catch (error) {
        console.error('Gmail connect error:', error)
        return NextResponse.json(
            { error: 'Failed to initiate Gmail connection' },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check connection status
        const { data: tokens } = await supabase
            .from('gmail_tokens')
            .select('id, updated_at')
            .eq('user_id', user.id)
            .single()

        return NextResponse.json({
            connected: !!tokens,
            lastConnected: tokens?.updated_at || null,
        })
    } catch (error) {
        console.error('Gmail status error:', error)
        return NextResponse.json({ connected: false }, { status: 200 })
    }
}
