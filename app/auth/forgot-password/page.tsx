"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bot, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/utils/auth/AuthProvider"

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  isBlocked: boolean
  nextAllowedTime?: number
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [rateLimitResult, setRateLimitResult] = useState<RateLimitResult | null>(null)
  const [urlError, setUrlError] = useState("")

  const { resetPassword, checkPasswordResetRateLimit } = useAuth()

  // Check for URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    const messageParam = urlParams.get('message')
    
    if (errorParam && messageParam) {
      const decodedMessage = decodeURIComponent(messageParam)
      
      switch (errorParam) {
        case 'session_expired':
          setUrlError(`${decodedMessage} Please request a new password reset link below.`)
          break
        case 'invalid_link':
          setUrlError(decodedMessage)
          break
        default:
          setUrlError(decodedMessage)
      }
      
      // Clean up URL after showing the error
      setTimeout(() => {
        const cleanUrl = window.location.pathname
        window.history.replaceState({}, document.title, cleanUrl)
      }, 2000)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Check rate limit before attempting
    const rateLimitCheck = await checkPasswordResetRateLimit()
    setRateLimitResult(rateLimitCheck)

    if (!rateLimitCheck.allowed) {
      setError("Too many password reset attempts. Please wait before trying again.")
      setIsLoading(false)
      return
    }

    try {
      const { error, rateLimitExceeded } = await resetPassword(email)
      
      if (rateLimitExceeded) {
        setError("Too many password reset attempts. Please wait before trying again.")
        setRateLimitResult(await checkPasswordResetRateLimit())
      } else if (error) {
        setError(error.message || "An error occurred while sending reset email")
        setRateLimitResult(await checkPasswordResetRateLimit())
      } else {
        setSuccess(true)
        setRateLimitResult(await checkPasswordResetRateLimit())
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setRateLimitResult(await checkPasswordResetRateLimit())
    } finally {
      setIsLoading(false)
    }
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

      {/* Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center container-padding py-8">
        <Card className="w-full max-w-md card-elevated">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
              {success ? "Check Your Email" : "Reset Password"}
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {success 
                ? "We've sent a password reset link to your email address" 
                : "Enter your email address and we'll send you a reset link"
              }
            </p>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-6">
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-500 mx-auto" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Please check your email and click the reset link to continue.
                  If you don't see the email, check your spam folder.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setSuccess(false)
                      setEmail("")
                      setRateLimitResult(null)
                    }}
                    variant="outline"
                    className="w-full"
                    disabled={rateLimitResult?.isBlocked}
                  >
                    Send Another Email
                  </Button>
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {urlError && (
                  <div className="mb-4 p-3 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    {urlError}
                  </div>
                )}
                {error && (
                  <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || rateLimitResult?.isBlocked}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/auth/signin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
