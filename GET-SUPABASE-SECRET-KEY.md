# 🔑 How to Get Your Supabase Secret Key

## ⚠️ Important: You Need Both Keys

For full functionality, you need:
- ✅ **Publishable Key** (`sb_publishable_...`) - You already have this
- ⚠️ **Secret Key** (`sb_secret_...`) - You need to get this from Supabase dashboard

---

## 📝 Step-by-Step: Get Your Secret Key

### Step 1: Go to Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **kanhbrdiagogexsyfkkl**
3. Navigate to **Settings** → **API**

### Step 2: Find Your Secret Key

1. Scroll to **"Project API keys"** section
2. Look for **"Secret key"** (not "Publishable key")
3. It should start with `sb_secret_...`
4. Click **"Reveal"** or **"Show"** to see the full key
5. **Copy the entire key**

**Note:** Each time you reveal the secret key, it's logged for security.

### Step 3: Add to `.env.local`

Add this to your `.env.local` file:

```env
# Supabase Keys
NEXT_PUBLIC_SUPABASE_URL=https://kanhbrdiagogexsyfkkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_urt-N_cRLfKWZVZGSPMi7w_1FS2WezH
SUPABASE_SERVICE_ROLE_KEY=sb_secret_YOUR_SECRET_KEY_HERE
```

**Important:**
- Replace `YOUR_SECRET_KEY_HERE` with your actual secret key
- No quotes around the key
- No spaces before/after the `=`

---

## 🔍 Can't Find the Secret Key?

If you don't see a secret key option:

1. **Check if you're in the right project**
2. **Look for "API Keys" or "Project API keys" section**
3. **Try refreshing the page**
4. **Check if your account has proper permissions**

---

## 🆘 Still Can't Get It?

If you can't find or create a secret key:

1. **Contact Supabase Support:**
   - Go to [Supabase Support](https://supabase.com/support)
   - Explain that you need a new secret key because legacy keys were exposed

2. **Check Project Settings:**
   - Make sure your project is active
   - Verify you have admin access to the project

3. **Alternative:**
   - The publishable key should work for client-side authentication
   - The 401 error might be a different issue (see troubleshooting below)

---

## 🔧 Troubleshooting 401 Error with Publishable Key

If you're getting 401 errors with just the publishable key:

1. **Verify key format:**
   - Should start with `sb_publishable_`
   - No extra characters or spaces
   - Full key copied correctly

2. **Check Supabase project status:**
   - Project should be active (not paused)
   - No billing issues

3. **Update Supabase library:**
   ```bash
   npm install @supabase/supabase-js@latest --legacy-peer-deps
   ```

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

5. **Check browser console:**
   - Look for the `🔑 Supabase Client Config:` log
   - Verify `keyType: "publishable"`

---

## ✅ After Adding Secret Key

1. **Restart your dev server:** `npm run dev`
2. **Try signing in again**
3. **Check if 401 error is resolved**

The secret key is needed for server-side operations, but the publishable key should work for client-side authentication.

---

**Last Updated:** December 2024
