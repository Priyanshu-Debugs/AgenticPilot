import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check OAuth configuration
 * This will help identify configuration mismatches
 * IMPORTANT: Remove or secure this endpoint in production!
 */
export async function GET() {
  const config = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/gmail/callback`,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    googleClientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL, // Vercel automatically sets this
    vercelEnv: process.env.VERCEL_ENV,
  };

  return NextResponse.json({
    message: 'OAuth Configuration Debug Info',
    config,
    instructions: {
      step1: 'Check if NEXT_PUBLIC_SITE_URL matches your actual domain',
      step2: 'Ensure redirectUri matches what you added in Google Cloud Console',
      step3: 'Go to Google Cloud Console > Credentials > Add this redirectUri',
      step4: 'After fixing, redeploy and remove this debug endpoint',
    },
  });
}
