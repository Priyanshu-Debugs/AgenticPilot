// Gmail Logs - Activity history
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient(cookies())
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const limit = parseInt(searchParams.get('limit') || '20')

        // Fetch logs
        const { data: logs, error: logsError } = await supabase
            .from('gmail_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (logsError) {
            throw logsError
        }

        // Calculate stats
        const allLogs = logs || []
        const totalProcessed = allLogs.filter(l => l.action === 'analyzed' || l.action === 'replied').length
        const totalReplied = allLogs.filter(l => l.action === 'replied').length
        const successfulLogs = allLogs.filter(l => l.success)
        const responseTimes = allLogs
            .filter(l => l.response_time_ms > 0)
            .map(l => l.response_time_ms)

        const avgResponseTime = responseTimes.length > 0
            ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
            : 0

        const successRate = allLogs.length > 0
            ? Math.round((successfulLogs.length / allLogs.length) * 100)
            : 100

        return NextResponse.json({
            logs: allLogs.map(log => ({
                id: log.id,
                action: log.action,
                emailSubject: log.email_subject,
                emailFrom: log.email_from,
                confidence: log.confidence,
                success: log.success,
                responseTime: log.response_time_ms,
                createdAt: log.created_at,
            })),
            stats: {
                totalProcessed,
                totalReplied,
                avgResponseTime,
                successRate,
            },
        })
    } catch (error) {
        console.error('Logs error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch logs' },
            { status: 500 }
        )
    }
}
