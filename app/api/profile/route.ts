import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get unified profile data from user_profiles table using user_id (RLS compliant)
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const userData = {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || '',
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || '',
      company_name: profile?.company_name || '',
      job_title: profile?.job_title || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
      created_at: user.created_at,
      updated_at: profile?.updated_at
    }

    return NextResponse.json({ profile: userData })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profileData = await request.json()
    
    // Validate profile data - allow all profile fields per RLS schema
    const allowedFields = ['full_name', 'avatar_url', 'company_name', 'job_title', 'phone', 'bio']
    const filteredData = Object.keys(profileData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = profileData[key]
        return obj
      }, {} as any)

    // Update auth metadata if full_name is provided
    if (filteredData.full_name) {
      await supabase.auth.updateUser({
        data: { full_name: filteredData.full_name }
      })
    }

    // Update or insert profile in unified user_profiles table (RLS compliant with user_id)
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,  // Use user_id for RLS
        ...filteredData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'  // Specify conflict resolution column
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
