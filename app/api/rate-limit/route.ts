import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, {
  attempts: number
  firstAttempt: number
  lastAttempt: number
  blocked: boolean
  blockUntil?: number
}>()

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  blockDurationMs: number
}

const configs: Record<string, RateLimitConfig> = {
  'password-reset': {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  'sign-in': {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 15 * 60 * 1000, // 15 minutes
  }
}

function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback
  return 'unknown'
}

function isWindowExpired(store: any, windowMs: number): boolean {
  const now = Date.now()
  return now - store.firstAttempt > windowMs
}

function isBlockExpired(store: any): boolean {
  if (!store.blocked || !store.blockUntil) return true
  return Date.now() > store.blockUntil
}

export async function POST(request: NextRequest) {
  try {
    const { action, identifier } = await request.json()
    
    if (!action || !configs[action]) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const clientIP = getClientIP(request)
    const key = `${action}:${identifier || clientIP}`
    const config = configs[action]
    const now = Date.now()
    
    let store = rateLimitStore.get(key) || {
      attempts: 0,
      firstAttempt: 0,
      lastAttempt: 0,
      blocked: false,
    }

    // Check if block has expired
    if (store.blocked && isBlockExpired(store)) {
      store = {
        attempts: 0,
        firstAttempt: 0,
        lastAttempt: 0,
        blocked: false,
      }
      rateLimitStore.set(key, store)
    }

    // If currently blocked
    if (store.blocked && store.blockUntil) {
      return NextResponse.json({
        allowed: false,
        remaining: 0,
        resetTime: store.blockUntil,
        isBlocked: true,
        nextAllowedTime: store.blockUntil,
      })
    }

    // Check if window has expired (reset counter)
    if (store.attempts > 0 && isWindowExpired(store, config.windowMs)) {
      store = {
        attempts: 0,
        firstAttempt: 0,
        lastAttempt: 0,
        blocked: false,
      }
    }

    // Check if limit exceeded
    if (store.attempts >= config.maxAttempts) {
      const blockUntil = now + config.blockDurationMs
      store.blocked = true
      store.blockUntil = blockUntil
      rateLimitStore.set(key, store)

      return NextResponse.json({
        allowed: false,
        remaining: 0,
        resetTime: blockUntil,
        isBlocked: true,
        nextAllowedTime: blockUntil,
      })
    }

    // Allow the request
    const remaining = config.maxAttempts - store.attempts - 1
    const resetTime = store.firstAttempt + config.windowMs

    return NextResponse.json({
      allowed: true,
      remaining,
      resetTime,
      isBlocked: false,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action, identifier } = await request.json()
    
    if (!action || !configs[action]) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const clientIP = getClientIP(request)
    const key = `${action}:${identifier || clientIP}`
    const config = configs[action]
    const now = Date.now()
    
    let store = rateLimitStore.get(key) || {
      attempts: 0,
      firstAttempt: 0,
      lastAttempt: 0,
      blocked: false,
    }

    // If window expired, reset
    if (store.attempts > 0 && isWindowExpired(store, config.windowMs)) {
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

    rateLimitStore.set(key, store)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
