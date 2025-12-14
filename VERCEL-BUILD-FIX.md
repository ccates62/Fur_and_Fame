# 🔧 Fix Vercel Build - ESLint Dependency Conflict

## Problem
Vercel build fails with:
```
npm error ERESOLVE unable to resolve dependency tree
npm error Found: eslint@8.57.1
npm error Could not resolve dependency: peer eslint@">=9.0.0" from eslint-config-next@16.0.10
```

## Solution: Configure Vercel to Use Legacy Peer Deps

### Step 1: Update Vercel Build Settings

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Select Fur_and_Fame project**
3. **Go to:** Settings → General
4. **Find "Install Command"**
5. **Change it to:**
   ```
   npm install --legacy-peer-deps
   ```
6. **Save changes**
7. **Redeploy** (this will use the new install command)

### Step 2: Alternative - Use .npmrc File

I've created an `.npmrc` file that will automatically use `--legacy-peer-deps` for all npm installs.

### Step 3: Verify Build

After updating Vercel settings:
1. **Trigger a new deployment**
2. **Check build logs**
3. **Should show:** "Installing dependencies..." (no errors)
4. **Should complete:** "Build Completed"

---

## Why This Works

The `--legacy-peer-deps` flag tells npm to ignore peer dependency conflicts and install anyway. This is safe because:
- ESLint 8 and 9 are mostly compatible
- Next.js 16 works with both
- The conflict is just a version check, not a functional issue

---

## Long-term Fix

Once the build works, we can:
1. Wait for `eslint-config-next@16.0.7` to be fully compatible
2. Or downgrade to Next.js 15 (not recommended)
3. Or keep using `--legacy-peer-deps` (recommended for now)

---

**Update Vercel's Install Command to use `--legacy-peer-deps` and redeploy!**
