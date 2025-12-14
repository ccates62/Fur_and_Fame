# 📊 Google Analytics Complete Setup Guide

## Quick Start (5 Minutes)

### Step 1: Create Google Analytics Account

1. **Go to Google Analytics:**
   - Visit: https://analytics.google.com/
   - Sign in with your Google account (or create one)

2. **Start Measuring:**
   - Click "Start measuring" or "Create Account"
   - Account name: **Fur and Fame** (or **Timberline Collective LLC**)
   - Click "Next"

3. **Set Up Property:**
   - Property name: **Fur and Fame Website**
   - Reporting time zone: **Pacific Time (US & Canada)**
   - Currency: **United States Dollar (USD)**
   - Click "Next"

4. **Business Information:**
   - Industry category: **E-commerce** or **Retail**
   - Business size: **Small** (or appropriate size)
   - How you intend to use Google Analytics: Select relevant options
   - Click "Create"

5. **Accept Terms:**
   - Read and accept Google Analytics Terms of Service
   - Click "I Accept"

---

### Step 2: Get Your Measurement ID

1. **After creating your property, you'll see a setup screen**

2. **Select "Web" as your platform**

3. **Enter your website details:**
   - Website URL: `https://www.furandfame.com`
   - Stream name: **Fur and Fame Website** (or leave default)

4. **Click "Create stream"**

5. **Copy Your Measurement ID:**
   - You'll see a screen with your **Measurement ID**
   - Format: `G-XXXXXXXXXX` (starts with "G-" followed by 10 characters)
   - **Copy this ID** - you'll need it in the next step

---

### Step 3: Add to Your Website

1. **Open your `.env.local` file** (in your project root)

2. **Add the following line:**
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
   Replace `G-XXXXXXXXXX` with your actual Measurement ID

3. **Save the file**

4. **Restart your development server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

---

### Step 4: Verify It's Working

1. **Visit your website:**
   - Go to `http://localhost:3000` (or your deployed URL)
   - Navigate around a few pages

2. **Check Google Analytics:**
   - Go back to Google Analytics dashboard
   - Click **Reports** → **Realtime** (in left sidebar)
   - You should see your visit appear within 30-60 seconds
   - You'll see "1 user right now" if it's working

3. **If you don't see data:**
   - Wait 1-2 minutes (there can be a delay)
   - Make sure you're looking at the correct property
   - Check that `NEXT_PUBLIC_GA_ID` is set correctly
   - Make sure you restarted the server after adding the variable
   - Check browser console for any errors

---

## Advanced Setup (Optional)

### Set Up Conversion Goals

1. **In Google Analytics, go to Admin** (gear icon, bottom left)

2. **Under "Property," click "Events"**

3. **Click "Create event"**

4. **Set up key events:**
   - **Portrait Generation Completed:**
     - Event name: `portrait_generated`
     - Conditions: Custom event parameter
   
   - **Purchase Completed:**
     - Event name: `purchase`
     - Conditions: Custom event parameter

5. **Mark as Conversion:**
   - Toggle "Mark as conversion" for important events

---

### Link Google Search Console

1. **Set up Google Search Console:**
   - Go to https://search.google.com/search-console
   - Add your property: `https://www.furandfame.com`
   - Verify ownership (DNS or HTML file)

2. **Link to Analytics:**
   - In Google Analytics, go to **Admin**
   - Under "Property," click **Search Console links**
   - Click **Link** and select your Search Console property

---

### Set Up E-commerce Tracking

For tracking Stripe purchases:

1. **In Google Analytics, go to Admin**

2. **Under "Property," click "Data Streams"**

3. **Click on your web stream**

4. **Enable "Enhanced measurement"** (if not already enabled)

5. **In your code, add purchase events:**
   - This requires custom event tracking in your checkout flow
   - Contact support if you need help implementing this

---

## What's Being Tracked

Currently, your website tracks:
- ✅ **Page views** - Every page visit
- ✅ **User sessions** - How long users stay
- ✅ **Traffic sources** - Where visitors come from
- ✅ **Device information** - Desktop, mobile, tablet
- ✅ **Browser information** - Chrome, Safari, Firefox, etc.
- ✅ **Geographic location** - Country, city (anonymized)
- ✅ **User flow** - How users navigate your site

---

## Privacy & Compliance

### Cookie Consent (Recommended)

Google Analytics uses cookies. You may need to add a cookie consent banner:

1. **Check your jurisdiction's requirements:**
   - GDPR (Europe): Required
   - CCPA (California): Recommended
   - Other regions: Check local laws

2. **Options for cookie consent:**
   - Use a library like `react-cookie-consent`
   - Or implement a custom banner

3. **Your Privacy Policy already mentions Google Analytics** ✅

### Anonymize IP Addresses (Recommended)

1. **In Google Analytics, go to Admin**

2. **Under "Property," click "Data Settings" → "Data Collection"**

3. **Enable "Anonymize IP addresses"**

This helps with privacy compliance.

---

## Troubleshooting

### Problem: No data showing in Analytics

**Solutions:**
1. ✅ Verify `NEXT_PUBLIC_GA_ID` is in `.env.local`
2. ✅ Restart your development server
3. ✅ Check the Measurement ID format (should start with `G-`)
4. ✅ Wait 1-2 minutes (real-time data can have delays)
5. ✅ Check browser console for JavaScript errors
6. ✅ Make sure ad blockers aren't blocking the script
7. ✅ Verify you're looking at the correct property in GA

### Problem: Data shows but seems incorrect

**Solutions:**
1. Check that you're viewing the correct date range
2. Real-time data is different from standard reports
3. Standard reports can take 24-48 hours to fully populate
4. Make sure you're not filtering out your own traffic (if desired)

### Problem: "Measurement ID not found" error

**Solutions:**
1. Double-check the ID in `.env.local`
2. Make sure there are no extra spaces
3. Verify the ID starts with `G-`
4. Restart the server after making changes

---

## Testing Checklist

- [ ] Created Google Analytics account
- [ ] Created property for website
- [ ] Got Measurement ID (format: `G-XXXXXXXXXX`)
- [ ] Added `NEXT_PUBLIC_GA_ID` to `.env.local`
- [ ] Restarted development server
- [ ] Visited website and navigated pages
- [ ] Checked Google Analytics Realtime report
- [ ] Saw visit appear in Analytics (within 1-2 minutes)
- [ ] Verified data is being tracked correctly

---

## Next Steps

1. **Monitor your traffic:**
   - Check Analytics daily/weekly
   - Look for trends and patterns
   - Identify popular pages

2. **Set up custom events:**
   - Track button clicks
   - Track form submissions
   - Track conversions (purchases)

3. **Create custom reports:**
   - Set up dashboards for key metrics
   - Create reports for stakeholders

4. **Link other Google services:**
   - Google Search Console (SEO)
   - Google Ads (if you run ads)
   - Google Tag Manager (advanced tracking)

---

## Quick Reference

**Google Analytics Dashboard:** https://analytics.google.com/  
**Your Measurement ID:** `G-XXXXXXXXXX` (add to `.env.local`)  
**Environment Variable:** `NEXT_PUBLIC_GA_ID`  
**Code Location:** Already integrated in `src/app/layout.tsx` ✅

---

## Need Help?

- **Google Analytics Help:** https://support.google.com/analytics
- **Google Analytics Academy:** https://analytics.google.com/analytics/academy/
- **Contact Support:** Use the contact form on your website

---

**Status:** Once you add your Measurement ID to `.env.local` and restart the server, Google Analytics will start tracking immediately! 🎉
