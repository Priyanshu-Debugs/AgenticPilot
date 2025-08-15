"use client"

import { useState, useEffect } from 'react'
import { RateLimitResult, formatTimeRemaining } from '@/lib/rate-limiting'
import { AlertTriangle, Clock, Shield } from 'lucide-react'

interface RateLimitDisplayProps {
  result: RateLimitResult
  action: string
  className?: string
}

export function RateLimitDisplay({ result, action, className = "" }: RateLimitDisplayProps) {
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (result.isBlocked && result.nextAllowedTime) {
      const updateTimer = () => {
        const remaining = Math.max(0, result.nextAllowedTime! - Date.now())
        setTimeRemaining(remaining)
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)

      return () => clearInterval(interval)
    }
  }, [result.isBlocked, result.nextAllowedTime])

  if (!result.isBlocked && result.remaining > 1) {
    return null // Don't show anything if user has plenty of attempts left
  }

  return (
    <div className={`p-3 rounded-lg border ${className}`}>
      {result.isBlocked ? (
        <div className="flex items-start space-x-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <div className="font-medium">Too Many Attempts</div>
            <div className="text-sm">
              You've exceeded the maximum number of {action} attempts. 
              Please wait {formatTimeRemaining(timeRemaining)} before trying again.
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              Time remaining: {formatTimeRemaining(timeRemaining)}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start space-x-3 text-yellow-600 dark:text-yellow-400">
          <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <div className="font-medium">Rate Limit Warning</div>
            <div className="text-sm">
              You have {result.remaining} attempt{result.remaining !== 1 ? 's' : ''} remaining 
              before being temporarily blocked.
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Please double-check your information before submitting.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
