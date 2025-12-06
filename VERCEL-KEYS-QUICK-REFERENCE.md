# 🚀 Vercel Environment Variables - Quick Reference

**Copy-paste ready list for adding to Vercel**

---

## 📋 All 8 Keys to Add

Add each one in Vercel Dashboard → Your Project → Settings → Environment Variables

**For each key:**
- Check all environments: ☑️ Production ☑️ Preview ☑️ Development
- Click "Save" after each one

---

### 1. Printful API Key
```
Name: PRINTFUL_API_KEY
Value: BHDDF5JNfcukUvV5DzgpwH52eWDk5tvwCPPFLLbc
```

### 2. Supabase URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://kanhbrdiagogexsyfkkl.supabase.co
```

### 3. Supabase Anon Key
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzQ1MzksImV4cCI6MjA4MDU1MDUzOX0.Pv7oWQCSixo_nQFuQqdOqXfvju938rP_4NB5CD7hLZI
```

### 4. Supabase Service Role Key
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk3NDUzOSwiZXhwIjoyMDgwNTUwNTM5fQ.vlDfknuiahsOjoN006vMvPGCOUE1TX3nAGlY8zXIduk
```

### 5. fal.ai API Key
```
Name: FAL_API_KEY
Value: 3c29bf78-1853-4485-9bfd-b02abf47b713:f6ab21b3c482877d0cfba50f534045a1
```

### 6. Stripe Publishable Key
```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_51SbCHlAEZcDQ4RzypNCEllbfrpsBHYMLDp5KCG9HW0GoguDkmKgXIjPy1tntYJnhhVUXPPetP2vuTmLVtESnQ6Ux00sppSTVvk
```

### 7. Stripe Secret Key
```
Name: STRIPE_SECRET_KEY
Value: sk_test_***REDACTED*** (Get from your .env.local file - never commit secrets!)
```

### 8. Resend API Key
```
Name: RESEND_API_KEY
Value: re_NwySnmb2_APFjvHxKTFxLbBZ9owWfgGcX
```

---

## ✅ Verification Checklist

After adding all 8 keys, verify:
- [ ] All 8 keys are listed in Environment Variables
- [ ] Each key has all 3 environments checked (Production, Preview, Development)
- [ ] Key names match exactly (case-sensitive!)
- [ ] Values are correct (no extra spaces)

---

## 📖 Full Instructions

For detailed step-by-step instructions, see: **[VERCEL-API-KEYS-SETUP.md](VERCEL-API-KEYS-SETUP.md)**

---

## 🔄 After Adding Keys

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"** to apply new environment variables

---

## ⚠️ Important

- **Never commit** these keys to GitHub (they're already in `.gitignore`)
- Keys starting with `NEXT_PUBLIC_` are safe to expose in frontend
- Keys without `NEXT_PUBLIC_` are secret - keep them private!
