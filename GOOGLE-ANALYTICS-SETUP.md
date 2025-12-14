# Google Analytics Setup Guide

## Overview
Google Analytics has been integrated into your website to track visitor behavior, conversions, and website performance.

## Setup Instructions

### Step 1: Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account (or create one)
3. Click "Start measuring"
4. Create an account for "Fur and Fame" or "Timberline Collective LLC"
5. Set up a property for your website (www.furandfame.com)

### Step 2: Get Your Measurement ID
1. In Google Analytics, go to **Admin** (gear icon)
2. Under **Property**, click **Data Streams**
3. Click on your web stream (or create one if needed)
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 3: Add to Environment Variables
1. Open your `.env.local` file
2. Add the following line:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
   Replace `G-XXXXXXXXXX` with your actual Measurement ID

3. Save the file and restart your development server:
   ```bash
   npm run dev
   ```

### Step 4: Verify It's Working
1. Visit your website
2. Open Google Analytics dashboard
3. Go to **Reports** → **Realtime**
4. You should see your visit appear within a few seconds

## What's Being Tracked

The current setup tracks:
- Page views
- User sessions
- Traffic sources
- Device and browser information
- Geographic location

## Advanced Tracking (Optional)

To track specific events (like button clicks, form submissions, purchases), you can add custom event tracking. Contact support if you need help setting up conversion tracking for:
- Portrait generation completions
- Checkout conversions
- Button clicks
- Form submissions

## Privacy Considerations

- Google Analytics uses cookies to track users
- Make sure your Privacy Policy mentions Google Analytics (already included)
- Consider implementing cookie consent if required in your jurisdiction
- You can configure Google Analytics to anonymize IP addresses in the GA dashboard

## Troubleshooting

**Analytics not showing data:**
- Verify `NEXT_PUBLIC_GA_ID` is set correctly in `.env.local`
- Make sure you restarted the server after adding the variable
- Check browser console for any errors
- Verify the Measurement ID format is correct (starts with `G-`)

**Data not appearing in real-time:**
- Wait a few minutes (there can be a delay)
- Make sure you're looking at the correct property in GA
- Check that ad blockers aren't blocking the tracking script

## Next Steps

1. Set up conversion goals in Google Analytics
2. Link Google Analytics to Google Search Console
3. Set up custom events for key actions (portrait generation, purchases)
4. Configure e-commerce tracking for Stripe transactions

---

**Note:** The Google Analytics code is already integrated in `src/app/layout.tsx`. You just need to add your Measurement ID to `.env.local`.
