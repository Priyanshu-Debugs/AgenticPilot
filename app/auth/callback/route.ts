import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

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
            // Cookies will be set on the response
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
        // Check if this is a password recovery session
        if (type === 'recovery') {
          // Create response with proper redirect and session persistence
          const response = NextResponse.redirect(`${origin}/auth/reset-password?type=recovery&session_valid=true`)
          
          // Set session cookies manually to ensure persistence for password reset
          if (data.session.access_token && data.session.refresh_token) {
            const cookieOptions = {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax' as const,
              maxAge: 60 * 60, // 1 hour for password reset
              path: '/',
            }
            
            response.cookies.set('sb-access-token', data.session.access_token, cookieOptions)
            response.cookies.set('sb-refresh-token', data.session.refresh_token, cookieOptions)
          }
          
          return response
        }
        
        // For regular email verification, redirect to dashboard
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    } catch (error) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/reset-password?error=recovery_failed&message=An unexpected error occurred`)
      }
      return NextResponse.redirect(`${origin}/auth/signin?error=verification_failed&message=An unexpected error occurred`)
    }
  }

  // If no code, redirect appropriately based on type
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/reset-password?error=no_code&message=Password reset link is invalid`)
  }
  return NextResponse.redirect(`${origin}/auth/signin?error=no_code&message=Email verification link is invalid`)
}
