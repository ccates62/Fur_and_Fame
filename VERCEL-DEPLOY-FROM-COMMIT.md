# 🎯 Deploy Specific Commit in Vercel

## Problem
Vercel keeps deploying from old commit `c57fdd0` instead of your latest code.

## Solution: Deploy from Specific Commit Hash

### Step 1: Get Your Latest Commit Hash

1. **Go to GitHub:** https://github.com/ccates62/Fur_and_Fame/commits/main
2. **Find the LATEST commit** (top of the list)
3. **Copy the commit hash** (first 7 characters, e.g., `a1b2c3d`)
   - Click on the commit to see the full hash
   - Copy the first 7 characters

### Step 2: Deploy That Commit in Vercel

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click on Fur_and_Fame project**
3. **Click "Deployments" tab**
4. **Click "..." menu** (top right)
5. **Click "Deploy"**
6. **In "Commit or Branch Reference" field:**
   - Paste your commit hash (e.g., `a1b2c3d`)
   - NOT the repository name
   - NOT "main" (that might use cached version)
7. **Click "Create Deployment"**
8. **IMPORTANT:** When it asks about cache, choose "Skip build cache" or uncheck cache
9. **Wait 2-5 minutes**

### Step 3: Verify It Worked

After deployment, check the build logs:

✅ **Should show:**
- Your commit hash (not `c57fdd0`)
- "Detected Next.js version: 16.0.7" (not 14.2.5)
- Route `/` size larger than 137 B

❌ **If still shows:**
- `c57fdd0` = Wrong commit
- Next.js 14.2.5 = Old code
- Route `/` = 137 B = Default page

---

## Alternative: Force Fresh Build Without Cache

If deploying from commit doesn't work:

1. **In Vercel → Deployments**
2. **Click "..." on latest deployment**
3. **Click "Redeploy"**
4. **UNCHECK "Use existing Build Cache"** (critical!)
5. **Click "Redeploy"**

This forces a completely fresh build.

---

## Check GitHub Has Latest Code

Before deploying, verify:

1. **Go to:** https://github.com/ccates62/Fur_and_Fame/blob/main/src/app/page.tsx
2. **Should show:**
   ```typescript
   import Hero from "@/components/Hero";
   import PortraitGallery from "@/components/PortraitGallery";
   ```
3. **Should NOT show:** "Welcome to Fur and Fame" or "Get started by editing"

If GitHub shows the default page, your code isn't pushed!

---

**The key is deploying from the SPECIFIC commit hash, not just "main"!**
