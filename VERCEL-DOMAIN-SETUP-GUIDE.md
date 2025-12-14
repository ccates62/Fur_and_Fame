# 🌐 Vercel Domain Setup Guide - Fix Invalid Configuration

## Current Issue

Your domains `furandfame.com` and `www.furandfame.com` show "Invalid Configuration" in Vercel. This means the DNS records aren't pointing to Vercel yet.

---

## Step 1: Check What's Wrong

1. In Vercel, click **"Learn more"** next to the "Invalid Configuration" badge
2. This will show you the specific DNS records you need to add
3. Note down the DNS records Vercel wants you to add

---

## Step 2: Do You Own the Domain?

### If you DON'T own `furandfame.com` yet:

**Option A: Use Vercel URL for Stripe (Quick Fix)**
- Use `https://furandfame.vercel.app` in Stripe
- This works immediately and Stripe accepts it
- You can update to custom domain later

**Option B: Purchase the Domain**
- Buy `furandfame.com` from:
  - Namecheap: https://www.namecheap.com
  - Google Domains: https://domains.google
  - GoDaddy: https://www.godaddy.com
- Cost: Usually $10-15/year
- Then follow steps below

### If you DO own `furandfame.com`:

Continue to Step 3 to configure DNS.

---

## Step 3: Configure DNS Records

### What Vercel Needs:

Vercel typically needs these DNS records:

1. **A Record** (for root domain):
   - Type: `A`
   - Name: `@` or `furandfame.com`
   - Value: `76.76.21.21` (Vercel's IP - check Vercel for current IP)
   - TTL: `3600` or default

2. **CNAME Record** (for www subdomain):
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com` (check Vercel for exact value)
   - TTL: `3600` or default

**OR** Vercel might use:
- **CNAME for root domain** pointing to Vercel
- **CNAME for www** pointing to Vercel

### How to Add DNS Records:

1. **Log into your domain registrar** (where you bought the domain)
   - Namecheap, Google Domains, GoDaddy, etc.

2. **Find DNS Management:**
   - Look for "DNS Settings", "DNS Management", or "Advanced DNS"
   - Usually in domain settings

3. **Add the Records Vercel Shows:**
   - Click "Learn more" in Vercel to see exact records needed
   - Copy the records exactly as shown
   - Add them in your domain registrar's DNS panel

4. **Save and Wait:**
   - DNS changes can take 24-48 hours to propagate
   - Usually works within a few hours

---

## Step 4: Verify in Vercel

1. After adding DNS records, go back to Vercel
2. Click **"Refresh"** button next to your domain
3. Wait a few minutes and refresh again
4. Status should change from "Invalid Configuration" to "Valid Configuration"

---

## Quick Fix for Stripe (Right Now)

**While you're setting up DNS, use this in Stripe:**

```
https://furandfame.vercel.app
```

This works immediately and Stripe accepts Vercel URLs. You can update Stripe later once your custom domain is working.

---

## Common Issues

### Issue: "Invalid Configuration" persists after adding DNS

**Solutions:**
1. Wait longer (DNS can take 24-48 hours)
2. Check DNS records are exactly as Vercel shows
3. Make sure you're editing DNS at your domain registrar (not Vercel)
4. Clear your browser cache
5. Click "Refresh" in Vercel after waiting

### Issue: Domain not found / doesn't exist

**Solution:**
- You need to purchase the domain first
- Or use the Vercel URL (`furandfame.vercel.app`) for now

### Issue: DNS records won't save

**Solution:**
- Make sure you're logged into the correct account
- Check you have permission to edit DNS
- Try a different browser
- Contact your domain registrar support

---

## Step-by-Step: Namecheap Example

If you use Namecheap:

1. Log into Namecheap
2. Go to **Domain List**
3. Click **Manage** next to `furandfame.com`
4. Go to **Advanced DNS** tab
5. Add records as Vercel shows:
   - Click **Add New Record**
   - Select record type (A or CNAME)
   - Enter values from Vercel
   - Save
6. Wait 15-30 minutes
7. Refresh in Vercel

---

## Step-by-Step: Google Domains Example

If you use Google Domains:

1. Log into Google Domains
2. Click on `furandfame.com`
3. Go to **DNS** section
4. Scroll to **Custom resource records**
5. Add records as Vercel shows
6. Save
7. Wait 15-30 minutes
8. Refresh in Vercel

---

## What to Do Right Now

**For Stripe (immediate):**
1. Use: `https://furandfame.vercel.app`
2. This will work and let you continue

**For Domain Setup (when ready):**
1. Click "Learn more" in Vercel to see exact DNS records
2. Add those records at your domain registrar
3. Wait for DNS to propagate
4. Update Stripe later with `https://furandfame.com`

---

## Need Help?

- **Vercel DNS Docs:** https://vercel.com/docs/concepts/projects/domains
- **Vercel Support:** Check Vercel dashboard for support
- **Domain Registrar Support:** Contact where you bought the domain

---

**Bottom Line:** Use `https://furandfame.vercel.app` in Stripe now, fix the domain DNS later when you have time.
