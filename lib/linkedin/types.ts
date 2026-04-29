// LinkedIn TypeScript Types
// Clean, well-defined types for the LinkedIn automation system

/** Status of a LinkedIn post */
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

/** Tone options for AI-generated posts */
export type PostTone =
    | 'professional'
    | 'casual'
    | 'inspirational'
    | 'educational'
    | 'thought-leadership'

/** Maps 1:1 to the linkedin_connections Supabase table */
export interface LinkedInConnection {
    id: string
    user_id: string
    access_token: string
    linkedin_person_urn: string
    linkedin_name: string | null
    linkedin_email: string | null
    linkedin_picture: string | null
    expires_at: string | null  // timestamptz as ISO string
    created_at: string
    updated_at: string
}

/** Maps 1:1 to the linkedin_posts Supabase table */
export interface LinkedInPost {
    id: string
    user_id: string
    content: string
    ai_generated: boolean
    tone: string | null
    scheduled_at: string | null
    published_at: string | null
    linkedin_post_id: string | null
    status: PostStatus
    error_message: string | null
    created_at: string
}

/** Response from LinkedIn OAuth token exchange */
export interface LinkedInTokenResponse {
    access_token: string
    expires_in: number
}

/** Response from LinkedIn /v2/userinfo endpoint */
export interface LinkedInUserInfo {
    sub: string      // LinkedIn person URN (e.g. "abc123")
    name: string
    email: string
    picture: string
}

/** Payload for creating a LinkedIn post via the API */
export interface CreatePostPayload {
    topic?: string
    tone?: string
    aiGenerate: boolean
    content?: string
}
