// Gmail OAuth Admin Utilities
// Cookie-free versions of oauth.ts functions for use in cron jobs / background tasks
// Uses Supabase admin client instead of cookie-based client

import { createAdminClient } from '@/utils/supabase/admin'
import { createOAuth2Client } from './oauth'
import type { GmailToken } from './types'

// Get tokens using admin client (no cookies needed)
export async function getTokensAdmin(userId: string): Promise<GmailToken | null> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('gmail_tokens')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (error || !data) {
        return null
    }

    const row = data as Record<string, string>

    return {
        access_token: row.access_token,
        refresh_token: row.refresh_token,
        expires_at: row.expires_at,
        token_type: row.token_type,
        scope: row.scope,
    }
}

// Save tokens using admin client (no cookies needed)
export async function saveTokensAdmin(userId: string, tokens: GmailToken): Promise<void> {
    const supabase = createAdminClient()

    const { error } = await supabase
        .from('gmail_tokens')
        .upsert({
            user_id: userId,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expires_at,
            token_type: tokens.token_type,
            scope: tokens.scope,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id'
        })

    if (error) {
        throw new Error(`Failed to save tokens: ${error.message}`)
    }
}

// Refresh access token if expired (admin version)
export async function refreshTokenIfNeededAdmin(userId: string): Promise<GmailToken> {
    const tokens = await getTokensAdmin(userId)

    if (!tokens) {
        throw new Error('No tokens found - user not connected')
    }

    // Check if token is expired (with 5 min buffer)
    const expiryTime = new Date(tokens.expires_at).getTime()
    const isExpired = expiryTime < Date.now() - 5 * 60 * 1000

    if (!isExpired) {
        return tokens
    }

    // Refresh the token
    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({
        refresh_token: tokens.refresh_token,
    })

    const { credentials } = await oauth2Client.refreshAccessToken()

    const newTokens: GmailToken = {
        access_token: credentials.access_token!,
        refresh_token: tokens.refresh_token, // Keep original refresh token
        expires_at: new Date(credentials.expiry_date!).toISOString(),
        token_type: credentials.token_type!,
        scope: tokens.scope,
    }

    await saveTokensAdmin(userId, newTokens)

    return newTokens
}

// Get all users who have Gmail connected and automation enabled
export async function getAutomationEnabledUsers(): Promise<Array<{ user_id: string }>> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('gmail_tokens')
        .select('user_id, auto_reply_enabled')
        .not('refresh_token', 'is', null)

    if (error || !data) {
        console.error('Error fetching automation users:', error)
        return []
    }

    // Filter users with auto_reply_enabled = true
    // If the column doesn't exist yet, include all connected users as a fallback
    return (data as Array<Record<string, any>>).filter(row => {
        // If auto_reply_enabled column exists and is explicitly false, skip
        if ('auto_reply_enabled' in row && row.auto_reply_enabled === false) {
            return false
        }
        return true
    }).map(row => ({ user_id: row.user_id as string }))
}
