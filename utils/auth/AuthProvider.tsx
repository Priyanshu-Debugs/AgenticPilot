'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

interface AuthUser {
  id: string
  email: string | undefined
  full_name?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
    [key: string]: any
  }
}


interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  isBlocked: boolean
  nextAllowedTime?: number
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string; message?: string; redirectTo?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string; url?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>
  resetPassword: (password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string; message?: string; redirectTo?: string }>
  checkAuthStatus: () => Promise<void>
  checkPasswordResetRateLimit: () => Promise<RateLimitResult>
  checkSignInRateLimit: () => Promise<RateLimitResult>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Check authentication status via API
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        credentials: 'include' // Include cookies
      })
      const data = await response.json()

      if (data.authenticated && data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth status check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Sign in via API
  const signIn = async (email: string, password: string) => {
    // Check rate limit first
    try {
      const rateLimitResponse = await fetch('/api/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sign-in', identifier: email })
      })
      
      const rateLimitResult = await rateLimitResponse.json()
      
      if (!rateLimitResult.allowed) {
        return { 
          success: false,
          error: 'Too many sign in attempts. Please wait before trying again.'
        }
      }
    } catch (rateLimitError) {
      console.warn('Rate limit check failed:', rateLimitError)
    }

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        await checkAuthStatus() // Refresh user data
        // Redirect to dashboard after successful sign-in
        router.push(data.redirectTo || '/dashboard')
        return { 
          success: true, 
          redirectTo: data.redirectTo 
        }
      } else {
        // Record failed attempt for rate limiting
        try {
          await fetch('/api/rate-limit', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'sign-in', identifier: email })
          })
        } catch (recordError) {
          console.warn('Failed to record rate limit attempt:', recordError)
        }

        return { 
          success: false, 
          error: data.error || 'Sign in failed' 
        }
      }
    } catch (error) {
      // Record failed attempt for rate limiting
      try {
        await fetch('/api/rate-limit', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sign-in', identifier: email })
        })
      } catch (recordError) {
        console.warn('Failed to record rate limit attempt:', recordError)
      }

      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      }
    }
  }

  // Sign up via API
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email, 
          password, 
          full_name: fullName 
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.requiresEmailConfirmation) {
          return { 
            success: true, 
            message: data.message 
          }
        } else {
          await checkAuthStatus() // Refresh user data
          // Redirect to dashboard after successful sign-up
          router.push(data.redirectTo || '/dashboard')
          return { 
            success: true, 
            redirectTo: data.redirectTo 
          }
        }
      } else {
        return { 
          success: false, 
          error: data.error || 'Sign up failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      }
    }
  }

  // Sign out via API
  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        setUser(null)
        // Redirect to landing page after successful sign-out
        router.push('/')
        return { success: true }
      } else {
        return { 
          success: false, 
          error: data.error || 'Sign out failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      }
    }
  }

  // Sign in with Google via API
  const signInWithGoogle = async () => {
    try {
      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          provider: 'google',
          redirectTo: '/dashboard'
        }),
      })

      const data = await response.json()

      if (data.success && data.url) {
        // Redirect to Google OAuth
        window.location.href = data.url
        return { 
          success: true, 
          url: data.url 
        }
      } else {
        return { 
          success: false, 
          error: data.error || 'OAuth failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      }
    }
  }

  // Forgot password via API
  const forgotPassword = async (email: string) => {
    // Check rate limit first
    try {
      const rateLimitResponse = await fetch('/api/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'password-reset', identifier: email })
      })
      
      const rateLimitResult = await rateLimitResponse.json()
      
      if (!rateLimitResult.allowed) {
        return { 
          success: false,
          error: 'Too many password reset attempts. Please wait before trying again.'
        }
      }
    } catch (rateLimitError) {
      console.warn('Rate limit check failed:', rateLimitError)
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      // Always record attempt for rate limiting
      try {
        await fetch('/api/rate-limit', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'password-reset', identifier: email })
        })
      } catch (recordError) {
        console.warn('Failed to record rate limit attempt:', recordError)
      }

      if (data.success) {
        return { 
          success: true, 
          message: data.message 
        }
      } else {
        return { 
          success: false, 
          error: data.error || 'Password reset failed' 
        }
      }
    } catch (error) {
      // Record failed attempt for rate limiting
      try {
        await fetch('/api/rate-limit', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'password-reset', identifier: email })
        })
      } catch (recordError) {
        console.warn('Failed to record rate limit attempt:', recordError)
      }

      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      }
    }
  }

  // Reset password via API
  const resetPassword = async (password: string, confirmPassword: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          password, 
          confirmPassword 
        }),
      })

      const data = await response.json()

      if (data.success) {
        await checkAuthStatus() // Refresh user data
        // Redirect to dashboard after successful password reset
        router.push(data.redirectTo || '/dashboard')
        return { 
          success: true, 
          message: data.message,
          redirectTo: data.redirectTo 
        }
      } else {
        return { 
          success: false, 
          error: data.error || 'Password reset failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      }
    }
  }

  // Rate limit checking functions
  const checkPasswordResetRateLimit = async () => {
    try {
      const response = await fetch('/api/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'password-reset' })
      })
      
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn('Failed to check password reset rate limit:', error)
    }
    
    return { allowed: true, remaining: 3, resetTime: 0, isBlocked: false }
  }

  const checkSignInRateLimit = async () => {
    try {
      const response = await fetch('/api/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sign-in' })
      })
      
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn('Failed to check sign-in rate limit:', error)
    }
    
    return { allowed: true, remaining: 5, resetTime: 0, isBlocked: false }
  }

  // Initialize auth status on mount
  useEffect(() => {
    checkAuthStatus()

    // Listen for auth state changes from Supabase (for real-time updates)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await checkAuthStatus()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    forgotPassword,
    resetPassword,
    checkAuthStatus,
    checkPasswordResetRateLimit,
    checkSignInRateLimit,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
