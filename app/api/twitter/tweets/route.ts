// X/Twitter Tweets — List recent tweets for the authenticated user
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import type { TwitterTweet } from '@/lib/twitter/types'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: tweets, error: queryError } = await supabase
            .from('twitter_tweets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20)
            .returns<TwitterTweet[]>()

        if (queryError) {
            console.error('Twitter tweets query error:', queryError)
            return NextResponse.json({ tweets: [] })
        }

        return NextResponse.json({ tweets: tweets || [] })
    } catch (err) {
        console.error('Twitter tweets error:', err)
        return NextResponse.json({ tweets: [] })
    }
}
