// Gmail OAuth Utilities
// Handles token storage, refresh, and OAuth flow

import { google } from 'googleapis'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import type { GmailToken } from './types'

// Gmail scopes needed for full functionality
export const GMAIL_SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
]

// Create OAuth2 client
export function createOAuth2Client() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/gmail/callback`

    if (!clientId || !clientSecret) {
        throw new Error('Missing Google OAuth credentials')
    }

    return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

// Generate OAuth URL for user consent
export function getAuthUrl(userId: string): string {
    const oauth2Client = createOAuth2Client()

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: GMAIL_SCOPES,
        prompt: 'consent',
        state: userId,
    })
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string): Promise<GmailToken> {
    const oauth2Client = createOAuth2Client()
    const { tokens } = await oauth2Client.getToken(code)

    return {
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token!,
        expires_at: new Date(tokens.expiry_date!).toISOString(),
        token_type: tokens.token_type!,
        scope: tokens.scope!,
    }
}

// Save tokens to database
export async function saveTokens(userId: string, tokens: GmailToken): Promise<void> {
    const supabase = await createClient(cookies())

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
        })

    if (error) {
        throw new Error(`Failed to save tokens: ${error.message}`)
    }
}

// Get tokens from database
export async function getTokens(userId: string): Promise<GmailToken | null> {
    const supabase = await createClient(cookies())

    const { data, error } = await supabase
        .from('gmail_tokens')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (error || !data) {
        return null
    }

    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        token_type: data.token_type,
        scope: data.scope,
    }
}

// Delete tokens (disconnect)
export async function deleteTokens(userId: string): Promise<void> {
    const supabase = await createClient(cookies())

    const { error } = await supabase
        .from('gmail_tokens')
        .delete()
        .eq('user_id', userId)

    if (error) {
        throw new Error(`Failed to delete tokens: ${error.message}`)
    }
}

// Check if user has valid tokens
export async function isConnected(userId: string): Promise<boolean> {
    const tokens = await getTokens(userId)
    return tokens !== null && tokens.refresh_token !== null
}

// Refresh access token if expired
export async function refreshTokenIfNeeded(userId: string): Promise<GmailToken> {
    const tokens = await getTokens(userId)

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

    await saveTokens(userId, newTokens)

    return newTokens
}
