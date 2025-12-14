# ⚡ Quick Update: Add New Supabase Keys to .env.local

## Your New Publishable Key

Add this to your `.env.local` file:

```env
# New Supabase Publishable Key (replaces anon key)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_urt-N_cRLfKWZVZGSPMi7w_1FS2WezH

# Keep your existing keys for now (backward compatibility)
NEXT_PUBLIC_SUPABASE_URL=https://kanhbrdiagogexsyfkkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_existing_anon_key_here
```

## 📝 Steps

1. **Open your `.env.local` file** (in the project root)

2. **Add the new publishable key:**
   ```env
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_urt-N_cRLfKWZVZGSPMi7w_1FS2WezH
   ```

3. **Keep your existing keys** (for now, as fallback):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://kanhbrdiagogexsyfkkl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_existing_anon_key
   ```

4. **If you have a new secret key** (for server-side), add it too:
   ```env
   SUPABASE_SECRET_KEY=your_secret_key_here
   ```

5. **Restart your dev server:**
   ```bash
   npm run dev
   ```

## ✅ What Changed

The code now supports:
- ✅ **New keys**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (preferred)
- ✅ **Legacy keys**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (fallback)

The app will automatically use the new key if available, otherwise fall back to the legacy key.

## 🔒 Security

- ✅ `.env.local` is already in `.gitignore` (won't be committed)
- ✅ Publishable key is safe for client-side use
- ✅ Never commit API keys to git

---

**After adding the key, restart your dev server and try signing in again!**
