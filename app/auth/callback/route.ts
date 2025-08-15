import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
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
        return NextResponse.redirect(`${origin}/auth/signin?error=verification_failed&message=${encodeURIComponent(error.message)}`)
      }

      if (data.session) {
        // Redirect to dashboard on successful verification
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    } catch (error) {
      return NextResponse.redirect(`${origin}/auth/signin?error=verification_failed&message=An unexpected error occurred`)
    }
  }

  // If no code, redirect to signin
  return NextResponse.redirect(`${origin}/auth/signin?error=no_code&message=Email verification link is invalid`)
}
