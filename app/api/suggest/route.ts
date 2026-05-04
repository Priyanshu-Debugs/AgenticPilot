import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, suggestion } = body

    if (!suggestion?.trim()) {
      return NextResponse.json(
        { error: 'Please provide a suggestion' },
        { status: 400 }
      )
    }

    // Get the authenticated user (optional — for logged-in context)
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {},
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()

    const senderName = name || user?.user_metadata?.full_name || 'Anonymous User'
    const senderEmail = email || user?.email || 'no-email@unknown.com'

    // Try sending email via Nodemailer (Gmail SMTP)
      const gmailUser = process.env.SUGGEST_EMAIL_USER
      const gmailPass = process.env.SUGGEST_EMAIL_PASS
      const suggestTo = process.env.SUGGEST_EMAIL_TO || 'agenticpilot.team@gmail.com'

    if (gmailUser && gmailPass) {
      // Full Nodemailer SMTP path
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      })

      await transporter.sendMail({
        from: `"AgenticPilot Suggestions" <${gmailUser}>`,
          to: suggestTo,
        subject: `🤖 New Automation Suggestion from ${senderName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #7c3aed;">New Automation Suggestion</h2>
            <hr style="border: 1px solid #e5e7eb;" />
            <p><strong>From:</strong> ${senderName}</p>
            <p><strong>Email:</strong> ${senderEmail}</p>
            <p><strong>User ID:</strong> ${user?.id || 'Not logged in'}</p>
            <hr style="border: 1px solid #e5e7eb;" />
            <h3>Suggestion:</h3>
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="white-space: pre-wrap;">${suggestion}</p>
            </div>
            <hr style="border: 1px solid #e5e7eb;" />
            <p style="color: #6b7280; font-size: 12px;">Sent from AgenticPilot Dashboard</p>
          </div>
        `,
          replyTo: senderEmail,
      })

      return NextResponse.json({ success: true, method: 'email' })
    }

    // Fallback: Store suggestion in Supabase if no email credentials
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('No SUPABASE_SERVICE_ROLE_KEY found; skipping suggestion storage')
        return NextResponse.json({ success: true, method: 'skipped' })
      }

      const supabaseAdmin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          cookies: {
            getAll() { return cookieStore.getAll() },
            setAll() {},
          },
        }
      )

    // Try to insert into a suggestions table (will work if table exists)
    try {
      await supabaseAdmin.from('automation_suggestions').insert({
        user_id: user?.id || null,
        name: senderName,
        email: senderEmail,
        suggestion: suggestion.trim(),
        created_at: new Date().toISOString(),
      })
    } catch {
      // Table might not exist — that's okay
      console.log('Suggestion stored in logs (no DB table):', { senderName, senderEmail, suggestion })
    }

    return NextResponse.json({
      success: true,
      method: 'stored',
      message: 'Your suggestion has been received! We\'ll review it soon.',
    })
  } catch (error) {
    console.error('Suggest API error:', error)
    return NextResponse.json(
      { error: 'Failed to submit suggestion' },
      { status: 500 }
    )
  }
}
