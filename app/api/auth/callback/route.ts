import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const origin = requestUrl.origin

  if (code) {
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

    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${origin}/auth/signin?error=auth_callback_error`)
      }

      if (data.session) {
        // Set up user data for new users
        try {
          // Create user profile if it doesn't exist
          const { error: profileError } = await supabase
            .from('user_profiles')
            .upsert({
              user_id: data.user.id,
              full_name: data.user.user_metadata?.full_name || '',
              avatar_url: data.user.user_metadata?.avatar_url || '',
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            })

          // Create user settings if it doesn't exist  
          const { error: settingsError } = await supabase
            .from('user_settings')
            .upsert({
              user_id: data.user.id,
              theme: 'system',
              language: 'en',
              timezone: 'UTC',
              email_notifications: true,
              push_notifications: true,
              marketing_emails: false,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            })

          // Create subscription record if it doesn't exist
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: data.user.id,
              plan_id: 'free',
              status: 'active',
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            })
          
          if (profileError) console.warn('Profile setup warning:', profileError)
          if (settingsError) console.warn('Settings setup warning:', settingsError)
          if (subscriptionError) console.warn('Subscription setup warning:', subscriptionError)

        } catch (setupError) {
          console.warn('Non-critical user setup error:', setupError)
        }

        // For password recovery, redirect to reset password page
        if (type === 'recovery') {
          return NextResponse.redirect(`${origin}/auth/reset-password`)
        }
        
        // For regular authentication, redirect to the requested page
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (error) {
      console.error('Callback processing error:', error)
      return NextResponse.redirect(`${origin}/auth/signin?error=callback_error`)
    }
  }

  // If no code, redirect to signin with error
  return NextResponse.redirect(`${origin}/auth/signin?error=no_code`)
}
