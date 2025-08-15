"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { passwordResetLimiter, signInLimiter, RateLimitResult } from '@/lib/rate-limiting'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any, rateLimitExceeded?: boolean }>
  updatePassword: (newPassword: string) => Promise<{ error: any }>
  refreshSession: () => Promise<{ error: any }>
  checkPasswordResetRateLimit: () => RateLimitResult
  checkSignInRateLimit: () => RateLimitResult
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
  checkPasswordResetRateLimit: () => ({ allowed: true, remaining: 3, resetTime: 0, isBlocked: false }),
  checkSignInRateLimit: () => ({ allowed: true, remaining: 5, resetTime: 0, isBlocked: false }),
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
    // Check rate limit before attempting sign in
    const rateLimitCheck = signInLimiter.checkLimit(email)
    if (!rateLimitCheck.allowed) {
      return { 
        error: { 
          message: 'Too many sign in attempts. Please wait before trying again.',
          rateLimitExceeded: true 
        } 
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Record failed attempt for rate limiting
        signInLimiter.recordAttempt()
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Sign in error:', error.message)
        }
        return { error }
      }

      // Reset rate limit on successful sign in
      signInLimiter.reset()
      return { error: null }
    } catch (error) {
      // Record failed attempt for rate limiting
      signInLimiter.recordAttempt()
      
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected sign in error')
      }
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const redirectUrl = `${siteUrl}/auth/callback`
        
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
          emailRedirectTo: redirectUrl
        }
      })

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Sign up error:', error.message)
        }
        return { error }
      }

      // Note: User will need to confirm email before they can sign in
      return { error: null }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected sign up error')
      }
      return { error }
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
    // Check rate limit before attempting password reset
    const rateLimitCheck = passwordResetLimiter.checkLimit(email)
    if (!rateLimitCheck.allowed) {
      return { 
        error: { 
          message: 'Too many password reset attempts. Please wait before trying again.',
          rateLimitExceeded: true 
        },
        rateLimitExceeded: true
      }
    }

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const redirectUrl = `${siteUrl}/auth/callback?type=recovery`
        
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        // Record failed attempt for rate limiting
        passwordResetLimiter.recordAttempt()
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Reset password error:', error.message)
        }
        return { error }
      }

      // Record successful attempt for rate limiting (still counts toward limit)
      passwordResetLimiter.recordAttempt()
      return { error: null }
    } catch (error) {
      // Record failed attempt for rate limiting
      passwordResetLimiter.recordAttempt()
      
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected reset password error')
      }
      return { error }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      // First, check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        if (process.env.NODE_ENV === 'development') {
          console.error('No valid session for password update')
        }
        return { error: { message: 'Authentication session expired. Please request a new password reset link.' } }
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Update password error:', error.message)
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

  const checkPasswordResetRateLimit = () => {
    return passwordResetLimiter.checkLimit()
  }

  const checkSignInRateLimit = () => {
    return signInLimiter.checkLimit()
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
