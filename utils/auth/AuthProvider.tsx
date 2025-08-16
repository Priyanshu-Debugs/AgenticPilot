"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  isBlocked: boolean
  nextAllowedTime?: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any, rateLimitExceeded?: boolean }>
  updatePassword: (newPassword: string) => Promise<{ error: any }>
  refreshSession: () => Promise<{ error: any }>
  checkPasswordResetRateLimit: () => Promise<RateLimitResult>
  checkSignInRateLimit: () => Promise<RateLimitResult>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  refreshSession: async () => ({ error: null }),
  checkPasswordResetRateLimit: async () => ({ allowed: true, remaining: 3, resetTime: 0, isBlocked: false }),
  checkSignInRateLimit: async () => ({ allowed: true, remaining: 5, resetTime: 0, isBlocked: false }),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPasswordResetFlow, setIsPasswordResetFlow] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Check if we're coming from a password reset link
    const urlParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const isPasswordReset = urlParams.has('type') && urlParams.get('type') === 'recovery'
    const hasResetTokens = hashParams.has('access_token') || hashParams.has('refresh_token')
    
    if (isPasswordReset || hasResetTokens) {
      setIsPasswordResetFlow(true)
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error getting session')
          }
        }
        setUser(session?.user ?? null)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error in getInitialSession')
        }
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only log non-sensitive information in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth state changed:', event)
        }
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Handle redirects based on auth state
        if (event === 'SIGNED_IN') {
          // Check if we're on the reset password page - if so, don't redirect
          const currentPath = window.location.pathname
          if (currentPath === '/auth/reset-password') {
            // Don't redirect, user is in password reset flow
            return
          }
          
          // Check URL parameters for password reset indicators
          const urlParams = new URLSearchParams(window.location.search)
          const isPasswordReset = urlParams.has('type') && urlParams.get('type') === 'recovery'
          
          if (isPasswordReset || isPasswordResetFlow) {
            // This is a password reset session, redirect to reset password page
            setIsPasswordResetFlow(true)
            router.push('/auth/reset-password')
            router.refresh()
          } else {
            // Normal sign-in, redirect to dashboard
            router.push('/dashboard')
            router.refresh()
          }
        } else if (event === 'SIGNED_OUT') {
          setIsPasswordResetFlow(false)
          router.push('/')
          router.refresh()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = async (email: string, password: string) => {
    // Check server-side rate limit before attempting sign in
    try {
      const rateLimitResponse = await fetch('/api/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sign-in', identifier: email })
      })
      
      const rateLimitResult = await rateLimitResponse.json()
      
      if (!rateLimitResult.allowed) {
        return { 
          error: { 
            message: 'Too many sign in attempts. Please wait before trying again.',
            rateLimitExceeded: true 
          } 
        }
      }
    } catch (rateLimitError) {
      // If rate limit check fails, continue with sign in (fallback)
      console.warn('Rate limit check failed:', rateLimitError)
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Record failed attempt for server-side rate limiting
        try {
          await fetch('/api/rate-limit', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'sign-in', identifier: email })
          })
        } catch (recordError) {
          console.warn('Failed to record rate limit attempt:', recordError)
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Sign in error:', error.message)
        }
        return { error }
      }

      return { error: null }
    } catch (error) {
      // Record failed attempt for server-side rate limiting
      try {
        await fetch('/api/rate-limit', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sign-in', identifier: email })
        })
      } catch (recordError) {
        console.warn('Failed to record rate limit attempt:', recordError)
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected sign in error')
      }
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Sign up error details:', {
            message: error.message,
            status: error.status,
            details: error
          })
        }
        
        // Provide user-friendly error messages
        let userMessage = error.message
        if (error.message?.includes('User already registered')) {
          userMessage = 'An account with this email already exists. Please sign in instead.'
        } else if (error.message?.includes('Database error')) {
          userMessage = 'There was a technical issue creating your account. Please try again in a moment.'
        } else if (error.message?.includes('Invalid email')) {
          userMessage = 'Please enter a valid email address.'
        } else if (error.message?.includes('Password')) {
          userMessage = 'Password does not meet requirements. Please check the password criteria.'
        }
        
        return { error: { ...error, message: userMessage } }
      }

      // If signup was successful and we have a user, try to set up welcome data manually
      if (data.user && !error) {
        try {
          // Call the manual welcome setup function
          const { error: welcomeError } = await supabase.rpc('setup_user_welcome', {
            user_id: data.user.id,
            user_email: email,
            user_name: fullName || ''
          })
          
          if (welcomeError) {
            console.warn('Welcome setup failed (non-critical):', welcomeError)
          }
        } catch (welcomeError) {
          // This is non-critical - don't fail signup if welcome setup fails
          console.warn('Could not setup welcome data:', welcomeError)
        }
      }

      // Note: User will need to confirm email before they can sign in
      return { error: null }
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected sign up error:', error)
      }
      return { 
        error: { 
          message: 'An unexpected error occurred during sign up. Please try again.',
          originalError: error
        } 
      }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error && process.env.NODE_ENV === 'development') {
        console.error('Sign out error:', error.message)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected sign out error')
      }
    }
  }

  const resetPassword = async (email: string) => {
    // Check server-side rate limit before attempting password reset
    try {
      const rateLimitResponse = await fetch('/api/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'password-reset', identifier: email })
      })
      
      const rateLimitResult = await rateLimitResponse.json()
      
      if (!rateLimitResult.allowed) {
        return { 
          error: { 
            message: 'Too many password reset attempts. Please wait before trying again.',
            rateLimitExceeded: true 
          },
          rateLimitExceeded: true
        }
      }
    } catch (rateLimitError) {
      // If rate limit check fails, continue with reset (fallback)
      console.warn('Rate limit check failed:', rateLimitError)
    }

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const redirectUrl = `${siteUrl}/auth/reset-password?type=recovery`
        
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password?type=recovery`,
      })

      if (error) {
        // Record failed attempt for server-side rate limiting
        try {
          await fetch('/api/rate-limit', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'password-reset', identifier: email })
          })
        } catch (recordError) {
          console.warn('Failed to record rate limit attempt:', recordError)
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Reset password error:', error.message)
        }
        return { error }
      }

      // Record successful attempt for server-side rate limiting (still counts toward limit)
      try {
        await fetch('/api/rate-limit', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'password-reset', identifier: email })
        })
      } catch (recordError) {
        console.warn('Failed to record rate limit attempt:', recordError)
      }
      
      return { error: null }
    } catch (error) {
      // Record failed attempt for server-side rate limiting
      try {
        await fetch('/api/rate-limit', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'password-reset', identifier: email })
        })
      } catch (recordError) {
        console.warn('Failed to record rate limit attempt:', recordError)
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected reset password error')
      }
      return { error }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      // First, try to refresh session to ensure we have the latest tokens
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
      
      if (refreshError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Session refresh failed:', refreshError.message)
        }
        // If refresh fails, try to get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          if (process.env.NODE_ENV === 'development') {
            console.error('No valid session for password update')
          }
          return { error: { message: 'Authentication session expired. Please request a new password reset link.' } }
        }
      }

      // Now attempt to update password with refreshed/current session
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Update password error:', error.message)
        }
        
        // Handle specific session errors
        if (error.message?.includes('Auth session missing') || 
            error.message?.includes('session_not_found') ||
            error.message?.includes('invalid_token')) {
          return { error: { message: 'Authentication session expired. Please request a new password reset link.' } }
        }
        
        return { error }
      }

      // Reset the password reset flow state
      setIsPasswordResetFlow(false)

      return { error: null }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected update password error')
      }
      return { error }
    }
  }

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Refresh session error:', error.message)
        }
        return { error }
      }

      setUser(session?.user ?? null)
      return { error: null }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected refresh session error')
      }
      return { error }
    }
  }

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
    
    // Fallback to default values if server-side fails
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
    
    // Fallback to default values if server-side fails
    return { allowed: true, remaining: 5, resetTime: 0, isBlocked: false }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    checkPasswordResetRateLimit,
    checkSignInRateLimit,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
