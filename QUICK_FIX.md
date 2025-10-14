# 🚨 URGENT FIX: Gmail OAuth redirect_uri_mismatch

## The Problem
You're getting `redirect_uri_mismatch` because your Vercel deployment doesn't have the correct `NEXT_PUBLIC_SITE_URL` environment variable.

---

## ✅ QUICK FIX (5 Minutes)

### 1️⃣ Find Your Vercel Domain (1 min)
1. Open: https://vercel.com/dashboard
2. Click on your **AgenticPilot** project
3. Copy your domain - it looks like:
   - `agenticpilot.vercel.app` OR
   - `agenticpilot-priyanshu-debugs.vercel.app` OR
   - `agenticpilot-git-main.vercel.app`
   
   **Write it here:** `_______________________________`

---

### 2️⃣ Set Vercel Environment Variables (2 min)
1. In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

2. Add or update these variables:

   | Variable Name | Value |
   |--------------|--------|
   | `NEXT_PUBLIC_SITE_URL` | `https://YOUR-DOMAIN.vercel.app` ⚠️ Replace with your actual domain! |
   | `GOOGLE_CLIENT_ID` | `777684660547-2r1olta6l9fu4v649ubn9sefqdsuc9bg.apps.googleusercontent.com` |
   | `GOOGLE_CLIENT_SECRET` | `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` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://hdgrkgqxtsluxlpnbxjr.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (copy from .env.local) |
   | `GEMINI_API_KEY` | (copy from .env.local) |

3. For each variable, select **Production** environment
4. Click **Save**

---

### 3️⃣ Update Google Cloud Console (2 min)
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on OAuth Client ID: `777684660547...`
3. Under **Authorized redirect URIs**, click **+ ADD URI**
4. Add: `https://YOUR-DOMAIN.vercel.app/api/auth/gmail/callback`
   
   ⚠️ Replace `YOUR-DOMAIN` with your actual Vercel domain!

5. Click **SAVE** at the bottom

**Your list should have both:**
```
✅ http://localhost:3000/api/auth/gmail/callback
✅ https://your-actual-domain.vercel.app/api/auth/gmail/callback
```

---

### 4️⃣ Redeploy (1 min)

**Option A - Push a commit:**
```bash
git add .
git commit -m "fix: update oauth config"
git push
```

**Option B - Manual redeploy:**
1. Vercel Dashboard → **Deployments** tab
2. Click **•••** on latest deployment
3. Click **Redeploy**
4. ⚠️ UNCHECK "Use existing Build Cache"
5. Click **Redeploy**

---

### 5️⃣ Test (30 seconds)

After deployment finishes:

1. **Visit debug endpoint:**
   ```
   https://YOUR-DOMAIN.vercel.app/api/debug/oauth-config
   ```
   
2. **Verify these match:**
   - `siteUrl`: Should be your Vercel domain
   - `redirectUri`: Should be `https://YOUR-DOMAIN.vercel.app/api/auth/gmail/callback`
   - This URI should EXACTLY match what you added to Google Console

3. **Test Gmail Connection:**
   ```
   https://YOUR-DOMAIN.vercel.app/dashboard/gmail
   ```
   Click "Connect Gmail Account" - it should work now! ✅

---

## 🔍 Still Getting Errors?

### Error: "Environment variable missing"
- Double-check ALL 6 variables are set in Vercel
- Make sure you selected **Production** environment
- Redeploy after adding variables

### Error: "redirect_uri_mismatch" persists
- Visit `/api/debug/oauth-config` on your hosted site
- Copy the exact `redirectUri` shown
- Go to Google Console and verify THIS EXACT URI is in the list
- Check for typos, trailing slashes, http vs https

### Error: OAuth consent screen issues
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Check "Publishing status" - should be "In production" or "Testing"
3. If Testing, add your email as a test user
4. Ensure Gmail API scopes are added

---

## 📸 What You Need to Send Me If It Still Doesn't Work

1. **Your Vercel domain:** (from Vercel Dashboard)
2. **Debug endpoint output:** Visit `/api/debug/oauth-config` and copy the JSON
3. **Google Console screenshot:** Screenshot of "Authorized redirect URIs" section
4. **Vercel env variables:** Screenshot showing NEXT_PUBLIC_SITE_URL is set
5. **Error message:** Exact error text you're seeing

---

## 🎯 Most Common Mistakes

1. ❌ Using `http://` instead of `https://` for production domain
2. ❌ Adding trailing slash: `https://domain.vercel.app/` (should be no slash)
3. ❌ Not redeploying after changing env variables
4. ❌ Typo in domain name (e.g., `agenticpilot` vs `agenticpilots`)
5. ❌ Forgetting to click SAVE in Google Console
6. ❌ Using wrong OAuth Client ID in Google Console

---

## ✅ Success Checklist

Before testing, verify:

- [ ] I found my exact Vercel domain
- [ ] `NEXT_PUBLIC_SITE_URL` is set in Vercel (with `https://`)
- [ ] All 6 environment variables are set in Vercel
- [ ] Variables are set for **Production** environment
- [ ] I added the redirect URI to Google Console
- [ ] URI in Google Console EXACTLY matches: `https://my-domain.vercel.app/api/auth/gmail/callback`
- [ ] I clicked SAVE in Google Console
- [ ] I redeployed on Vercel (without build cache)
- [ ] Deployment shows "Ready" status
- [ ] I tested `/api/debug/oauth-config` endpoint

---

## 🧹 After It Works

Remove the debug endpoint for security:
```bash
rm app/api/debug/oauth-config/route.ts
git commit -am "remove debug endpoint"
git push
```

---

**Need help?** Share the debug endpoint output and screenshots!
