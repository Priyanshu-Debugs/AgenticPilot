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

    // Get user settings from database
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

    // Return default settings if none exist
    const defaultSettings = {
      profile: {
        firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
        lastName: user.user_metadata?.full_name?.split(' ')[1] || '',
        email: user.email || '',
        company: '',
        timezone: 'America/New_York',
        language: 'en'
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        taskCompletion: true,
        lowStock: true,
        systemUpdates: true,
        weeklyReport: true
      },
      automation: {
        gmailEnabled: false,
        gmailCheckInterval: '5',
        instagramEnabled: false,
        instagramPostTime: '09:00',
        inventoryEnabled: false,
        inventoryThreshold: '10',
        autoReorder: false
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: '30',
        passwordExpiry: '90',
        loginNotifications: true
      },
      integrations: {
        gmailConnected: false,
        instagramConnected: false,
        inventoryConnected: false,
        webhookUrl: ''
      }
    }

    return NextResponse.json(settings?.settings || defaultSettings)
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

    // First try to update existing settings
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    let result
    if (existingSettings) {
      // Update existing record
      result = await supabase
        .from('user_settings')
        .update({
          settings: settings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
    } else {
      // Insert new record
      result = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          settings: settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
    }

    if (result.error) {
      console.error('Supabase settings error:', {
        error: result.error,
        user_id: user.id,
        operation: existingSettings ? 'update' : 'insert'
      })
      return NextResponse.json({ 
        error: `Failed to save settings: ${result.error.message}`,
        details: result.error.code 
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
