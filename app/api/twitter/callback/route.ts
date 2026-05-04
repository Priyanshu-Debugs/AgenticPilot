// X/Twitter OAuth Callback
// Handles the redirect from X after user authorizes
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { exchangeCodeForTokens, getXUserInfo } from '@/lib/twitter/client'
import type { TwitterConnection } from '@/lib/twitter/types'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Handle OAuth errors (user denied, etc.)
    if (error) {
        console.error('X OAuth error:', error)
        return NextResponse.redirect(
            `${redirectBase}/dashboard/twitter?error=oauth_denied`
        )
    }

    if (!code || !state) {
        return NextResponse.redirect(
            `${redirectBase}/dashboard/twitter?error=missing_params`
        )
    }

    try {
        // Verify user session
        const supabase = await createClient(cookies())
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.redirect(
                `${redirectBase}/dashboard/twitter?error=unauthorized`
            )
        }

        // Validate CSRF state from cookie
        const cookieStore = await cookies()
        const storedState = cookieStore.get('twitter_oauth_state')?.value

        if (!storedState || storedState !== state) {
            return NextResponse.redirect(
                `${redirectBase}/dashboard/twitter?error=state_mismatch`
            )
        }

        // Clear state cookie immediately
        cookieStore.set('twitter_oauth_state', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        })

        // Retrieve stored PKCE verifier and app credentials
        const { data: connection, error: connError } = await supabase
            .from('twitter_connections')
            .select('client_id, client_secret, code_verifier')
            .eq('user_id', user.id)
            .single<Pick<TwitterConnection, 'client_id' | 'client_secret' | 'code_verifier'>>()

        if (connError || !connection || !connection.code_verifier) {
            console.error('Missing PKCE data:', connError)
            return NextResponse.redirect(
                `${redirectBase}/dashboard/twitter?error=missing_verifier`
            )
        }

        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(
            connection.client_id,
            connection.client_secret,
            code,
            connection.code_verifier
        )

        // Fetch X user profile
        const userInfo = await getXUserInfo(tokens.accessToken)

        // Calculate token expiry
        const expiresAt = tokens.expiresIn
            ? new Date(Date.now() + tokens.expiresIn * 1000).toISOString()
            : null

        // Update connection with tokens + profile info
        const { error: updateError } = await supabase
            .from('twitter_connections')
            .update({
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken || null,
                x_user_id: userInfo.id,
                x_username: userInfo.username,
                x_name: userInfo.name,
                x_profile_image: userInfo.profileImageUrl || null,
                expires_at: expiresAt,
                code_verifier: null, // Clear after use
                oauth_state: null,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)

        if (updateError) {
            console.error('Twitter update error:', updateError)
            return NextResponse.redirect(
                `${redirectBase}/dashboard/twitter?error=save_failed`
            )
        }

        return NextResponse.redirect(
            `${redirectBase}/dashboard/twitter?connected=true`
        )
    } catch (err) {
        console.error('Twitter callback error:', err)
        return NextResponse.redirect(
            `${redirectBase}/dashboard/twitter?error=callback_failed`
        )
    }
}
