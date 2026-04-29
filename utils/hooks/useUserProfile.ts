import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/utils/auth/AuthProvider'

interface UserProfile {
  id: string
  user_id?: string
  full_name: string | null
  avatar_url: string | null
  plan: 'starter' | 'professional' | 'enterprise'
  company: string | null
  company_name?: string | null
  bio: string | null
  website: string | null
  location: string | null
  timezone: string
  created_at: string
  updated_at: string
}

interface UserProfileHook {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

export function useUserProfile(): UserProfileHook {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const normalizeProfile = (record: any): UserProfile => ({
    id: record?.id || record?.user_id || user?.id || '',
    user_id: record?.user_id || user?.id,
    full_name: record?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    avatar_url: record?.avatar_url || user?.user_metadata?.avatar_url || null,
    plan: record?.plan || 'starter',
    company: record?.company || record?.company_name || null,
    company_name: record?.company_name || record?.company || null,
    bio: record?.bio || null,
    website: record?.website || null,
    location: record?.location || null,
    timezone: record?.timezone || 'UTC',
    created_at: record?.created_at || new Date().toISOString(),
    updated_at: record?.updated_at || new Date().toISOString(),
  })

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
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        setError(error.message)
      } else if (!data) {
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            avatar_url: user.user_metadata?.avatar_url || null,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
          .select()
          .single()

        if (insertError) {
          setError(insertError.message)
        } else {
          setProfile(normalizeProfile(newProfile))
        }
      } else {
        setProfile(normalizeProfile(data))
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Profile fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !profile) {
      return { error: { message: 'No user or profile found' } }
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (error) {
        return { error }
      }

      setProfile(normalizeProfile(data))
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
