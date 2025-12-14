# Supabase Key Troubleshooting Guide

## ⚠️ Error: "Legacy API keys are disabled" + 401 Error

If you're still getting this error after adding the publishable key, try these steps:

---

## 🔍 Step 1: Verify Your Key Format

Your publishable key should look like:
```
sb_publishable_urt-N_cRLfKWZVZGSPMi7w_1FS2WezH
```

**Check your `.env.local` file:**
```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_urt-N_cRLfKWZVZGSPMi7w_1FS2WezH
```

**Important:**
- ✅ No quotes around the key
- ✅ No spaces before/after
- ✅ Starts with `sb_publishable_`
- ✅ Full key is on one line

---

## 🔧 Step 2: Quick Fix - Enable Legacy Keys (Temporary)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **kanhbrdiagogexsyfkkl**
3. Navigate to **Settings** → **API**
4. Scroll to **"Legacy API keys"** section
5. Click **"Enable legacy API keys"** toggle
6. Save changes
7. Restart your dev server: `npm run dev`
8. Try signing in again

**This will immediately fix the issue while we troubleshoot the new key.**

---

## 🔑 Step 3: Verify New Key in Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Look for **"Project API keys"** section
5. Find **"Publishable key"** (not "anon public")
6. Copy the **entire** key (it should start with `sb_publishable_`)
7. Compare it to what you have in `.env.local`

**If the keys don't match:**
- Replace the key in `.env.local` with the one from the dashboard
- Restart your dev server

---

## 🧪 Step 4: Test Key in Browser Console

1. Open your app in browser
2. Open Developer Console (F12)
3. Check the console logs - you should see:
   ```
   🔑 Supabase Client Config: { ... }
   ```
4. Verify:
   - `hasPublishableKey: true`
   - `keyType: "publishable"`

If you see `hasPublishableKey: false`, the key isn't being read from `.env.local`.

---

## 📝 Step 5: Verify .env.local Location

Your `.env.local` file must be in the **project root** (same folder as `package.json`):

```
Fur_and_Fame/
├── .env.local          ← Must be here
├── package.json
├── next.config.mjs
└── src/
```

**Common mistakes:**
- ❌ File in `src/` folder
- ❌ File named `.env` (should be `.env.local`)
- ❌ File has wrong encoding

---

## 🔄 Step 6: Restart Dev Server

After updating `.env.local`:

1. **Stop** your dev server (Ctrl+C)
2. **Start** it again: `npm run dev`
3. **Clear browser cache** (Ctrl+Shift+Delete)
4. Try signing in again

**Environment variables are only loaded when the server starts!**

---

## 🆘 Step 7: Still Not Working?

If you've tried everything above:

1. **Enable legacy keys** in Supabase dashboard (Step 2) - this will work immediately
2. **Check Supabase project status** - make sure project is active
3. **Verify project URL** matches: `https://kanhbrdiagogexsyfkkl.supabase.co`
4. **Check for typos** in `.env.local` - copy/paste directly from dashboard

---

## 📋 Complete .env.local Example

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://kanhbrdiagogexsyfkkl.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_urt-N_cRLfKWZVZGSPMi7w_1FS2WezH

# Legacy keys (keep as backup)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ No "Legacy API keys are disabled" error
- ✅ No 401 errors in console
- ✅ Sign in works successfully
- ✅ Console shows `keyType: "publishable"`

---

**Last Updated:** December 2024
