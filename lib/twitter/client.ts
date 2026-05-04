// X/Twitter API Client
// OAuth 2.0 PKCE flow + API operations using twitter-api-v2

import { TwitterApi } from 'twitter-api-v2'

// ============================================================
// Constants
// ============================================================

const TWITTER_CALLBACK_URL =
    (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/api/twitter/callback'

const TWITTER_SCOPES = ['tweet.read', 'tweet.write', 'users.read', 'offline.access']

// ============================================================
// OAuth 2.0 PKCE Helpers
// ============================================================

/**
 * Generate an OAuth 2.0 PKCE authorization link.
 * Returns the auth URL, code verifier (for later exchange), and state (for CSRF).
 */
export function generateAuthLink(
    clientId: string,
    clientSecret: string
): { url: string; codeVerifier: string; state: string } {
    const client = new TwitterApi({ clientId, clientSecret })

    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
        TWITTER_CALLBACK_URL,
        { scope: TWITTER_SCOPES }
    )

    return { url, codeVerifier, state }
}

/**
 * Exchange an authorization code + PKCE verifier for access and refresh tokens.
 */
export async function exchangeCodeForTokens(
    clientId: string,
    clientSecret: string,
    code: string,
    codeVerifier: string
): Promise<{
    accessToken: string
    refreshToken: string | undefined
    expiresIn: number | undefined
}> {
    const client = new TwitterApi({ clientId, clientSecret })

    const result = await client.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: TWITTER_CALLBACK_URL,
    })

    return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
    }
}

/**
 * Refresh an expired access token using a refresh token.
 */
export async function refreshAccessToken(
    clientId: string,
    clientSecret: string,
    refreshToken: string
): Promise<{
    accessToken: string
    refreshToken: string | undefined
    expiresIn: number | undefined
}> {
    const client = new TwitterApi({ clientId, clientSecret })

    const result = await client.refreshOAuth2Token(refreshToken)

    return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
    }
}

// ============================================================
// API Operations
// ============================================================

/**
 * Post a tweet to X.
 */
export async function postTweet(
    accessToken: string,
    text: string
): Promise<{ id: string }> {
    const client = new TwitterApi(accessToken)
    const result = await client.v2.tweet(text)
    return { id: result.data.id }
}

/**
 * Get the authenticated user's profile info.
 */
export async function getXUserInfo(accessToken: string): Promise<{
    id: string
    username: string
    name: string
    profileImageUrl: string | undefined
}> {
    const client = new TwitterApi(accessToken)
    const me = await client.v2.me({
        'user.fields': ['profile_image_url'],
    })

    return {
        id: me.data.id,
        username: me.data.username,
        name: me.data.name,
        profileImageUrl: me.data.profile_image_url,
    }
}

// ============================================================
// Token Utilities
// ============================================================

/**
 * Check if an X access token has expired.
 * Returns true if the token is expired or expiry is unknown.
 */
export function isTokenExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false

    const expiryTime = new Date(expiresAt).getTime()
    // 5-minute buffer before actual expiry
    return expiryTime < Date.now() + 5 * 60 * 1000
}

/**
 * Get the callback URL for X OAuth.
 */
export function getCallbackUrl(): string {
    return TWITTER_CALLBACK_URL
}
