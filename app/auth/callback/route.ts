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
            // Cookies are automatically handled by Supabase SSR
          },
        },
      }
    )

    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        const errorMessage = encodeURIComponent(error.message)
        
        // Handle specific error types
        if (error.message?.includes('expired') || error.message?.includes('invalid_grant')) {
          const message = type === 'recovery' ? 'Password reset link has expired' : 'Verification link has expired'
          const redirectPath = type === 'recovery' ? '/auth/forgot-password' : '/auth/signin'
          const errorType = type === 'recovery' ? 'session_expired' : 'verification_failed'
          return NextResponse.redirect(`${origin}${redirectPath}?error=${errorType}&message=${encodeURIComponent(message)}`)
        }
        
        if (error.message?.includes('already_used') || error.message?.includes('invalid_code')) {
          const message = type === 'recovery' 
            ? 'Password reset link is invalid or has already been used'
            : 'Verification link is invalid or has already been used'
          const redirectPath = type === 'recovery' ? '/auth/forgot-password' : '/auth/signin'
          const errorType = type === 'recovery' ? 'invalid_link' : 'verification_failed'
          return NextResponse.redirect(`${origin}${redirectPath}?error=${errorType}&message=${encodeURIComponent(message)}`)
        }
        
        // Generic error handling
        const redirectPath = type === 'recovery' ? '/auth/reset-password' : '/auth/signin'
        const errorType = type === 'recovery' ? 'recovery_failed' : 'verification_failed'
        return NextResponse.redirect(`${origin}${redirectPath}?error=${errorType}&message=${errorMessage}`)
      }

      if (data.session) {
        // For password recovery, redirect with session confirmation and timestamp
        if (type === 'recovery') {
          return NextResponse.redirect(`${origin}/auth/reset-password?type=recovery&session_valid=true&ts=${Date.now()}`)
        }
        
        // For regular email verification, redirect to dashboard
        return NextResponse.redirect(`${origin}/dashboard`)
      } else {
        // No session data returned
        const message = type === 'recovery' 
          ? 'Unable to establish password reset session'
          : 'Email verification failed'
        const redirectPath = type === 'recovery' ? '/auth/forgot-password' : '/auth/signin'
        const errorType = type === 'recovery' ? 'session_expired' : 'verification_failed'
        return NextResponse.redirect(`${origin}${redirectPath}?error=${errorType}&message=${encodeURIComponent(message)}`)
      }
    } catch (error) {
      console.error('Callback processing error:', error)
      const message = 'An unexpected error occurred'
      const redirectPath = type === 'recovery' ? '/auth/reset-password' : '/auth/signin'
      const errorType = type === 'recovery' ? 'recovery_failed' : 'verification_failed'
      return NextResponse.redirect(`${origin}${redirectPath}?error=${errorType}&message=${encodeURIComponent(message)}`)
    }
  }

  // If no code, redirect appropriately based on type
  const message = type === 'recovery' 
    ? 'Password reset link is invalid or expired'
    : 'Email verification link is invalid or expired'
  const redirectPath = type === 'recovery' ? '/auth/forgot-password' : '/auth/signin'
  const errorType = type === 'recovery' ? 'invalid_link' : 'no_code'
  return NextResponse.redirect(`${origin}${redirectPath}?error=${errorType}&message=${encodeURIComponent(message)}`)
}
