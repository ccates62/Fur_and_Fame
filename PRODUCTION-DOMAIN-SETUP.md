# 🌐 Production Domain Configuration - www.furandfame.com

## Overview

Configure your application to use the production domain `www.furandfame.com` for all customer-facing features.

---

## ✅ What's Been Configured

### 1. Environment Variables
- Added `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_SITE_URL` to `business-info.env.example`
- These should be set to `https://www.furandfame.com` in production

### 2. API Routes Updated
- ✅ `src/app/api/checkout-additional/route.ts` - Uses production domain for Stripe redirects
- ✅ `src/app/accounts/links/page.tsx` - Uses production domain for website link

### 3. Wave Recovery Keys
- ✅ Added all 8 Wave recovery keys to `business-info.env.example`

---

## 🔧 Configuration Steps

### Step 1: Add to `.env.local`

Add these to your `.env.local` file:

```env
# Production Domain
NEXT_PUBLIC_BASE_URL=https://www.furandfame.com
NEXT_PUBLIC_SITE_URL=https://www.furandfame.com

# Wave Recovery Keys
WAVE_RECOVERY_KEY_1=1u14j6efwxeqt
WAVE_RECOVERY_KEY_2=smbkhs3gw4jpe
WAVE_RECOVERY_KEY_3=9qf86ku757fg3
WAVE_RECOVERY_KEY_4=qbpcy1m1354ey
WAVE_RECOVERY_KEY_5=eiotzz4js7bif
WAVE_RECOVERY_KEY_6=5aio9i9eny7ct
WAVE_RECOVERY_KEY_7=9hq8sipo13sa6
WAVE_RECOVERY_KEY_8=a4qojy9qyfmxf
```

### Step 2: Configure in Vercel

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Select your project:** Fur_and_Fame
3. **Go to Settings → Environment Variables**
4. **Add these variables:**
   - `NEXT_PUBLIC_BASE_URL` = `https://www.furandfame.com`
   - `NEXT_PUBLIC_SITE_URL` = `https://www.furandfame.com`
   - All Wave recovery keys (WAVE_RECOVERY_KEY_1 through WAVE_RECOVERY_KEY_8)

5. **Redeploy** your application after adding variables

---

## 🌐 Domain Configuration in Vercel

### Verify Domain Setup

1. **Check Domain Status:**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Verify `www.furandfame.com` is listed and shows "Valid Configuration"

2. **If Domain Shows "Invalid Configuration":**
   - Click "Learn more" to see DNS records needed
   - Add those DNS records at Namecheap
   - Wait 15-30 minutes for DNS propagation
   - Refresh in Vercel

### DNS Records Needed (Typical)

At Namecheap, you typically need:
- **A Record:** `@` → Vercel IP (check Vercel for exact IP)
- **CNAME Record:** `www` → `cname.vercel-dns.com` (check Vercel for exact value)

---

## 🔍 Where Production Domain is Used

### API Routes:
- ✅ Stripe checkout success/cancel URLs
- ✅ Redirect URLs after payment
- ✅ Webhook callbacks

### Frontend:
- ✅ Business links dashboard
- ✅ Email links
- ✅ Social sharing URLs

---

## 🧪 Testing Production Domain

### Before Going Live:
1. **Test locally** with `NEXT_PUBLIC_BASE_URL` set
2. **Test in Vercel preview** deployment
3. **Test on production** domain once DNS is configured

### Verify:
- [ ] Stripe checkout redirects work
- [ ] All links use production domain
- [ ] No localhost URLs in production
- [ ] Email links work correctly

---

## 📝 Next Steps

1. **Add environment variables** to `.env.local` (see Step 1 above)
2. **Add environment variables** to Vercel (see Step 2 above)
3. **Verify domain** is configured in Vercel
4. **Test** checkout flow on production domain
5. **Redeploy** if needed

---

## ⚠️ Important Notes

- **Development:** Will still use `localhost:3000` when running locally
- **Production:** Will automatically use `www.furandfame.com` when deployed
- **Wave Keys:** Store securely - needed for account recovery
- **DNS Propagation:** Can take up to 48 hours (usually 15-30 minutes)

---

## 🔐 Wave Recovery Keys Security

Your Wave recovery keys are stored in:
- ✅ `.env.local` (local development)
- ✅ Vercel Environment Variables (production)
- ✅ `business-info.env.example` (template only - not committed)

**Important:** Never commit `.env.local` to git (already in `.gitignore`)

---

**Your production domain is now configured! 🎉**
