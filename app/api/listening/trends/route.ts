// Next.js API Route for Social Listening trends analysis
// Path: app/api/listening/trends/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { listeningAgent } from '@/lib/agents/listeningAgent'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Retrieve the latest trend analysis
        const { data, error } = await supabase
            .from('listening_trends')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (error) {
            // Check if table is missing
            if (error.message.includes('does not exist')) {
                return NextResponse.json({
                    warning: 'Database table "listening_trends" is not configured yet. Please run the SQL script under supabase/migrations/20260529_create_listening_trends.sql in your Supabase SQL Editor.',
                    trends: []
                })
            }
            throw error
        }

        return NextResponse.json({ success: true, data })
    } catch (err: any) {
        console.error('Fetch listening trends route error:', err)
        return NextResponse.json({ error: err.message || 'Failed to fetch trends' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get optional keywords from body
        let queryKeywords: string[] = []
        try {
            const body = await req.json()
            if (body && Array.isArray(body.keywords)) {
                queryKeywords = body.keywords.map((k: string) => k.trim()).filter(Boolean)
            }
        } catch {
            // No body provided, use default keywords
        }

        // Run the LangGraph Social Listening agent
        const finalState = await listeningAgent.invoke({
            queryKeywords,
            scrapedData: [],
            summary: '',
            buzzScore: 0,
            trends: [],
            suggestedPosts: []
        }) as any

        // Save result to Supabase
        const insertPayload = {
            user_id: user.id,
            summary: finalState.summary,
            buzz_score: finalState.buzzScore,
            keywords: finalState.queryKeywords.length > 0 ? finalState.queryKeywords : ['Next.js', 'AI', 'React'],
            trend_metrics: finalState.trends,
            suggested_posts: finalState.suggestedPosts
        }

        const { data: savedData, error: dbError } = await supabase
            .from('listening_trends')
            .insert(insertPayload)
            .select()
            .single()

        if (dbError) {
            if (dbError.message.includes('does not exist')) {
                // Table doesn't exist, return live finalState directly with warning payload
                return NextResponse.json({
                    warning: 'Database table "listening_trends" is not configured yet. Run the SQL script supabase/migrations/20260529_create_listening_trends.sql to save trends in your database.',
                    success: true,
                    data: {
                        id: 'temp-preview',
                        user_id: user.id,
                        summary: finalState.summary,
                        buzz_score: finalState.buzzScore,
                        keywords: insertPayload.keywords,
                        trend_metrics: finalState.trends,
                        suggested_posts: finalState.suggestedPosts,
                        created_at: new Date().toISOString()
                    }
                })
            }
            throw dbError
        }

        return NextResponse.json({ success: true, data: savedData })
    } catch (err: any) {
        console.error('Trigger listening agent error:', err)
        return NextResponse.json({ error: err.message || 'Failed to trigger agent' }, { status: 500 })
    }
}
