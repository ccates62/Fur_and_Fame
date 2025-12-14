# 🔧 Fix: Supabase 401 Error on Production Domain

## ⚠️ Problem
Authentication works on `localhost` but fails with 401 on `furandfame.com`.

## 🔍 Root Cause
Supabase requires **redirect URLs** to be whitelisted in the dashboard. If `furandfame.com` isn't added, Supabase rejects authentication requests from that domain.

---

## ✅ Solution: Add Production Domain to Supabase

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select your project: **kanhbrdiagogexsyfkkl**
3. Navigate to: **Authentication** → **URL Configuration**

### Step 2: Add Redirect URLs
In the **"Redirect URLs"** section, add these URLs (one per line):

```
http://localhost:3000/**
https://www.furandfame.com/**
https://furandfame.com/**
http://localhost:3000/auth/callback
https://www.furandfame.com/auth/callback
https://furandfame.com/auth/callback
```

**Important:** Include both `www.furandfame.com` and `furandfame.com` (with and without www).

### Step 3: Update Site URL
In the **"Site URL"** field, set it to:
```
https://www.furandfame.com
```

### Step 4: Save Changes
Click **"Save"** at the bottom of the page.

---

## 🔍 Verify Environment Variables in Vercel

Make sure these are set in Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your project: **Fur_and_Fame**
3. Go to: **Settings** → **Environment Variables**
4. Verify these exist:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://kanhbrdiagogexsyfkkl.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_urt-N_cRLfKWZVZGSPMi7w_1FS2WezH`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your publishable key if using old variable name)

5. **Redeploy** after adding/updating variables

---

## 🧪 Test the Fix

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. Visit: https://www.furandfame.com
3. Try signing in
4. Check browser console for the debug log showing the publishable key is detected

---

## 🆘 Still Not Working?

If you still get 401 errors after adding redirect URLs:

1. **Check Supabase project status** - make sure it's active (not paused)
2. **Verify the publishable key** - check browser console for the debug log
3. **Check for CORS errors** - look in browser Network tab
4. **Try incognito/private window** - to rule out cache issues

---

## 📝 Why This Happens

- **Localhost works** because Supabase allows `localhost` by default
- **Production fails** because Supabase requires explicit whitelisting of production domains for security
- This is a **Supabase dashboard configuration**, not a code issue

---

**Last Updated:** December 2024
