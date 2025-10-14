import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient(cookies())

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all gmail logs for this user
    const { data: logs, error: logsError } = await supabase
      .from('gmail_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (logsError) {
      console.error('Error fetching logs:', logsError)
      return NextResponse.json(
        { error: 'Failed to fetch logs' },
        { status: 500 }
      )
    }

    // Calculate stats
    const totalProcessed = logs?.length || 0
    
    // Count successful auto-replies (where action was 'reply' and success was true)
    const autoReplies = logs?.filter(log => 
      log.action === 'reply' && log.success === true
    ).length || 0

    // Calculate average response time
    const responseTimes = logs
      ?.filter(log => log.response_time_ms)
      .map(log => log.response_time_ms) || []
    
    const avgResponseTimeMs = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0
    
    // Convert to seconds with 1 decimal place
    const avgResponseTimeSec = (avgResponseTimeMs / 1000).toFixed(1)

    // Calculate success rate
    const successfulActions = logs?.filter(log => log.success === true).length || 0
    const successRate = totalProcessed > 0
      ? ((successfulActions / totalProcessed) * 100).toFixed(1)
      : '0.0'

    // Get recent activity (last 10 logs)
    const recentActivity = logs?.slice(0, 10).map(log => ({
      id: log.id,
      action: log.action,
      status: log.success ? 'success' : 'failed',
      details: log.details || log.error_message || 'No details',
      timestamp: log.created_at,
      confidence: log.confidence_score,
      emailSubject: log.email_subject
    })) || []

    return NextResponse.json({
      stats: {
        totalProcessed,
        autoReplies,
        avgResponseTime: avgResponseTimeSec,
        successRate
      },
      recentActivity,
      lastUpdated: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Stats API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
