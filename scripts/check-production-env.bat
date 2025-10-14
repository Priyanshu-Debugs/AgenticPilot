@echo off
echo.
echo Checking Environment Variables for Production...
echo.
echo ===================================================
echo CRITICAL: Your Vercel environment must have these:
echo ===================================================
echo.
echo 1. NEXT_PUBLIC_SITE_URL = https://your-domain.vercel.app
echo    (Replace with YOUR actual Vercel domain)
echo.
echo 2. GOOGLE_CLIENT_ID = 777684660547-2r1olta6l9fu4v649ubn9sefqdsuc9bg.apps.googleusercontent.com
echo.
echo 3. GOOGLE_CLIENT_SECRET = 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
echo.
echo 4. NEXT_PUBLIC_SUPABASE_URL = https://hdgrkgqxtsluxlpnbxjr.supabase.co
echo.
echo 5. NEXT_PUBLIC_SUPABASE_ANON_KEY = (your Supabase anon key)
echo.
echo 6. GEMINI_API_KEY = (your Gemini API key)
echo.
echo ===================================================
echo.
echo Expected Redirect URI for Google Cloud Console:
echo https://YOUR-DOMAIN.vercel.app/api/auth/gmail/callback
echo.
echo ===================================================
echo.
echo TO FIX THE ISSUE:
echo.
echo Step 1: Find your Vercel domain
echo    - Go to https://vercel.com/dashboard
echo    - Click on AgenticPilot project
echo    - Copy the domain (e.g., agenticpilot-xyz.vercel.app)
echo.
echo Step 2: Update Vercel Environment Variables
echo    - Go to Settings ^> Environment Variables
echo    - Set NEXT_PUBLIC_SITE_URL to https://your-domain.vercel.app
echo    - Ensure all 6 variables above are set
echo.
echo Step 3: Update Google Cloud Console
echo    - Go to console.cloud.google.com
echo    - APIs ^& Services ^> Credentials
echo    - Click your OAuth Client ID
echo    - Add: https://your-domain.vercel.app/api/auth/gmail/callback
echo    - Save
echo.
echo Step 4: Redeploy on Vercel
echo    - Push a new commit OR
echo    - Redeploy from Vercel Dashboard (without cache)
echo.
echo Step 5: Test
echo    - Visit: https://your-domain.vercel.app/api/debug/oauth-config
echo    - Verify the redirectUri matches what you added to Google
echo.
echo ===================================================
echo.
pause
