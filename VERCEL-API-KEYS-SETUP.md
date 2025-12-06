# 🚀 Vercel API Keys Setup - Step by Step Guide

Complete guide for adding all your API keys to Vercel for deployment.

---

## 📋 Prerequisites

- ✅ All API keys ready in your `.env.local` file
- ✅ GitHub repository created and code pushed
- ✅ Vercel account (or ready to create one)

---

## Step 1: Sign Up / Log In to Vercel

1. Go to: **https://vercel.com/signup**
2. Click **"Continue with GitHub"** (recommended - easiest way)
3. Authorize Vercel to access your GitHub account
4. Complete signup if needed

**Alternative:** Sign up with email, then connect GitHub later

---

## Step 2: Connect Your GitHub Repository

1. After logging in, you'll see the Vercel Dashboard
2. Click the **"Add New..."** button (top right)
3. Select **"Project"**
4. You'll see a list of your GitHub repositories
5. Find **`Fur_and_Fame`** (or your repo name)
6. Click **"Import"** next to it

**If you don't see your repo:**
- Click **"Adjust GitHub App Permissions"**
- Make sure Vercel has access to your repositories
- Refresh the page

---

## Step 3: Configure Project Settings

After clicking "Import", you'll see the project configuration page:

### Basic Settings:
- **Project Name:** `fur-and-fame` (or keep default)
- **Framework Preset:** Should auto-detect "Next.js" ✅
- **Root Directory:** Leave as `./` (unless your Next.js app is in a subfolder)
- **Build Command:** `npm run build` (auto-filled)
- **Output Directory:** `.next` (auto-filled)
- **Install Command:** `npm install` (auto-filled)

**✅ Don't click "Deploy" yet!** We need to add environment variables first.

---

## Step 4: Add Environment Variables

This is the **most important step** - adding all your API keys.

### 4a. Find the Environment Variables Section

On the project configuration page, scroll down to:
**"Environment Variables"** section

### 4b. Add Each Key One by One

Click **"Add"** for each environment variable below. Copy the **exact name** and **value** from your `.env.local`:

#### 🔑 Key 1: Printful
- **Name:** `PRINTFUL_API_KEY`
- **Value:** `BHDDF5JNfcukUvV5DzgpwH52eWDk5tvwCPPFLLbc`
- **Environment:** Check all three: ☑️ Production ☑️ Preview ☑️ Development
- Click **"Save"**

#### 🔑 Key 2: Supabase URL
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://kanhbrdiagogexsyfkkl.supabase.co`
- **Environment:** ☑️ Production ☑️ Preview ☑️ Development
- Click **"Save"**

#### 🔑 Key 3: Supabase Anon Key
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzQ1MzksImV4cCI6MjA4MDU1MDUzOX0.Pv7oWQCSixo_nQFuQqdOqXfvju938rP_4NB5CD7hLZI`
- **Environment:** ☑️ Production ☑️ Preview ☑️ Development
- Click **"Save"**

#### 🔑 Key 4: Supabase Service Role Key
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk3NDUzOSwiZXhwIjoyMDgwNTUwNTM5fQ.vlDfknuiahsOjoN006vMvPGCOUE1TX3nAGlY8zXIduk`
- **Environment:** ☑️ Production ☑️ Preview ☑️ Development
- Click **"Save"**

#### 🔑 Key 5: fal.ai
- **Name:** `FAL_API_KEY`
- **Value:** `3c29bf78-1853-4485-9bfd-b02abf47b713:f6ab21b3c482877d0cfba50f534045a1`
- **Environment:** ☑️ Production ☑️ Preview ☑️ Development
- Click **"Save"**

#### 🔑 Key 6: Stripe Publishable Key
- **Name:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Value:** `pk_test_51SbCHlAEZcDQ4RzypNCEllbfrpsBHYMLDp5KCG9HW0GoguDkmKgXIjPy1tntYJnhhVUXPPetP2vuTmLVtESnQ6Ux00sppSTVvk`
- **Environment:** ☑️ Production ☑️ Preview ☑️ Development
- Click **"Save"**

