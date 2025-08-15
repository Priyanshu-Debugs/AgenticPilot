"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bot, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/utils/auth/AuthProvider"
import { RateLimitDisplay } from "@/components/ui/rate-limit-display"
import { RateLimitResult } from "@/lib/rate-limiting"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [rateLimitResult, setRateLimitResult] = useState<RateLimitResult | null>(null)

  const { resetPassword, checkPasswordResetRateLimit } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Check rate limit before attempting
    const rateLimitCheck = checkPasswordResetRateLimit()
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
        setRateLimitResult(checkPasswordResetRateLimit())
      } else if (error) {
        setError(error.message || "An error occurred while sending reset email")
        setRateLimitResult(checkPasswordResetRateLimit())
      } else {
        setSuccess(true)
        setRateLimitResult(checkPasswordResetRateLimit())
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setRateLimitResult(checkPasswordResetRateLimit())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-black dark:text-white" />
              <span className="text-xl font-bold">AgenticPilot</span>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-gray-200 dark:border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {success ? "Check Your Email" : "Reset Password"}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              {success 
                ? "We've sent a password reset link to your email address" 
                : "Enter your email address and we'll send you a reset link"
              }
            </p>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please check your email and click the reset link to continue.
                  If you don't see the email, check your spam folder.
                </p>
                {rateLimitResult && (
                  <RateLimitDisplay 
                    result={rateLimitResult} 
                    action="password reset requests"
                    className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  />
                )}
                <div className="space-y-2">
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
                {rateLimitResult && (
                  <RateLimitDisplay 
                    result={rateLimitResult} 
                    action="password reset requests"
                    className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                  />
                )}
                {error && (
                  <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-200 dark:border-gray-800"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    disabled={isLoading || rateLimitResult?.isBlocked}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/auth/signin" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline">
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
