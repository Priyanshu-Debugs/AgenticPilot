// LinkedIn Posts — List recent posts for the current user
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import type { LinkedInPost } from '@/lib/linkedin/types'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch last 20 posts, newest first
        const { data: posts, error: queryError } = await supabase
            .from('linkedin_posts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20)
            .returns<LinkedInPost[]>()

        if (queryError) {
            throw new Error(`Failed to fetch posts: ${queryError.message}`)
        }

        return NextResponse.json({ posts: posts || [] })
    } catch (err) {
        console.error('LinkedIn posts fetch error:', err)
        return NextResponse.json({ posts: [] }, { status: 200 })
    }
}
