import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getGmailAuthUrl } from '@/lib/gmail-oauth';

export async function POST(req: NextRequest) {
  try {
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

    return NextResponse.json({ 
      authUrl,
      message: 'Gmail OAuth URL generated successfully' 
    });

  } catch (error) {
    console.error('Gmail OAuth initiate error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Gmail OAuth' },
      { status: 500 }
    );
  }
}
