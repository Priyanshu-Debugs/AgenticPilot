import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Validation schema
const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(1, 'Full name is required').optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = signUpSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.error.issues 
        }, 
        { status: 400 }
      )
    }

    const { email, password, full_name } = validation.data
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

    // Sign up with email and password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || '',
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`
      }
    })

    if (error) {
      console.error('Sign up error:', error)
      
      // Return specific error messages
      if (error.message.includes('User already registered')) {
        return NextResponse.json(
          { 
            error: 'Account already exists', 
            message: 'An account with this email already exists. Please sign in instead.' 
          },
          { status: 409 }
        )
      }

      if (error.message.includes('Password should be at least 6 characters')) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Sign up failed' },
        { status: 400 }
      )
    }

    // If email confirmation is required
    if (!data.session) {
      return NextResponse.json({
        success: true,
        message: 'Please check your email for a confirmation link',
        requiresEmailConfirmation: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: full_name
        }
      })
    }

    // If user is immediately signed in (email confirmation disabled)
    try {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: data.user.id,
          full_name: full_name || '',
          avatar_url: '',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      // Create user settings
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

      // Create subscription record
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

      if (profileError) console.warn('Profile creation warning:', profileError)
      if (settingsError) console.warn('Settings creation warning:', settingsError)  
      if (subscriptionError) console.warn('Subscription creation warning:', subscriptionError)

    } catch (setupErr) {
      console.warn('Non-critical user setup error:', setupErr)
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: full_name,
      },
      redirectTo: '/dashboard'
    })

  } catch (error) {
    console.error('Sign up API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
