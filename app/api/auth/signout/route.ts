import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
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

    // Sign out the user with global scope to clear all sessions
    const { error } = await supabase.auth.signOut({ scope: 'global' })

    if (error) {
      console.error('Sign out error:', error)
      // Even if signOut fails, try to clear cookies
    }

    // Create response
    const response = NextResponse.json({
      success: !error,
      message: error ? 'Sign out had issues but cookies cleared' : 'Signed out successfully'
    })

    // Explicitly delete auth cookies to ensure clean logout
    const cookiesToDelete = [
      'sb-access-token',
      'sb-refresh-token',
      `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`
    ]

    cookiesToDelete.forEach(cookieName => {
      response.cookies.delete(cookieName)
    })

    // Also try to delete any Supabase auth cookies with prefix patterns
    cookieStore.getAll().forEach(cookie => {
      if (cookie.name.includes('sb-') && cookie.name.includes('-auth-token')) {
        response.cookies.delete(cookie.name)
      }
    })

    return response

  } catch (error) {
    console.error('Sign out API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