#### 🔑 Key 7: Stripe Secret Key
- **Name:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_***REDACTED***` (Get from your `.env.local` file - never commit secrets!)
- **Environment:** ☑️ Production ☑️ Preview ☑️ Development
- Click **"Save"**

#### 🔑 Key 8: Resend
- **Name:** `RESEND_API_KEY`
- **Value:** `re_NwySnmb2_APFjvHxKTFxLbBZ9owWfgGcX`
- **Environment:** ☑️ Production ☑️ Preview ☑️ Development
- Click **"Save"**

---

## Step 5: Verify All Keys Added

Before deploying, check that you have **8 environment variables** total:

1. `PRINTFUL_API_KEY` ✅
2. `NEXT_PUBLIC_SUPABASE_URL` ✅
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
4. `SUPABASE_SERVICE_ROLE_KEY` ✅
5. `FAL_API_KEY` ✅
6. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ✅
7. `STRIPE_SECRET_KEY` ✅
8. `RESEND_API_KEY` ✅

---

## Step 6: Deploy!

1. Scroll to the bottom of the configuration page
2. Click the big **"Deploy"** button
3. Vercel will:
   - Install dependencies (`npm install`)
   - Build your Next.js app (`npm run build`)
   - Deploy to production
4. Wait 2-5 minutes for the build to complete

---

## Step 7: Verify Deployment

1. After deployment completes, you'll see:
   - ✅ **"Ready"** status
   - A live URL like: `https://fur-and-fame.vercel.app`
2. Click the URL to visit your deployed site
3. Test that everything works:
   - Visit `/accounts` page
   - Check that API keys are loading
   - Test any API endpoints

---

## 🔧 Adding Keys Later (After Initial Deploy)

If you need to add or update keys after deployment:

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Settings"** tab (top navigation)
3. Click **"Environment Variables"** (left sidebar)
4. Click **"Add New"**
5. Enter name and value
6. Select environments (Production, Preview, Development)
7. Click **"Save"**
8. **Important:** Go to **"Deployments"** tab
9. Click the **"..."** menu on the latest deployment
10. Click **"Redeploy"** to apply new environment variables

---

## ⚠️ Important Notes

### Environment Selection
- **Production:** Your live site (what users see)
- **Preview:** Test deployments from pull requests
- **Development:** Local development (if using Vercel CLI)

**Best Practice:** Check all three for most keys, so they work everywhere.

### Secret Keys
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Keep secret!
- ✅ `STRIPE_SECRET_KEY` - Keep secret!
- ✅ `FAL_API_KEY` - Keep secret!
- ✅ `PRINTFUL_API_KEY` - Keep secret!
- ✅ `RESEND_API_KEY` - Keep secret!

**Public Keys (safe to expose in frontend):**
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Public (starts with `NEXT_PUBLIC_`)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public (starts with `NEXT_PUBLIC_`)
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Public (starts with `NEXT_PUBLIC_`)

### Stripe Keys
- Your current keys are **test keys** (`pk_test_` and `sk_test_`)
- For production, you'll need to:
  1. Get live keys from Stripe Dashboard
  2. Update them in Vercel Environment Variables
  3. Redeploy

---

## 🐛 Troubleshooting

### Build Fails
- **Check:** All 8 environment variables are added
- **Check:** Variable names match exactly (case-sensitive!)
- **Check:** No extra spaces in values
- **Check:** Build logs in Vercel dashboard for specific errors

### API Keys Not Working
- **Check:** Keys are added to correct environment (Production/Preview)
- **Check:** You redeployed after adding keys
- **Check:** Keys match your `.env.local` exactly

### Can't See GitHub Repo
- **Check:** Repository is public, OR
- **Check:** Vercel GitHub App has access to private repos
- **Fix:** Go to GitHub → Settings → Applications → Vercel → Configure access

---

## ✅ Checklist

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project imported
- [ ] All 8 environment variables added
- [ ] All variables set for Production, Preview, and Development
- [ ] Initial deployment successful
- [ ] Site loads and works correctly
- [ ] API keys verified in dashboard

---

## 🎉 You're Done!

Your Fur & Fame app is now deployed on Vercel with all API keys configured!

**Next Steps:**
- Set up custom domain (optional)
- Configure Stripe webhooks
- Set up Printful webhooks
- Test the full order flow

---

## 📚 Quick Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Docs - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Docs - Next.js](https://vercel.com/docs/frameworks/nextjs)
