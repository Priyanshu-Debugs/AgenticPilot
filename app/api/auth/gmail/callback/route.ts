import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { exchangeGmailCode, saveGmailTokens } from '@/lib/gmail-oauth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This should be the user ID
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('Gmail OAuth error:', error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/gmail?error=oauth_failed`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/gmail?error=missing_params`
      );
    }

    // Verify the user session matches the state
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
    
    if (userError || !user || user.id !== state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/gmail?error=unauthorized`
      );
    }

    // Exchange authorization code for tokens
    const tokens = await exchangeGmailCode(code);
    
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Failed to get valid tokens from Google');
    }

    // Save tokens to database
    await saveGmailTokens(user.id, tokens);

    // Redirect back to Gmail dashboard with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/gmail?success=connected`
    );

  } catch (error) {
    console.error('Gmail OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/gmail?error=callback_failed`
    );
  }
}
