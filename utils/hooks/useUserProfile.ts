import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/utils/auth/AuthProvider'

interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  plan: 'starter' | 'professional' | 'enterprise'
  created_at: string
  updated_at: string
}

interface UserProfileHook {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  updateProfile: (updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url'>>) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

export function useUserProfile(): UserProfileHook {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              avatar_url: user.user_metadata?.avatar_url || null,
              plan: 'starter'
            })
            .select()
            .single()

          if (insertError) {
            setError(insertError.message)
          } else {
            setProfile(newProfile)
          }
        } else {
          setError(error.message)
        }
      } else {
        setProfile(data)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Profile fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url'>>) => {
    if (!user || !profile) {
      return { error: { message: 'No user or profile found' } }
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return { error }
      }

      setProfile(data)
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const refreshProfile = async () => {
    setLoading(true)
    await fetchProfile()
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile
  }
}
