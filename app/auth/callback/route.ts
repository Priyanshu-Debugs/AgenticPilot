import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const origin = requestUrl.origin

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // Cookies will be handled by the server response
          },
        },
      }
    )

    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        const errorMessage = encodeURIComponent(error.message)
        if (type === 'recovery') {
          return NextResponse.redirect(`${origin}/auth/reset-password?error=recovery_failed&message=${errorMessage}`)
        }
        return NextResponse.redirect(`${origin}/auth/signin?error=verification_failed&message=${errorMessage}`)
      }

      if (data.session) {
        // For password recovery, redirect with session confirmation and timestamp
        if (type === 'recovery') {
          return NextResponse.redirect(`${origin}/auth/reset-password?type=recovery&session_valid=true&ts=${Date.now()}`)
        }
        
        // For regular email verification, redirect to dashboard
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    } catch (error) {
      console.error('Callback processing error:', error)
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/reset-password?error=recovery_failed&message=An unexpected error occurred`)
      }
      return NextResponse.redirect(`${origin}/auth/signin?error=verification_failed&message=An unexpected error occurred`)
    }
  }

  // If no code, redirect appropriately based on type
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/forgot-password?error=invalid_link&message=Password reset link is invalid or expired`)
  }
  return NextResponse.redirect(`${origin}/auth/signin?error=no_code&message=Email verification link is invalid or expired`)
}
