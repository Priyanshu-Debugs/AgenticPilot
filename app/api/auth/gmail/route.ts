import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getGmailAuthUrl } from '@/lib/gmail-oauth';

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables first
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      console.error('❌ NEXT_PUBLIC_SITE_URL is not set');
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'NEXT_PUBLIC_SITE_URL environment variable is not set. Please configure it in Vercel Dashboard.',
        },
        { status: 500 }
      );
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('❌ Google OAuth credentials are not set');
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Google OAuth credentials are not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel Dashboard.',
        },
        { status: 500 }
      );
    }

    // Get current user
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate Gmail OAuth URL with user ID as state
    const authUrl = getGmailAuthUrl(user.id);

    console.log('✅ Gmail OAuth URL generated for user:', user.id);
    console.log('📍 Redirect URI:', `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/gmail/callback`);

    return NextResponse.json({ 
      authUrl,
      message: 'Gmail OAuth URL generated successfully' 
    });

  } catch (error) {
    console.error('Gmail OAuth initiate error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initiate Gmail OAuth',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
