# Supabase API Keys Migration Guide

## ⚠️ Error: "Legacy API keys are disabled"

If you're seeing this error, Supabase has disabled the old `anon` and `service_role` keys in favor of new `publishable` and `secret` keys.

---

## 🔧 Solution Options

### Option 1: Re-enable Legacy Keys (Quick Fix)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Find **"Legacy API keys"** section
5. Click **"Enable legacy API keys"**
6. This will temporarily restore access using your existing keys

**Note:** This is a temporary solution. Supabase may deprecate legacy keys in the future.

---

### Option 2: Update to New API Keys (Recommended)

#### Step 1: Get New Keys from Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Find the **"Project API keys"** section
5. Copy the following:
   - **Publishable key** (replaces `anon` key)
   - **Secret key** (replaces `service_role` key)

#### Step 2: Update Your `.env.local`

Replace or add these variables:

```env
# New API Keys (Recommended)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
SUPABASE_SECRET_KEY=your_secret_key_here

# Legacy Keys (Keep for backward compatibility if needed)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Step 3: Update Code (Already Done)

The code has been updated to support both:
- **New keys**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (preferred)
- **Legacy keys**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (fallback)

The client will automatically use the new key if available, otherwise fall back to the legacy key.

---

## 📋 Key Mapping

| Old Key | New Key | Usage |
|---------|---------|-------|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client-side (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | `SUPABASE_SECRET_KEY` | Server-side (private) |

---

## ✅ Verification

After updating your keys:

1. Restart your development server (`npm run dev`)
2. Try signing in again
3. The error should be resolved

---

## 🔒 Security Notes

- **Never commit** `.env.local` to git (already in `.gitignore`)
- **Publishable key** is safe for client-side use
- **Secret key** should ONLY be used server-side (API routes)
- Keep both old and new keys during migration for safety

---

## 🆘 Still Having Issues?

1. Verify keys are correct in Supabase dashboard
2. Check that `.env.local` is in the project root
3. Restart the dev server after updating keys
4. Clear browser cache and cookies
5. Check Supabase dashboard for any project-level restrictions

---

**Last Updated:** December 2024
