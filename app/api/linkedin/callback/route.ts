// LinkedIn OAuth Callback
// Handles the redirect from LinkedIn after user authorizes
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { exchangeCodeForToken, getLinkedInUserInfo } from '@/lib/linkedin/client'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Handle OAuth errors (user denied, etc.)
    if (error) {
        console.error('LinkedIn OAuth error:', error)
        return NextResponse.redirect(
            `${redirectBase}/dashboard/linkedin?error=oauth_denied`
        )
    }

    if (!code || !state) {
        return NextResponse.redirect(
            `${redirectBase}/dashboard/linkedin?error=missing_params`
        )
    }

    try {
        // Verify user session
        const supabase = await createClient(cookies())
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.redirect(
                `${redirectBase}/dashboard/linkedin?error=unauthorized`
            )
        }

        // Validate CSRF state from cookie
        const cookieStore = await cookies()
        const storedState = cookieStore.get('linkedin_oauth_state')?.value

        if (!storedState || storedState !== state) {
            return NextResponse.redirect(
                `${redirectBase}/dashboard/linkedin?error=state_mismatch`
            )
        }

        // Clear state cookie immediately
        cookieStore.set('linkedin_oauth_state', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        })

        // Exchange code for access token
        const tokenResponse = await exchangeCodeForToken(code)

        // Fetch LinkedIn user profile info
        const userInfo = await getLinkedInUserInfo(tokenResponse.access_token)

        // Calculate token expiry timestamp
        const expiresAt = new Date(
            Date.now() + tokenResponse.expires_in * 1000
        ).toISOString()

        // Upsert connection in database
        const { error: upsertError } = await supabase
            .from('linkedin_connections')
            .upsert(
                {
                    user_id: user.id,
                    access_token: tokenResponse.access_token,
                    linkedin_person_urn: userInfo.sub,
                    linkedin_name: userInfo.name,
                    linkedin_email: userInfo.email,
                    linkedin_picture: userInfo.picture,
                    expires_at: expiresAt,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'user_id' }
            )

        if (upsertError) {
            console.error('LinkedIn upsert error:', upsertError)
            return NextResponse.redirect(
                `${redirectBase}/dashboard/linkedin?error=save_failed`
            )
        }

        return NextResponse.redirect(
            `${redirectBase}/dashboard/linkedin?connected=true`
        )
    } catch (err) {
        console.error('LinkedIn callback error:', err)
        return NextResponse.redirect(
            `${redirectBase}/dashboard/linkedin?error=callback_failed`
        )
    }
}
