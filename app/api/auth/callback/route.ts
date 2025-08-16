import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const origin = requestUrl.origin

  if (code) {
    // Create response object to properly handle cookies
    const response = NextResponse.redirect(`${origin}/dashboard`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
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
        // Try to set up welcome notification for new users
        try {
          const { error: welcomeError } = await supabase.rpc('setup_user_welcome', {
            user_id: data.session.user.id,
            user_email: data.session.user.email || '',
            user_name: data.session.user.user_metadata?.full_name || ''
          })
          
          if (welcomeError) {
            console.warn('Welcome setup failed during callback (non-critical):', welcomeError)
          }
        } catch (welcomeError) {
          console.warn('Could not setup welcome data during callback:', welcomeError)
        }

        // For password recovery, redirect to reset password page
        if (type === 'recovery') {
          return NextResponse.redirect(`${origin}/auth/reset-password`)
        }
        
        // For regular email verification, redirect to dashboard
        return response
      }
    } catch (error) {
      console.error('Callback processing error:', error)
      return NextResponse.redirect(`${origin}/auth/signin?error=callback_error`)
    }
  }

  // If no code, redirect to signin with error
  return NextResponse.redirect(`${origin}/auth/signin?error=no_code`)
}
