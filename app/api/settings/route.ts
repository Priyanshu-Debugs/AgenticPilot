import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user settings from database (RLS will automatically filter by auth.uid())
    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Supabase settings fetch error:', error)
      return NextResponse.json({ 
        error: `Failed to fetch settings: ${error.message}`,
        details: error.code 
      }, { status: 500 })
    }

    // Return settings from RLS-compliant structure
    const userSettings = settings || {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      email_notifications: true,
      push_notifications: true,
      marketing_emails: false,
      two_factor_enabled: false,
      gmail_auto_reply_enabled: false,
      gmail_reply_confidence_threshold: 0.8
    }

    // Map to existing frontend structure for backward compatibility
    const responseSettings = {
      profile: {
        firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
        lastName: user.user_metadata?.full_name?.split(' ')[1] || '',
        email: user.email || '',
        company: '',
        timezone: userSettings.timezone || 'America/New_York',
        language: userSettings.language || 'en'
      },
      notifications: {
        emailNotifications: userSettings.email_notifications ?? true,
        pushNotifications: userSettings.push_notifications ?? true,
        smsNotifications: false,
        taskCompletion: true,
        lowStock: true,
        systemUpdates: true,
        weeklyReport: true,
        marketingEmails: userSettings.marketing_emails ?? false
      },
      automation: {
        gmailEnabled: userSettings.gmail_auto_reply_enabled ?? false,
        gmailCheckInterval: '5',
        gmailConfidenceThreshold: userSettings.gmail_reply_confidence_threshold ?? 0.8,
        instagramEnabled: false,
        instagramPostTime: '09:00',
        inventoryEnabled: false,
        inventoryThreshold: '10',
        autoReorder: false
      },
      security: {
        twoFactorEnabled: userSettings.two_factor_enabled ?? false,
        sessionTimeout: '30',
        passwordExpiry: '90',
        loginNotifications: true
      },
      integrations: {
        gmailConnected: false,
        instagramConnected: false,
        inventoryConnected: false,
        webhookUrl: ''
      },
      appearance: {
        theme: userSettings.theme || 'system'
      }
    }

    return NextResponse.json(responseSettings)
  } catch (error) {
    console.error('Settings GET API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
    
    if (!user) {
      console.error('No user found in session')
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    console.log('Authenticated user:', { id: user.id, email: user.email })

    const settings = await request.json()

    // Validate settings structure
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 })
    }

    // Map frontend settings to RLS-compliant database structure
    const dbSettings = {
      user_id: user.id,
      theme: settings.appearance?.theme || 'system',
      language: settings.profile?.language || 'en',
      timezone: settings.profile?.timezone || 'UTC',
      email_notifications: settings.notifications?.emailNotifications ?? true,
      push_notifications: settings.notifications?.pushNotifications ?? true,
      marketing_emails: settings.notifications?.marketingEmails ?? false,
      two_factor_enabled: settings.security?.twoFactorEnabled ?? false,
      gmail_auto_reply_enabled: settings.automation?.gmailEnabled ?? false,
      gmail_reply_confidence_threshold: settings.automation?.gmailConfidenceThreshold ?? 0.8,
      updated_at: new Date().toISOString()
    }

    // Use upsert for RLS-compliant insert/update (will automatically filter by auth.uid())
    const { error: upsertError } = await supabase
      .from('user_settings')
      .upsert(dbSettings, {
        onConflict: 'user_id'
      })

    if (upsertError) {
      console.error('Supabase settings upsert error:', upsertError)
      return NextResponse.json({ 
        error: `Failed to save settings: ${upsertError.message}`,
        details: upsertError.code 
      }, { status: 500 })
    }

    console.log('Settings saved successfully for user:', user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings PUT API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
