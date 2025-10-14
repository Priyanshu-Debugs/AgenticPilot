# Gmail OAuth Troubleshooting Guide

## Error: redirect_uri_mismatch

### Quick Diagnosis

1. **Visit this URL on your hosted site:**
   ```
   https://your-domain.vercel.app/api/debug/oauth-config
   ```
   This will show you the exact configuration your app is using.

2. **Compare the `redirectUri` shown with what's in Google Cloud Console**

---

## Step-by-Step Fix

### Step 1: Find Your Exact Vercel Domain

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **AgenticPilot** project
3. Look at the top - you'll see your domain(s), something like:
   - `agenticpilot.vercel.app` (or)
   - `agenticpilot-xyz.vercel.app` (or)
   - Your custom domain

**Write it down exactly:** `https://_____________________.vercel.app`

---

### Step 2: Update Vercel Environment Variables

1. In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

2. **Find or Add** `NEXT_PUBLIC_SITE_URL`:
   - Click "Edit" if it exists, or "Add New"
   - **Name:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://your-exact-domain.vercel.app` (NO trailing slash!)
   - **Environment:** Select **Production** (and optionally Preview/Development)
   - Click "Save"

3. **Verify these also exist:**
   - `GOOGLE_CLIENT_ID`: `777684660547-2r1olta6l9fu4v649ubn9sefqdsuc9bg.apps.googleusercontent.com`
   - `GOOGLE_CLIENT_SECRET`: `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`
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `GEMINI_API_KEY`: Your Gemini API key

4. **Important:** After saving, you MUST redeploy!

---

### Step 3: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Navigate: **APIs & Services** → **Credentials**

3. Find and click your OAuth 2.0 Client ID:
   - Look for: `777684660547-2r1olta6l9fu4v649ubn9sefqdsuc9bg.apps.googleusercontent.com`

4. Scroll to **Authorized redirect URIs**

5. **Add BOTH of these URIs** (if not already there):
   ```
   http://localhost:3000/api/auth/gmail/callback
   https://your-exact-domain.vercel.app/api/auth/gmail/callback
   ```
   
   **CRITICAL:** Replace `your-exact-domain.vercel.app` with YOUR ACTUAL domain!

6. Click **SAVE** at the bottom

---

### Step 4: Redeploy on Vercel

**Method 1 - Via Git:**
```bash
git add .
git commit -m "Update OAuth configuration"
git push
```

**Method 2 - Via Vercel Dashboard:**
1. Go to **Deployments** tab
2. Click three dots (...) on the latest deployment
3. Click **Redeploy**
4. Check **"Use existing Build Cache"** - NO (uncheck it)
5. Click **Redeploy**

---

### Step 5: Test the Configuration

1. Wait for deployment to complete (2-3 minutes)

2. Visit your debug endpoint:
   ```
   https://your-domain.vercel.app/api/debug/oauth-config
   ```

3. **Verify:**
   - `siteUrl` matches your domain
   - `redirectUri` is correct
   - `hasGoogleClientId` is `true`
   - `hasGoogleClientSecret` is `true`

4. Go to Gmail automation page:
   ```
   https://your-domain.vercel.app/dashboard/gmail
   ```

5. Click **"Connect Gmail Account"**

---

## Common Issues & Fixes

### Issue 1: "redirect_uri_mismatch" still appears
**Cause:** Mismatch between Vercel env var and Google Console  
**Fix:** 
- Double-check the EXACT spelling of your domain
- Ensure NO trailing slash in NEXT_PUBLIC_SITE_URL
- Verify you clicked SAVE in both Vercel and Google Console
- Redeploy after changes

### Issue 2: "Missing required parameter: redirect_uri"
**Cause:** NEXT_PUBLIC_SITE_URL not set on Vercel  
**Fix:** 
- Go to Vercel → Settings → Environment Variables
- Add NEXT_PUBLIC_SITE_URL with your production domain
- Redeploy

### Issue 3: Environment variable changes not working
**Cause:** Vercel caches builds  
**Fix:** 
- When redeploying, UNCHECK "Use existing Build Cache"
- Or, push a new commit to force fresh build

### Issue 4: OAuth works locally but not in production
**Cause:** .env.local is not deployed to Vercel  
**Fix:** 
- All variables must be set in Vercel Dashboard
- .env.local is only for local development

---

## Verification Checklist

Before testing, ensure:

- [ ] Vercel `NEXT_PUBLIC_SITE_URL` = Your actual Vercel domain (with https://)
- [ ] Vercel has all required env variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.)
- [ ] Google Console has your Vercel callback URL in Authorized redirect URIs
- [ ] You've redeployed after making changes
- [ ] Build completed successfully (check Vercel Deployments tab)
- [ ] Visited /api/debug/oauth-config to verify configuration

---

## Still Not Working?

1. **Check Vercel Deployment Logs:**
   - Go to Vercel → Deployments → Click on latest deployment
   - Check "Building" and "Runtime Logs" for errors

2. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Click "Connect Gmail" button
   - Look for errors in Console tab

3. **Verify Google Cloud Settings:**
   - OAuth consent screen is configured
   - App is published (or you're added as test user)
   - Gmail API is enabled
   - Correct scopes are added

4. **Common Vercel Domain Formats:**
   - `projectname.vercel.app`
   - `projectname-username.vercel.app`
   - `projectname-git-branch.vercel.app`

---

## Security Note

**After fixing, remove the debug endpoint:**
```bash
# Delete this file:
app/api/debug/oauth-config/route.ts
```

Or secure it by checking authentication first.

---

## Need More Help?

Provide these details:
1. Output from `/api/debug/oauth-config`
2. Your Vercel domain (from Vercel dashboard)
3. Screenshot of Google Console Authorized redirect URIs
4. Any error messages from Vercel logs or browser console
