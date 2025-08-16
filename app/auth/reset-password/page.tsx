"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bot, Eye, EyeOff, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/utils/auth/AuthProvider"
import { useRouter, useSearchParams } from "next/navigation"
import { validatePassword } from "@/lib/password-validation"

function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)

  const { resetPassword, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for URL parameters with error messages from callback
    const urlError = searchParams.get('error')
    const urlMessage = searchParams.get('message')
    const sessionValid = searchParams.get('session_valid')
    const timestamp = searchParams.get('ts')
    
    if (urlError && urlMessage) {
      switch (urlError) {
        case 'recovery_failed':
          setError(`Password recovery failed: ${decodeURIComponent(urlMessage)}`)
          break
        case 'no_code':
          setError('Password reset link is invalid or malformed.')
          break
        case 'session_expired':
          setError(decodeURIComponent(urlMessage))
          break
        default:
          setError(decodeURIComponent(urlMessage))
      }
    }

    // Check URL parameters for password reset tokens
    const urlParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const isPasswordReset = urlParams.has('type') && urlParams.get('type') === 'recovery'
    const hasAccessToken = hashParams.has('access_token')
    
    // Only log in development mode without sensitive data
    if (process.env.NODE_ENV === 'development') {
      console.log('Reset password page - Password reset detected:', isPasswordReset)
      console.log('Reset password page - Has access token:', hasAccessToken)
      console.log('Reset password page - Session valid flag:', sessionValid)
      console.log('Reset password page - User present:', !!user)
      console.log('Reset password page - Timestamp:', timestamp)
    }
    
    const handlePasswordResetSession = async () => {
      // Check if we have valid password reset indicators
      const isValidResetFlow = isPasswordReset || hasAccessToken || sessionValid === 'true'
      
      if (isValidResetFlow) {
        // This is a valid password reset session
        setIsValidSession(true)
        
  // If we have access tokens in the hash, try to refresh the session
  // (No longer supported)
        
        // Clean up URL after a delay to allow user to see the page
        const cleanupDelay = sessionValid === 'true' ? 5000 : 2000
        setTimeout(() => {
          const cleanUrl = window.location.pathname
          window.history.replaceState({}, document.title, cleanUrl)
        }, cleanupDelay)
        
        return // Exit early for valid reset flows
      }
      
      // If user has a valid session but no reset parameters, allow access
      if (user) {
        setIsValidSession(true)
        return
      }
      
      // Check if we're coming from a fresh reset link (within last 30 seconds)
      if (timestamp) {
        const linkTimestamp = parseInt(timestamp)
        const now = Date.now()
        const timeDiff = now - linkTimestamp
        
        if (timeDiff < 30000) { // 30 seconds grace period
          if (process.env.NODE_ENV === 'development') {
            console.log('Recent reset link detected, allowing extra time for session establishment')
          }
          setIsValidSession(true)
          
          // Set a longer timeout for recent links
          const timer = setTimeout(() => {
            if (!user && !isPasswordReset && sessionValid !== 'true') {
              router.push('/auth/forgot-password?error=session_expired&message=Password reset session expired')
            }
          }, 15000) // 15 seconds for recent links
          
          return () => clearTimeout(timer)
        }
      }
      
      // Default case: no valid session indicators and no user
      // Set a reasonable timeout before redirecting
      const timer = setTimeout(() => {
        if (!user && !isPasswordReset && sessionValid !== 'true') {
          router.push('/auth/forgot-password?error=session_expired&message=Password reset session expired')
        }
      }, 8000) // 8 seconds default timeout
      
      return () => clearTimeout(timer)
    }

    handlePasswordResetSession()
  }, [user, router, searchParams])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setError(`Password requirements not met: ${passwordValidation.errors.join(', ')}`)
      return
    }

    setIsLoading(true)

    try {
      const { error } = await resetPassword(password, confirmPassword)
      if (error) {
        setError(error || "An error occurred while updating password")
      } else {
        setSuccess(true)
        // Redirect to dashboard after successful password reset
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidSession && !user) {
    // Check if this is a session expiration case
    const urlError = searchParams.get('error')
    const isSessionExpired = urlError === 'session_expired'
    
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Navigation */}
        <nav className="border-b border-border bg-background/80 backdrop-blur-md">
          <div className="container-padding">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <span className="text-lg sm:text-xl font-bold">AgenticPilot</span>
              </Link>
              <ModeToggle />
            </div>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center container-padding py-8">
          <Card className="w-full max-w-md card-elevated">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold mb-2">
                {isSessionExpired ? "Session Expired" : "Invalid Reset Link"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {isSessionExpired 
                  ? "Your password reset session has expired. Please request a new reset link to continue."
                  : "This password reset link is invalid or has expired. You will be redirected to request a new one."
                }
              </p>
              {isSessionExpired && (
                <p className="text-sm text-muted-foreground mb-4">
                  Password reset links are valid for a limited time for security reasons.
                </p>
              )}
              <Link href="/auth/forgot-password">
                <Button>Request New Reset Link</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container-padding">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold">AgenticPilot</span>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* Reset Password Form */}
      <div className="flex-1 flex items-center justify-center container-padding py-8">
        <Card className="w-full max-w-md card-elevated">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
              {success ? "Password Updated!" : "Set New Password"}
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {success 
                ? "Your password has been successfully updated" 
                : "Enter your new password below"
              }
            </p>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-6">
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-500 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  You will be redirected to your dashboard shortly.
                </p>
                <Link href="/dashboard">
                  <Button className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                    {error}
                    {error.includes('session has expired') && (
                      <div className="mt-2 space-y-2">
                        <Link href="/auth/forgot-password" className="block text-center underline font-medium">
                          Request a new password reset link
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                        minLength={8}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pr-10"
                        minLength={8}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Password requirements:</div>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>At least 8 characters long</li>
                      <li>Contains uppercase and lowercase letters</li>
                      <li>Contains at least one number</li>
                      <li>Contains at least one special character</li>
                      <li>Not a commonly used password</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container-padding">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold">AgenticPilot</span>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center container-padding py-8">
        <Card className="w-full max-w-md card-elevated">
          <CardContent className="pt-6 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
