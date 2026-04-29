// LinkedIn API Client
// OAuth flow + API operations for LinkedIn automation

import type { LinkedInTokenResponse, LinkedInUserInfo } from './types'

// ============================================================
// Constants
// ============================================================

export const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization'
export const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
export const LINKEDIN_API_BASE = 'https://api.linkedin.com'
export const LINKEDIN_SCOPES = ['openid', 'profile', 'email', 'w_member_social']

// ============================================================
// OAuth Helpers
// ============================================================

/**
 * Build the full LinkedIn OAuth authorization URL.
 * @param state CSRF token to validate on callback
 */
export function getLinkedInAuthUrl(state: string): string {
    const clientId = process.env.LINKEDIN_CLIENT_ID
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI

    if (!clientId || !redirectUri) {
        throw new Error('Missing LINKEDIN_CLIENT_ID or LINKEDIN_REDIRECT_URI')
    }

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        state,
        scope: LINKEDIN_SCOPES.join(' '),
    })

    return `${LINKEDIN_AUTH_URL}?${params.toString()}`
}

/**
 * Exchange an authorization code for an access token.
 */
export async function exchangeCodeForToken(code: string): Promise<LinkedInTokenResponse> {
    const clientId = process.env.LINKEDIN_CLIENT_ID
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('Missing LinkedIn OAuth environment variables')
    }

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
    })

    const response = await fetch(LINKEDIN_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`LinkedIn token exchange failed: ${errorText}`)
    }

    const data: LinkedInTokenResponse = await response.json()
    return data
}

// ============================================================
// User Info
// ============================================================

/**
 * Fetch the authenticated user's profile from LinkedIn.
 * Uses the OpenID Connect /v2/userinfo endpoint.
 */
export async function getLinkedInUserInfo(accessToken: string): Promise<LinkedInUserInfo> {
    const response = await fetch(`${LINKEDIN_API_BASE}/v2/userinfo`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
        },
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`LinkedIn userinfo fetch failed: ${errorText}`)
    }

    const data: LinkedInUserInfo = await response.json()
    return data
}

// ============================================================
// Post Creation (UGC Posts API — NOT /v2/shares)
// ============================================================

/**
 * Publish a text post to LinkedIn via the UGC Posts API.
 *
 * IMPORTANT: Uses /v2/ugcPosts ONLY (never /v2/shares which is deprecated).
 * Always includes X-Restli-Protocol-Version: 2.0.0
 */
export async function createLinkedInPost(
    accessToken: string,
    personUrn: string,
    text: string
): Promise<{ id: string }> {
    const body = {
        author: `urn:li:person:${personUrn}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
            'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                    text,
                },
                shareMediaCategory: 'NONE',
            },
        },
        visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
    }

    const response = await fetch(`${LINKEDIN_API_BASE}/v2/ugcPosts`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`LinkedIn post creation failed: ${errorText}`)
    }

    const data = await response.json() as { id: string }
    return { id: data.id }
}

// ============================================================
// Token Utilities
// ============================================================

/**
 * Check if a LinkedIn access token has expired.
 * Returns true if the token is expired or expiry is unknown.
 */
export function isTokenExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false // No expiry recorded — assume valid

    const expiryTime = new Date(expiresAt).getTime()
    // Add 5-minute buffer before actual expiry
    return expiryTime < Date.now() + 5 * 60 * 1000
}
