/**
 * Client-side rate limiting utility for password reset requests
 * Prevents spam and abuse while providing good user experience
 */

export interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  blockDurationMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  isBlocked: boolean
  nextAllowedTime?: number
}

export interface RateLimitStore {
  attempts: number
  firstAttempt: number
  lastAttempt: number
  blocked: boolean
  blockUntil?: number
}

// Default configuration for password reset requests
const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 3, // 3 attempts
  windowMs: 15 * 60 * 1000, // 15 minutes window
  blockDurationMs: 30 * 60 * 1000, // 30 minutes block
}

class RateLimiter {
  private config: RateLimitConfig
  private storageKey: string

  constructor(key: string, config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.storageKey = `rateLimit_${key}`
  }

  private getStore(): RateLimitStore {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) {
        return {
          attempts: 0,
          firstAttempt: 0,
          lastAttempt: 0,
          blocked: false,
        }
      }
      return JSON.parse(stored)
    } catch {
      return {
        attempts: 0,
        firstAttempt: 0,
        lastAttempt: 0,
        blocked: false,
      }
    }
  }

  private setStore(store: RateLimitStore): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(store))
    } catch {
      // Handle localStorage quota exceeded or other errors
      console.warn('Failed to store rate limit data')
    }
  }

  private isWindowExpired(store: RateLimitStore): boolean {
    const now = Date.now()
    return now - store.firstAttempt > this.config.windowMs
  }

  private isBlockExpired(store: RateLimitStore): boolean {
    if (!store.blocked || !store.blockUntil) return true
    return Date.now() > store.blockUntil
  }

  checkLimit(userIdentifier?: string): RateLimitResult {
    const now = Date.now()
    let store = this.getStore()

    // Check if block has expired
    if (store.blocked && this.isBlockExpired(store)) {
      store = {
        attempts: 0,
        firstAttempt: 0,
        lastAttempt: 0,
        blocked: false,
      }
      this.setStore(store)
    }

    // If currently blocked
    if (store.blocked && store.blockUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: store.blockUntil,
        isBlocked: true,
        nextAllowedTime: store.blockUntil,
      }
    }

    // Check if window has expired (reset counter)
    if (store.attempts > 0 && this.isWindowExpired(store)) {
      store = {
        attempts: 0,
        firstAttempt: 0,
        lastAttempt: 0,
        blocked: false,
      }
    }

    // Check if limit exceeded
    if (store.attempts >= this.config.maxAttempts) {
      const blockUntil = now + this.config.blockDurationMs
      store.blocked = true
      store.blockUntil = blockUntil
      this.setStore(store)

      return {
        allowed: false,
        remaining: 0,
        resetTime: blockUntil,
        isBlocked: true,
        nextAllowedTime: blockUntil,
      }
    }

    // Allow the request
    const remaining = this.config.maxAttempts - store.attempts - 1
    const resetTime = store.firstAttempt + this.config.windowMs

    return {
      allowed: true,
      remaining,
      resetTime,
      isBlocked: false,
    }
  }

  recordAttempt(): void {
    const now = Date.now()
    let store = this.getStore()

    // If window expired, reset
    if (store.attempts > 0 && this.isWindowExpired(store)) {
      store = {
        attempts: 0,
        firstAttempt: 0,
        lastAttempt: 0,
        blocked: false,
      }
    }

    // Record attempt
    if (store.attempts === 0) {
      store.firstAttempt = now
    }

    store.attempts += 1
    store.lastAttempt = now

    this.setStore(store)
  }

  reset(): void {
    try {
      localStorage.removeItem(this.storageKey)
    } catch {
      // Handle localStorage errors silently
    }
  }

  getTimeRemaining(): number {
    const store = this.getStore()
    if (!store.blocked || !store.blockUntil) return 0
    return Math.max(0, store.blockUntil - Date.now())
  }

  getRemainingAttempts(): number {
    const store = this.getStore()
    if (store.blocked) return 0
    if (this.isWindowExpired(store)) return this.config.maxAttempts
    return Math.max(0, this.config.maxAttempts - store.attempts)
  }
}

// Singleton instances for different rate limit types
export const passwordResetLimiter = new RateLimiter('passwordReset', {
  maxAttempts: 3,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes
})

export const signInLimiter = new RateLimiter('signIn', {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 15 * 60 * 1000, // 15 minutes
})

// Utility functions
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '0 seconds'
  
  const minutes = Math.floor(ms / (60 * 1000))
  const seconds = Math.floor((ms % (60 * 1000)) / 1000)
  
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds > 0 ? `${seconds} second${seconds !== 1 ? 's' : ''}` : ''}`
  }
  
  return `${seconds} second${seconds !== 1 ? 's' : ''}`
}

export function getRateLimitMessage(result: RateLimitResult, action: string = 'perform this action'): string {
  if (!result.allowed && result.isBlocked) {
    const timeRemaining = result.nextAllowedTime ? result.nextAllowedTime - Date.now() : 0
    return `Too many attempts. Please wait ${formatTimeRemaining(timeRemaining)} before trying again.`
  }
  
  if (result.remaining <= 1) {
    return `You have ${result.remaining} attempt${result.remaining !== 1 ? 's' : ''} remaining before being temporarily blocked.`
  }
  
  return ''
}
