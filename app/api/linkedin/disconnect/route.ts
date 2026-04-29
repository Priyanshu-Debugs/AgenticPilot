// LinkedIn Disconnect — Remove connection
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

        // Delete the connection record
        const { error: deleteError } = await supabase
            .from('linkedin_connections')
            .delete()
            .eq('user_id', user.id)

        if (deleteError) {
            throw new Error(`Failed to delete connection: ${deleteError.message}`)
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('LinkedIn disconnect error:', err)
        return NextResponse.json(
            { error: 'Failed to disconnect LinkedIn' },
            { status: 500 }
        )
    }
}
