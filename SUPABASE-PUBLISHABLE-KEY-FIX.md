# 🔧 Fix: Supabase 401 Error with Publishable Key Only

## ⚠️ Situation

You can't enable legacy keys because they were exposed. You only have the publishable key (`sb_publishable_...`), but authentication is failing with a 401 error.

---

## 🔍 Root Cause

The publishable key **should** work for client-side authentication, but there might be an issue with:
1. **Supabase project configuration** - The project might need both keys enabled
2. **Library version** - Older versions might not fully support publishable keys
3. **Key permissions** - The publishable key might not have auth permissions enabled

---

## 🔧 Solution Options

### Option 1: Get Your Secret Key (Recommended)

Even though you can't get legacy keys, you **should** be able to get a **new secret key** from Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **kanhbrdiagogexsyfkkl**
3. Navigate to **Settings** → **API**
4. Look for **"Project API keys"** section
5. Find **"Secret key"** (starts with `sb_secret_...`)
6. Click **"Reveal"** to see it
7. Copy it and add to `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_YOUR_SECRET_KEY_HERE
   ```

**Note:** The secret key is different from legacy service_role key. It's the new format.

---

### Option 2: Contact Supabase Support

If you can't see or create a secret key:

1. Go to [Supabase Support](https://supabase.com/support)
2. Explain:
   - Your legacy keys were exposed
   - You need a new secret key (`sb_secret_...`)
   - You already have the publishable key
   - Authentication is failing with 401 errors

---

### Option 3: Verify Publishable Key Permissions

The publishable key might not have authentication enabled:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Find your publishable key
5. Check if there are any permission settings
6. Ensure "Authentication" is enabled for this key

---

### Option 4: Update Supabase Library

Try updating to the latest version:

```bash
npm install @supabase/supabase-js@latest --legacy-peer-deps
npm install @supabase/ssr@latest --legacy-peer-deps
```

Then restart your dev server.

---

## 🧪 Debugging Steps

1. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for: `🔑 Supabase Client Config:`
   - Verify: `isPublishableInAnon: true` and `keyType: "publishable"`

2. **Verify key in `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_urt-N_cRLfKWZVZGSPMi7w_1FS2WezH
   ```
   - No quotes
   - No spaces
   - Full key on one line

3. **Check Supabase project status:**
   - Project should be active
   - No billing issues
   - Project URL matches: `https://kanhbrdiagogexsyfkkl.supabase.co`

4. **Test with a simple request:**
   - Try creating a test user in Supabase dashboard
   - Try signing in with that user
   - Check if the error is specific to certain users

---

## 📋 What I've Updated

1. ✅ **Updated Supabase client** to use PKCE flow (better for publishable keys)
2. ✅ **Removed global headers override** (createClient handles this automatically)
3. ✅ **Added debugging** to verify key format
4. ✅ **Created guides** for getting secret key

---

## 🆘 Next Steps

1. **Try getting the secret key** from Supabase dashboard (Option 1)
2. **If that doesn't work**, contact Supabase support (Option 2)
3. **Update the library** and restart dev server (Option 4)
4. **Check the browser console** for the debug output

The publishable key should work for authentication, but having the secret key will help with server-side operations and might resolve the issue.

---

**Last Updated:** December 2024
