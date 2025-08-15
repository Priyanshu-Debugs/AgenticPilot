/**
 * Password validation utilities with security best practices
 */

export interface PasswordValidationResult {
  isValid: boolean
  score: number // 0-100
  errors: string[]
  suggestions: string[]
}

export interface PasswordRequirements {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  forbidCommonPasswords: boolean
}

// Common weak passwords (sample list - in production, use a comprehensive list)
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123', 
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
  'qwerty123', 'admin123', 'root', 'user', 'guest', 'test', 'demo'
]

const DEFAULT_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  forbidCommonPasswords: true
}

export function validatePassword(
  password: string, 
  requirements: Partial<PasswordRequirements> = {}
): PasswordValidationResult {
  const config = { ...DEFAULT_REQUIREMENTS, ...requirements }
  const errors: string[] = []
  const suggestions: string[] = []
  let score = 0

  // Check minimum length
  if (password.length < config.minLength) {
    errors.push(`Password must be at least ${config.minLength} characters long`)
  } else {
    score += 20
  }

  // Check for uppercase letters
  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
    suggestions.push('Add an uppercase letter (A-Z)')
  } else if (config.requireUppercase) {
    score += 15
  }

  // Check for lowercase letters
  if (config.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
    suggestions.push('Add a lowercase letter (a-z)')
  } else if (config.requireLowercase) {
    score += 15
  }

  // Check for numbers
  if (config.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
    suggestions.push('Add a number (0-9)')
  } else if (config.requireNumbers) {
    score += 15
  }

  // Check for special characters
  if (config.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
    suggestions.push('Add a special character (!@#$%^&*)')
  } else if (config.requireSpecialChars) {
    score += 15
  }

  // Check against common passwords
  if (config.forbidCommonPasswords && COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Password is too common and easily guessable')
    suggestions.push('Use a unique password that is not commonly used')
    score = Math.max(0, score - 30)
  }

  // Additional security checks
  if (password.length >= 12) {
    score += 10 // Bonus for longer passwords
  }

  if (password.length >= 16) {
    score += 10 // Extra bonus for very long passwords
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Avoid repeating the same character multiple times')
    score = Math.max(0, score - 10)
  }

  // Check for sequential characters
  if (/123|abc|qwe|789/i.test(password)) {
    suggestions.push('Avoid using sequential characters')
    score = Math.max(0, score - 10)
  }

  const isValid = errors.length === 0
  score = Math.min(100, Math.max(0, score))

  return {
    isValid,
    score,
    errors,
    suggestions
  }
}
