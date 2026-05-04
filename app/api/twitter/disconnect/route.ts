// X/Twitter Disconnect — Remove connection and associated data
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Delete tweets first (foreign key)
        await supabase
            .from('twitter_tweets')
            .delete()
            .eq('user_id', user.id)

        // Delete connection
        const { error: deleteError } = await supabase
            .from('twitter_connections')
            .delete()
            .eq('user_id', user.id)

        if (deleteError) {
            console.error('Twitter disconnect error:', deleteError)
            return NextResponse.json(
                { error: 'Failed to disconnect' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Twitter disconnect error:', err)
        return NextResponse.json(
            { error: 'Failed to disconnect' },
            { status: 500 }
        )
    }
}
