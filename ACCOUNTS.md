# 🐾 Fur & Fame - Service Accounts & API Keys Dashboard

> **Quick Setup Guide** - Track your account creation progress and collect all API keys in one place

---

## 📊 Setup Progress

| Service | Account Created | API Keys Collected | Status |
|---------|----------------|-------------------|--------|
| 🎨 Printful | ✅ | ✅ | **COMPLETE** |
| 🔐 Supabase | ✅ | ✅ | **COMPLETE** |
| 🤖 fal.ai | ✅ | ✅ | **COMPLETE** |
| 💳 Stripe | ✅ | ✅ | **COMPLETE** |
| 📧 Resend | ✅ | ✅ | **COMPLETE** |
| 🚀 Vercel | ⬜ | ⬜ | Pending |

---

## 🔐 Supabase ✅ COMPLETE

### Quick Links
- [**Sign Up**](https://supabase.com/dashboard/sign-up) | [**Dashboard**](https://supabase.com/dashboard) | [**Docs**](https://supabase.com/docs)

### ✅ Your Current Keys
```
NEXT_PUBLIC_SUPABASE_URL=https://kanhbrdiagogexsyfkkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzQ1MzksImV4cCI6MjA4MDU1MDUzOX0.Pv7oWQCSixo_nQFuQqdOqXfvju938rP_4NB5CD7hLZI
```

### 📍 Where to Find Keys
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ⚙️ Setup Checklist
- [x] Account created
- [x] API keys collected
- [ ] Storage enabled for pet photos
- [ ] Authentication configured (Email/Password)
- [ ] Database tables created (orders, users)

---

## 🤖 fal.ai

### Quick Links
- [**Sign Up**](https://fal.ai/dashboard) | [**Dashboard**](https://fal.ai/dashboard) | [**Docs**](https://fal.ai/docs)

### 🔑 API Key Needed
| Variable Name | Where to Find |
|--------------|---------------|
| `FAL_API_KEY` | Dashboard → API Keys → Create New Key |

### 📝 Setup Steps
1. [Sign up for fal.ai](https://fal.ai/dashboard)
2. Navigate to **Dashboard** → **API Keys**
3. Click **Create API Key** or **Generate New Key**
4. Copy the key (starts with random characters)
5. Paste it below ⬇️

### ✅ Your Current Key
```
FAL_API_KEY=3c29bf78-1853-4485-9bfd-b02abf47b713:f6ab21b3c482877d0cfba50f534045a1
```

### ⚙️ Setup Checklist
- [x] Account created
- [x] API key generated
- [x] Key copied and saved

---

## 💳 Stripe

### Quick Links
- [**Sign Up**](https://dashboard.stripe.com/register) | [**Dashboard**](https://dashboard.stripe.com) | [**Docs**](https://stripe.com/docs)

### 🔑 API Keys Needed
| Variable Name | Where to Find | Format |
|--------------|---------------|--------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Developers → API keys → Publishable key | `pk_test_...` or `pk_live_...` |
| `STRIPE_SECRET_KEY` | Developers → API keys → Secret key | `sk_test_...` or `sk_live_...` |

### 📝 Setup Steps
1. [Sign up for Stripe](https://dashboard.stripe.com/register)
2. Go to **Developers** → **API keys**
3. Make sure you're in **Test mode** (toggle in top right)
4. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Click **Reveal test key** and copy → `STRIPE_SECRET_KEY`
6. Paste both keys below ⬇️

### 📋 Your Keys (Paste Here)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

### ⚙️ Setup Checklist
- [ ] Account created
- [ ] Test mode enabled
- [ ] Publishable key copied
- [ ] Secret key copied
- [ ] Webhook endpoint configured (later)

### 💰 Products to Configure
- $59 - 12x12 Canvas
- $89 - 16x20 Canvas
- $19 - Mug
- $99 - Bundle

---

## 🎨 Printful

### Quick Links
- [**Sign Up**](https://www.printful.com/sign-up) | [**Dashboard**](https://www.printful.com/dashboard) | [**Docs**](https://developers.printful.com/)

### 🔑 API Key Needed
| Variable Name | Where to Find |
|--------------|---------------|
| `PRINTFUL_API_KEY` | Dashboard → Stores → [Your Store] → API → Generate API key |

### 📝 Setup Steps
1. [Sign up for Printful](https://www.printful.com/sign-up)
2. Create or connect a store
3. Go to **Dashboard** → **Stores** → Select your store
4. Navigate to **API** section
5. Click **Generate API key** or **Create API key**
6. Copy the key
7. Paste it below ⬇️

### ✅ Your Current Key
```
PRINTFUL_API_KEY=BHDDF5JNfcukUvV5DzgpwH52eWDk5tvwCPPFLLbc
```

### ⚙️ Setup Checklist
- [x] Account created
- [x] Store connected
- [x] API key generated
- [ ] Products configured (canvas prints, mugs)
- [ ] Webhook configured (later)

---

## 📧 Resend ✅ COMPLETE

### Quick Links
- [**Sign Up**](https://resend.com/signup) | [**Dashboard**](https://resend.com/emails) | [**Docs**](https://resend.com/docs)

### ✅ Your Current Key
```
RESEND_API_KEY=re_NwySnmb2_APFjvHxKTFxLbBZ9owWfgGcX
```

### 📍 Where to Find Keys
1. Go to **API Keys** in your Resend dashboard
2. Click **Create API Key** to generate new keys
3. Copy the key (starts with `re_...`)

### ⚙️ Setup Checklist
- [x] Account created
- [x] API key generated
- [x] Key copied and saved
- [ ] Domain verified (for production - later)

---

## 🚀 Vercel (Deployment)

### Quick Links
- [**Sign Up**](https://vercel.com/signup) | [**Dashboard**](https://vercel.com/dashboard) | [**Docs**](https://vercel.com/docs)
- [**📖 Complete Step-by-Step Guide**](VERCEL-API-KEYS-SETUP.md) - Detailed instructions for adding all API keys

### 📝 Setup Steps
1. [Sign up for Vercel](https://vercel.com/signup) (use GitHub account)
2. Connect your GitHub repository
3. Import your `Fur_and_Fame` project
4. Add all environment variables from `.env.local` (see [detailed guide](VERCEL-API-KEYS-SETUP.md))
5. Deploy!

### ⚙️ Setup Checklist
- [ ] Account created
- [ ] GitHub repo connected
- [ ] Project imported
- [ ] All 8 environment variables added (see [VERCEL-API-KEYS-SETUP.md](VERCEL-API-KEYS-SETUP.md))
- [ ] First deployment successful

---

## 🔑 All API Keys Summary

Once you have all keys, they'll be automatically saved to `.env.local`. Here's your complete list:

```env
# Supabase ✅
NEXT_PUBLIC_SUPABASE_URL=https://kanhbrdiagogexsyfkkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzQ1MzksImV4cCI6MjA4MDU1MDUzOX0.Pv7oWQCSixo_nQFuQqdOqXfvju938rP_4NB5CD7hLZI

# Printful ✅
PRINTFUL_API_KEY=BHDDF5JNfcukUvV5DzgpwH52eWDk5tvwCPPFLLbc

# fal.ai ✅
FAL_API_KEY=3c29bf78-1853-4485-9bfd-b02abf47b713:f6ab21b3c482877d0cfba50f534045a1

# Stripe ✅
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SbCHlAEZcDQ4RzypNCEllbfrpsBHYMLDp5KCG9HW0GoguDkmKgXIjPy1tntYJnhhVUXPPetP2vuTmLVtESnQ6Ux00sppSTVvk
STRIPE_SECRET_KEY=sk_test_***REDACTED*** (stored in .env.local - never commit secrets!)

# Resend ✅
RESEND_API_KEY=re_NwySnmb2_APFjvHxKTFxLbBZ9owWfgGcX
```

---

## 💡 Quick Tips

- **Test Mode First**: Always start with test/development keys
- **Keep Keys Secret**: Never commit `.env.local` to git (it's already in `.gitignore`)
- **One at a Time**: Complete one service before moving to the next
- **Bookmark This**: Keep this file open while setting up accounts
- **Copy Carefully**: API keys are long - make sure you copy the entire key

---

## 🆘 Need Help?

- Check the **Docs** links for each service
- Most services have helpful setup wizards
- API keys are usually found in **Settings** or **API Keys** sections

---

**Last Updated:** When you add new keys, update the status checkboxes above! ✅
