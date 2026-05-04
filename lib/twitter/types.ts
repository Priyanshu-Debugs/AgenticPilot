// X/Twitter TypeScript Types
// Clean, well-defined types for the Twitter automation system

/** Status of a tweet */
export type TweetStatus = 'draft' | 'published' | 'failed'

/** Tone options for AI-generated tweets */
export type TweetTone =
    | 'professional'
    | 'casual'
    | 'witty'
    | 'hype'
    | 'educational'

/** Maps 1:1 to the twitter_connections Supabase table */
export interface TwitterConnection {
    id: string
    user_id: string
    client_id: string
    client_secret: string
    access_token: string | null
    refresh_token: string | null
    x_user_id: string | null
    x_username: string | null
    x_name: string | null
    x_profile_image: string | null
    expires_at: string | null  // timestamptz as ISO string
    code_verifier: string | null
    oauth_state: string | null
    created_at: string
    updated_at: string
}

/** Maps 1:1 to the twitter_tweets Supabase table */
export interface TwitterTweet {
    id: string
    user_id: string
    content: string
    ai_generated: boolean
    tone: string | null
    product_name: string | null
    product_description: string | null
    x_tweet_id: string | null
    status: TweetStatus
    error_message: string | null
    created_at: string
}

/** Payload for creating a tweet via the API */
export interface CreateTweetPayload {
    productName?: string
    productDescription?: string
    productUrl?: string
    tone?: string
    aiGenerate: boolean
    content?: string
}

/** Safe connection info returned to the client (no secrets) */
export interface TwitterConnectionPublic {
    id: string
    x_user_id: string | null
    x_username: string | null
    x_name: string | null
    x_profile_image: string | null
    expires_at: string | null
    updated_at: string
}
