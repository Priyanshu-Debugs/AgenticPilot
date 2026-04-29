// LinkedIn Connect — Initiates OAuth flow + checks connection status
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { getLinkedInAuthUrl } from '@/lib/linkedin/client'
import type { LinkedInConnection } from '@/lib/linkedin/types'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check connection status
        const { data: connection } = await supabase
            .from('linkedin_connections')
            .select('id, linkedin_name, linkedin_email, linkedin_picture, linkedin_person_urn, expires_at, updated_at')
            .eq('user_id', user.id)
            .single<Pick<LinkedInConnection, 'id' | 'linkedin_name' | 'linkedin_email' | 'linkedin_picture' | 'linkedin_person_urn' | 'expires_at' | 'updated_at'>>()

        return NextResponse.json({
            connected: !!connection,
            connection: connection || null,
        })
    } catch (error) {
        console.error('LinkedIn status error:', error)
        return NextResponse.json({ connected: false }, { status: 200 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Generate CSRF state token
        const state = crypto.randomUUID()

        // Build the auth URL
        const authUrl = getLinkedInAuthUrl(state)

        // Set CSRF state cookie (httpOnly, 10 min TTL)
        const cookieStore = await cookies()
        cookieStore.set('linkedin_oauth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 600, // 10 minutes
            path: '/',
        })

        return NextResponse.json({ authUrl })
    } catch (error) {
        console.error('LinkedIn connect error:', error)
        return NextResponse.json(
            { error: 'Failed to initiate LinkedIn connection' },
            { status: 500 }
        )
    }
}
