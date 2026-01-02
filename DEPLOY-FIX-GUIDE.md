# 🚀 Quick Fix: Get Your Website Online

## Current Problem
Your website `www.furandfame.com` shows `ERR_CONNECTION_REFUSED` because:
1. ✅ Code builds successfully locally
2. ❌ Latest code (including checkout page) isn't deployed to Vercel
3. ❌ DNS may not be configured correctly

---

## Step 1: Commit and Push Your Latest Changes

You have uncommitted changes including the new checkout page. Let's push them:

```bash
# Add all changes
git add .

# Commit with a message
git commit -m "Add checkout page and fix TypeScript errors"

# Push to GitHub
git push origin main
```

**After pushing, Vercel will automatically deploy if it's connected to your GitHub repo.**

---

## Step 2: Check Vercel Deployment

### Option A: If Vercel is Already Connected to GitHub

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Check if your project `Fur_and_Fame` exists
3. Look for the latest deployment (should trigger automatically after git push)
4. Wait for deployment to complete (usually 2-3 minutes)

### Option B: If Vercel is NOT Connected Yet

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import from GitHub → Select `Fur_and_Fame` repository
4. **IMPORTANT:** Add all environment variables from your `.env.local`:
   - `PRINTFUL_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FAL_API_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `RESEND_API_KEY`
   - `FAL_TEST_MODE` (if you want test mode)
5. Click **"Deploy"**

---

## Step 3: Test the Vercel URL

Once deployed, you'll get a Vercel URL like:
- `https://fur-and-fame.vercel.app` or
- `https://fur-and-fame-xyz123.vercel.app`

**Try accessing this URL first** - it should work immediately!

---

## Step 4: Fix Custom Domain (www.furandfame.com)

### If the Vercel URL works but custom domain doesn't:

1. **In Vercel Dashboard:**
   - Go to your project → **Settings** → **Domains**
   - Add `furandfame.com` and `www.furandfame.com`
   - Vercel will show you DNS records to add

2. **In Your Domain Registrar** (where you bought the domain):
   - Go to DNS Management
   - Add the DNS records Vercel shows you
   - Usually:
     - **A Record** for `furandfame.com` → Vercel IP
     - **CNAME Record** for `www` → `cname.vercel-dns.com`

3. **Wait for DNS Propagation:**
   - Can take 15 minutes to 48 hours
   - Usually works within 1-2 hours

### Quick Test:
- Use `https://fur-and-fame.vercel.app` for now (works immediately)
- Update Stripe webhooks to use Vercel URL temporarily
- Switch to custom domain once DNS propagates

---

## Step 5: Verify Everything Works

1. ✅ **Vercel URL works** → Site is deployed correctly
2. ✅ **Custom domain works** → DNS is configured
3. ✅ **Checkout page loads** → `/checkout` route works
4. ✅ **API routes work** → Test `/api/test-mode-status`

---

## Common Issues & Solutions

### Issue: "Deployment Failed" in Vercel
**Solution:**
- Check build logs in Vercel
- Make sure all environment variables are added
- Verify `package.json` has correct Node version

### Issue: "Invalid Configuration" for Domain
**Solution:**
- DNS records not added yet
- Wait for DNS propagation
- Use Vercel URL in the meantime

### Issue: Site works on Vercel URL but not custom domain
**Solution:**
- DNS not configured or still propagating
- Check DNS records match exactly what Vercel shows
- Wait longer (up to 48 hours)

---

## Quick Commands to Run Now

```bash
# 1. Commit and push your changes
git add .
git commit -m "Add checkout page and fix build errors"
git push origin main

# 2. Check Vercel dashboard after 2-3 minutes
# 3. Test the Vercel URL
# 4. Configure DNS if needed
```

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **DNS Setup:** See `VERCEL-DOMAIN-SETUP-GUIDE.md` in your project
- **Check Vercel Dashboard:** https://vercel.com/dashboard

**Bottom Line:** Push your code, deploy to Vercel, then fix DNS. The Vercel URL will work immediately!

