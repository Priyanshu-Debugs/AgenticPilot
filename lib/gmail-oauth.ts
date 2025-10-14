import { google } from 'googleapis';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper function to create Supabase client
async function createSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
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
}

// Gmail OAuth configuration
const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify'
];

// Initialize OAuth2 client
export function createGoogleOAuthClient() {
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/gmail/callback`;
  
  // Log for debugging (remove in production)
  console.log('OAuth Config:', {
    clientId: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
    redirectUri,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  });
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Missing Google OAuth credentials in environment variables');
  }
  
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SITE_URL in environment variables');
  }
  
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

// Generate Gmail OAuth URL
export function getGmailAuthUrl(state: string) {
  const oauth2Client = createGoogleOAuthClient();
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GMAIL_SCOPES,
    state: state, // Include user ID or session info
    prompt: 'consent' // Force consent screen to get refresh token
  });
}

// Exchange authorization code for tokens
export async function exchangeGmailCode(code: string) {
  const oauth2Client = createGoogleOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

// Save Gmail tokens to Supabase
export async function saveGmailTokens(userId: string, tokens: any) {
  const supabase = await createSupabaseClient();
  
  const { error } = await supabase
    .from('gmail_tokens')
    .upsert({
      user_id: userId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type || 'Bearer',
      expires_at: new Date(tokens.expiry_date).toISOString(),
      scope: GMAIL_SCOPES.join(' '),
      updated_at: new Date().toISOString()
    });

  if (error) {
    throw new Error(`Failed to save Gmail tokens: ${error.message}`);
  }
}

// Get Gmail tokens from Supabase
export async function getGmailTokens(userId: string) {
  const supabase = await createSupabaseClient();
  
  const { data, error } = await supabase
    .from('gmail_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

// Create authenticated Gmail client
export async function createGmailClient(userId: string) {
  const tokens = await getGmailTokens(userId);
  if (!tokens) {
    throw new Error('No Gmail tokens found for user');
  }

  const oauth2Client = createGoogleOAuthClient();
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_type: tokens.token_type,
    expiry_date: new Date(tokens.expires_at).getTime()
  });

  // Handle token refresh automatically
  oauth2Client.on('tokens', async (newTokens) => {
    if (newTokens.refresh_token) {
      await saveGmailTokens(userId, {
        ...tokens,
        ...newTokens
      });
    }
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

// Check if user has Gmail connected
export async function isGmailConnected(userId: string) {
  const tokens = await getGmailTokens(userId);
  return !!tokens && new Date(tokens.expires_at) > new Date();
}

// Revoke Gmail access
export async function revokeGmailAccess(userId: string) {
  const tokens = await getGmailTokens(userId);
  if (!tokens) return;

  // Revoke the token with Google
  const oauth2Client = createGoogleOAuthClient();
  try {
    await oauth2Client.revokeToken(tokens.access_token);
  } catch (error) {
    console.warn('Failed to revoke token with Google:', error);
  }

  // Delete from database
  const supabase = await createSupabaseClient();
  await supabase
    .from('gmail_tokens')
    .delete()
    .eq('user_id', userId);
}
