import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient(cookies())
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: logs, error: logsError } = await supabase
      .from("gmail_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)

    if (logsError) {
      throw logsError
    }

    const allLogs = logs || []
    const totalProcessed = allLogs.filter((log) => log.action === "analyzed" || log.action === "replied").length
    const autoReplies = allLogs.filter((log) => log.action === "replied").length
    const successfulLogs = allLogs.filter((log) => log.success)
    const responseTimes = allLogs
      .filter((log) => Number(log.response_time_ms) > 0)
      .map((log) => Number(log.response_time_ms))

    const avgResponseTimeMs = responseTimes.length
      ? Math.round(responseTimes.reduce((total, value) => total + value, 0) / responseTimes.length)
      : 0

    const successRate = allLogs.length
      ? Math.round((successfulLogs.length / allLogs.length) * 100)
      : 100

    const recentActivity = allLogs.slice(0, 8).map((log) => ({
      id: log.id,
      action: log.action,
      status: log.success ? "success" : "failed",
      details: log.email_subject || log.email_from || "Gmail automation event",
      timestamp: log.created_at,
      emailSubject: log.email_subject,
    }))

    return NextResponse.json({
      stats: {
        totalProcessed,
        autoReplies,
        avgResponseTime: (avgResponseTimeMs / 1000).toFixed(1),
        successRate: successRate.toFixed(1),
      },
      recentActivity,
    })
  } catch (error) {
    console.error("Gmail stats error:", error)
    return NextResponse.json({ error: "Failed to fetch Gmail stats" }, { status: 500 })
  }
}
