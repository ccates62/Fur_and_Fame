# 🔧 Fix Vercel Build - Update Install Command

## Problem
Vercel build still fails even with `.npmrc` file. The install command needs to be updated in Vercel settings.

## Solution: Update Vercel Install Command

### Step 1: Go to Vercel Settings

1. **Go to:** https://vercel.com/dashboard
2. **Click on:** Fur_and_Fame project
3. **Click:** Settings tab
4. **Click:** General (in left sidebar)

### Step 2: Update Install Command in PROJECT SETTINGS

1. **Scroll down to:** "Build & Development Settings"
2. **Find:** "Install Command"
3. **Change from:** `npm install` (or blank/default)
4. **Change to:** `npm install --legacy-peer-deps`
5. **Click:** Save

### Step 3: Update Production Override (if shown)

If you see "Production Overrides" section:
1. **Click:** "Edit" or the override section
2. **Find:** "Install Command"
3. **Change to:** `npm install --legacy-peer-deps`
4. **OR:** Click "Use Project Settings" to remove the override
5. **Click:** Save

### Step 4: Redeploy

1. **Go to:** Deployments tab
2. **Click:** "..." menu on latest deployment
3. **Click:** "Redeploy"
4. **Uncheck:** "Use existing Build Cache"
5. **Click:** "Redeploy"
6. **Wait 2-5 minutes**

---

## Why This Is Needed

Even though `.npmrc` has `legacy-peer-deps=true`, Vercel might not read it during the build process. Setting it explicitly in the Install Command ensures it's used.

**Important:** If you see "Production Overrides", you need to update BOTH:
- Project Settings (affects all environments)
- Production Override (affects production only)

**OR** remove the Production Override to use Project Settings.

---

## Expected Result

After updating:
- ✅ Build logs should show: "Installing dependencies..." (no errors)
- ✅ Should complete: "Build Completed"
- ✅ No more ESLint dependency conflicts

---

**Update the Install Command in BOTH Project Settings AND Production Override (or remove the override), then redeploy!**
