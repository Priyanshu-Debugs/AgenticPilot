import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * Debug endpoint to check OAuth configuration
 * This will help identify configuration mismatches
 * IMPORTANT: Remove or secure this endpoint in production!
 */
export async function GET() {
  const headersList = await headers();
  const host = headersList.get('host') || 'unknown';
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const actualUrl = `${protocol}://${host}`;

  const config = {
    // What your app THINKS the site URL is
    configuredSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    
    // What the ACTUAL URL is (from request)
    actualSiteUrl: actualUrl,
    
    // The redirect URI your app will send to Google
    configuredRedirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/gmail/callback`,
    
    // What the redirect URI SHOULD be
    correctRedirectUri: `${actualUrl}/api/auth/gmail/callback`,
    
    // OAuth credentials status
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    googleClientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 30) + '...',
    
    // Environment info
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    vercelEnv: process.env.VERCEL_ENV,
    
    // Headers for debugging
    requestHost: host,
    requestProtocol: protocol,
  };

  const issues: string[] = [];
  
  // Check for common issues
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    issues.push('❌ CRITICAL: NEXT_PUBLIC_SITE_URL is not set!');
  } else if (process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
    issues.push('❌ CRITICAL: NEXT_PUBLIC_SITE_URL is set to localhost but you\'re on production!');
  } else if (process.env.NEXT_PUBLIC_SITE_URL !== actualUrl) {
    issues.push(`⚠️  WARNING: NEXT_PUBLIC_SITE_URL (${process.env.NEXT_PUBLIC_SITE_URL}) doesn't match actual URL (${actualUrl})`);
  }
  
  if (!process.env.GOOGLE_CLIENT_ID) {
    issues.push('❌ CRITICAL: GOOGLE_CLIENT_ID is not set!');
  }
  
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    issues.push('❌ CRITICAL: GOOGLE_CLIENT_SECRET is not set!');
  }

  return NextResponse.json({
    status: issues.length === 0 ? '✅ Configuration looks good!' : '⚠️  Issues found',
    issues: issues.length > 0 ? issues : ['No issues detected'],
    config,
    instructions: {
      step1: 'Copy the "correctRedirectUri" value below',
      step2: 'Go to: https://console.cloud.google.com/apis/credentials',
      step3: 'Click on your OAuth Client ID (starts with 777684660547)',
      step4: 'Under "Authorized redirect URIs", add the correctRedirectUri',
      step5: 'In Vercel Dashboard, set NEXT_PUBLIC_SITE_URL to match actualSiteUrl',
      step6: 'Redeploy your app (without build cache)',
      step7: 'After fixing, remove this debug endpoint for security',
    },
    actionRequired: issues.length > 0 ? 
      'Fix the issues above, then redeploy your application' : 
      'Configuration looks good. If OAuth still fails, check Google Cloud Console',
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  });
}
