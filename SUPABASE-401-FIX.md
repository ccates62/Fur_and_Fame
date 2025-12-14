# 🔧 Fix: Supabase 401 Unauthorized Error

## ⚠️ Error: `POST /auth/v1/token?grant_type=password 401 (Unauthorized)`

This error means Supabase is rejecting the authentication request. The publishable key format might not be fully supported yet.

---

## 🔧 Quick Fix: Enable Legacy Keys in Supabase Dashboard

**This is the fastest solution:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **kanhbrdiagogexsyfkkl**
3. Navigate to **Settings** → **API**
4. Scroll down to **"Legacy API keys"** section
5. **Enable** "Legacy API keys" toggle
6. **Save** changes
7. **Restart** your dev server: `npm run dev`
8. Try signing in again

This will immediately restore access using your existing keys.

---

## 🔍 Alternative: Verify Key Format

If you want to use the new publishable key format:

1. **Check your `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_urt-N_cRLfKWZVZGSPMi7w_1FS2WezH
   ```

2. **Verify in browser console:**
   - Open Developer Tools (F12)
   - Look for: `🔑 Supabase Client Config:`
   - Check: `isPublishableInAnon: true` and `keyType: "publishable"`

3. **If the key isn't being detected:**
   - Make sure there are no quotes around the key
   - No spaces before/after the `=`
   - Restart dev server after changes

---

## 🆘 Still Not Working?

If enabling legacy keys doesn't work:

1. **Verify Supabase project is active:**
   - Check project status in Supabase dashboard
   - Make sure project isn't paused or suspended

2. **Check project URL:**
   - Should be: `https://kanhbrdiagogexsyfkkl.supabase.co`
   - Verify in `.env.local`

3. **Try the legacy anon key:**
   - Get it from Supabase Dashboard → Settings → API
   - Should start with `eyJ...` (JWT format)
   - Replace in `.env.local` temporarily

4. **Clear browser cache:**
   - Clear cookies for localhost
   - Try incognito/private window

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ No 401 errors in console
- ✅ Sign in works successfully
- ✅ User is redirected to dashboard
- ✅ No "Legacy API keys are disabled" message

---

**Recommended:** Enable legacy keys in Supabase dashboard for immediate fix, then we can troubleshoot the new key format separately.
