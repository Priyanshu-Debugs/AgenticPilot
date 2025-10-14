// Run this script locally to verify your environment variables
// Usage: node scripts/check-env.js

console.log('\n🔍 Checking Environment Variables...\n');

const requiredVars = {
  'NEXT_PUBLIC_SITE_URL': process.env.NEXT_PUBLIC_SITE_URL,
  'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID,
  'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET,
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'GEMINI_API_KEY': process.env.GEMINI_API_KEY,
};

let allGood = true;

console.log('📋 Environment Variables Status:\n');

Object.entries(requiredVars).forEach(([key, value]) => {
  if (!value) {
    console.log(`❌ ${key}: MISSING`);
    allGood = false;
  } else {
    // Mask sensitive values
    const displayValue = key.includes('SECRET') || key.includes('KEY') 
      ? `${value.substring(0, 10)}...`
      : value;
    console.log(`✅ ${key}: ${displayValue}`);
  }
});

console.log('\n🔗 Expected Redirect URI:\n');
console.log(`   ${process.env.NEXT_PUBLIC_SITE_URL || 'NOT_SET'}/api/auth/gmail/callback`);

if (allGood) {
  console.log('\n✅ All required environment variables are set!\n');
  console.log('📝 Next steps:');
  console.log('   1. Ensure NEXT_PUBLIC_SITE_URL matches your Vercel domain');
  console.log('   2. Add the redirect URI above to Google Cloud Console');
  console.log('   3. Set these same variables in Vercel Dashboard');
  console.log('   4. Redeploy your application\n');
} else {
  console.log('\n⚠️  Some environment variables are missing!');
  console.log('   Check your .env.local file or Vercel Dashboard\n');
}
