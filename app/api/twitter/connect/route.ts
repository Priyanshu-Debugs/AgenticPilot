// X/Twitter Connect — Check status + Initiate OAuth PKCE flow
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { generateAuthLink, isTokenExpired, refreshAccessToken, getCallbackUrl } from '@/lib/twitter/client'
import type { TwitterConnection, TwitterConnectionPublic } from '@/lib/twitter/types'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check connection status
        const { data: connection } = await supabase
            .from('twitter_connections')
            .select('id, x_user_id, x_username, x_name, x_profile_image, expires_at, updated_at, client_id, client_secret, access_token, refresh_token')
            .eq('user_id', user.id)
            .single<TwitterConnection>()

        if (!connection || !connection.access_token) {
            return NextResponse.json({ connected: false, connection: null })
        }

        // Auto-refresh if token is expired
        if (isTokenExpired(connection.expires_at) && connection.refresh_token) {
            try {
                const refreshed = await refreshAccessToken(
                    connection.client_id,
                    connection.client_secret,
                    connection.refresh_token
                )

                const newExpiresAt = refreshed.expiresIn
                    ? new Date(Date.now() + refreshed.expiresIn * 1000).toISOString()
                    : null

                await supabase
                    .from('twitter_connections')
                    .update({
                        access_token: refreshed.accessToken,
                        refresh_token: refreshed.refreshToken || connection.refresh_token,
                        expires_at: newExpiresAt,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('user_id', user.id)
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError)
                // Return connected but with expired token info
            }
        }

        // Return public connection info (no secrets)
        const publicConnection: TwitterConnectionPublic = {
            id: connection.id,
            x_user_id: connection.x_user_id,
            x_username: connection.x_username,
            x_name: connection.x_name,
            x_profile_image: connection.x_profile_image,
            expires_at: connection.expires_at,
            updated_at: connection.updated_at,
        }

        return NextResponse.json({
            connected: true,
            connection: publicConnection,
            callbackUrl: getCallbackUrl(),
        })
    } catch (error) {
        console.error('Twitter status error:', error)
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

        const body = await req.json()
        const { clientId, clientSecret } = body

        if (!clientId || !clientSecret) {
            return NextResponse.json(
                { error: 'Client ID and Client Secret are required' },
                { status: 400 }
            )
        }

        // Generate PKCE auth link
        const { url, codeVerifier, state } = generateAuthLink(clientId, clientSecret)

        // Upsert connection with credentials and PKCE verifier
        const { error: upsertError } = await supabase
            .from('twitter_connections')
            .upsert(
                {
                    user_id: user.id,
                    client_id: clientId,
                    client_secret: clientSecret,
                    code_verifier: codeVerifier,
                    oauth_state: state,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'user_id' }
            )

        if (upsertError) {
            console.error('Twitter upsert error:', upsertError)
            return NextResponse.json(
                { error: 'Failed to save credentials' },
                { status: 500 }
            )
        }

        // Set CSRF state cookie (httpOnly, 10 min TTL)
        const cookieStore = await cookies()
        cookieStore.set('twitter_oauth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 600,
            path: '/',
        })

        return NextResponse.json({ authUrl: url, callbackUrl: getCallbackUrl() })
    } catch (error) {
        console.error('Twitter connect error:', error)
        return NextResponse.json(
            { error: 'Failed to initiate X connection' },
            { status: 500 }
        )
    }
}
