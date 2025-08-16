import { useState, useEffect } from 'react'
import { useAuth } from '@/utils/auth/AuthProvider'

interface Settings {
  profile: {
    firstName: string
    lastName: string
    email: string
    company: string
    timezone: string
    language: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    taskCompletion: boolean
    lowStock: boolean
    systemUpdates: boolean
    weeklyReport: boolean
  }
  automation: {
    gmailEnabled: boolean
    gmailCheckInterval: string
    instagramEnabled: boolean
    instagramPostTime: string
    inventoryEnabled: boolean
    inventoryThreshold: string
    autoReorder: boolean
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: string
    passwordExpiry: string
    loginNotifications: boolean
  }
  integrations: {
    gmailConnected: boolean
    instagramConnected: boolean
    inventoryConnected: boolean
    webhookUrl: string
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Load settings from API
  const loadSettings = async () => {
    if (!user) {
      setSettings(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/settings')
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`)
      }
      
      const data = await response.json()
      setSettings(data)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load settings'
      setError(errorMessage)
      console.error('Error loading settings:', err)
    } finally {
      setLoading(false)
    }
  }

  // Save settings to API
  const saveSettings = async (newSettings: Settings) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Settings save error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        })
        
        throw new Error(`Failed to save settings (${response.status}): ${errorData.error || 'Unknown error'}`)
      }

      setSettings(newSettings)
      setError(null)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings'
      setError(errorMessage)
      console.error('Error saving settings:', err)
      throw new Error(errorMessage)
    }
  }

  // Update a specific setting
  const updateSetting = (category: keyof Settings, key: string, value: any) => {
    if (!settings) return

    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    }
    setSettings(newSettings)
  }

  // Reset settings to defaults
  const resetSettings = async () => {
    // This would typically call an API endpoint to reset to defaults
    // For now, we'll just reload the settings which should return defaults if none exist
    await loadSettings()
  }

  // Load settings when user changes
  useEffect(() => {
    loadSettings()
  }, [user])

  return {
    settings,
    loading,
    error,
    saveSettings,
    updateSetting,
    resetSettings,
    reload: loadSettings
  }
}
