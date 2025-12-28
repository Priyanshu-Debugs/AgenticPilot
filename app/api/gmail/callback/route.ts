// Gmail OAuth Callback
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { exchangeCodeForTokens, saveTokens } from '@/lib/gmail/oauth'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // userId
    const error = searchParams.get('error')

    const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Handle OAuth errors
    if (error) {
        console.error('OAuth error:', error)
        return NextResponse.redirect(
            `${redirectBase}/dashboard/gmail?error=oauth_denied`
        )
    }

    if (!code || !state) {
        return NextResponse.redirect(
            `${redirectBase}/dashboard/gmail?error=missing_params`
        )
    }

    try {
        // Verify the user session matches the state
        const supabase = await createClient(cookies())
        const { data: { user } } = await supabase.auth.getUser()

        if (!user || user.id !== state) {
            return NextResponse.redirect(
                `${redirectBase}/dashboard/gmail?error=session_mismatch`
            )
        }

        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code)

        // Save tokens to database
        await saveTokens(user.id, tokens)

        // Log the connection
        await supabase.from('gmail_logs').insert({
            user_id: user.id,
            action: 'connected',
            success: true,
            details: 'Gmail account connected successfully',
        })

        return NextResponse.redirect(
            `${redirectBase}/dashboard/gmail?success=connected`
        )
    } catch (error) {
        console.error('Callback error:', error)
        return NextResponse.redirect(
            `${redirectBase}/dashboard/gmail?error=callback_failed`
        )
    }
}
