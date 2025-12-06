# 🤖 fal.ai API Balance Monitoring - Setup Guide

## ✅ What's Already Done

1. **API Route Created**: `src/app/api/fal/balance/route.ts`
   - Server-side proxy to fetch balance from fal.ai
   - Avoids CORS issues
   - Uses your `FAL_API_KEY` from `.env.local`

2. **HTML Dashboard Updated**: `open-accounts.html`
   - Now uses Next.js API route by default
   - Automatic balance fetching
   - Low balance alerts

## 🚀 How to Use

### Step 1: Start Next.js Dev Server

```bash
npm run dev
```

This starts your Next.js app on `http://localhost:3000`

### Step 2: Access the Dashboard

**Option A: Next.js Dashboard (Recommended)**
- Go to: `http://localhost:3000/accounts`
- Click "Fetch Balance Now" button
- Enable "Auto-Refresh" for automatic updates every 5 minutes

**Option B: Standalone HTML**
- Open `open-accounts.html` in your browser
- Make sure Next.js server is running
- Click "Fetch Balance Now"

### Step 3: Test the API Route

You can test the API directly:
```bash
curl http://localhost:3000/api/fal/balance
```

Or visit in browser: `http://localhost:3000/api/fal/balance`

## 📊 Features

- ✅ **Automatic Balance Fetching** - Get real-time balance from fal.ai
- ✅ **Daily Usage Tracking** - See your spending over time
- ✅ **Low Balance Alerts** - Get warned when balance is low
- ✅ **Usage History** - Track your spending history
- ✅ **Auto-Refresh** - Automatically update every 5 minutes

## 🔧 Troubleshooting

### "Failed to fetch" Error
- Make sure Next.js dev server is running: `npm run dev`
- Check that `FAL_API_KEY` is in `.env.local`
- Verify the API key is correct

### API Route Not Found
- Make sure the file exists: `src/app/api/fal/balance/route.ts`
- Restart the Next.js dev server
- Check for TypeScript errors

### Balance Shows $0.00
- The fal.ai API endpoint might be different
- Check fal.ai documentation for correct endpoint
- Update the endpoint in `route.ts` if needed

## 📝 Next Steps

1. **Test the API**: Run `npm run dev` and test the balance fetch
2. **Check Endpoint**: Verify the fal.ai API endpoint is correct
3. **Update if Needed**: Adjust the endpoint URLs in `route.ts` based on fal.ai docs

## 🔗 Files

- `src/app/api/fal/balance/route.ts` - API route for fetching balance
- `open-accounts.html` - HTML dashboard (uses Next.js API)
- `src/app/accounts/page.tsx` - Next.js dashboard (can add same features)

---

**Ready to test!** Start your dev server and try fetching your balance! 🚀

