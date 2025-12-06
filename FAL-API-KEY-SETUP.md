# 🔑 fal.ai API Key Setup Guide

## Why You Need an API Key

Your fal.ai API key is used for:
- ✅ Generating AI pet portraits using Flux Pro
- ✅ Accessing fal.ai's Platform APIs
- ⚠️ **Note:** Balance information is NOT available via API (must be entered manually)

## 📋 Step-by-Step Setup

### Step 1: Log in to fal.ai
1. Go to [fal.ai Dashboard](https://fal.ai/dashboard)
2. Sign in with your GitHub account (or create an account)

### Step 2: Generate API Key
1. Navigate to [API Keys page](https://fal.ai/dashboard/keys)
2. Click **"Create API Key"** or **"Generate New Key"**
3. Give it a name (e.g., "Fur & Fame Production")
4. Select the appropriate scope:
   - **API Scope** - For most use cases (recommended)
   - **Admin Scope** - Only if you need sensitive data access
5. Click **"Create"** or **"Generate"**

### Step 3: Copy Your API Key
1. **Important:** Copy the ENTIRE key immediately
   - Keys are shown only once for security
   - Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
2. Store it securely (password manager recommended)

### Step 4: Add to Your Project
1. Open your project folder: `c:\Users\ccate\Fur_and_Fame`
2. Open or create `.env.local` file
3. Add your key:
   ```env
   FAL_API_KEY=your-api-key-here
   ```
4. Save the file

### Step 5: Restart Your Server
1. Stop your Next.js server (Ctrl+C)
2. Start it again: `npx next dev`
3. The API key will now be available to your app

## ✅ Verify Setup

Your API key should look like:
```
FAL_API_KEY=3c29bf78-1853-4485-9bfd-b02abf47b713:f6ab21b3c482877d0cfba50f534045a1
```

## 🔒 Security Best Practices

- ✅ **Never commit** `.env.local` to git (already in `.gitignore`)
- ✅ **Don't share** your API key publicly
- ✅ **Rotate keys** if you suspect it's been compromised
- ✅ **Use different keys** for development and production

## 💡 About Balance Tracking

**Important:** fal.ai doesn't provide a public API endpoint for account balance. 

To track your balance:
1. Check your balance at [fal.ai Billing](https://fal.ai/dashboard/billing)
2. Enter it manually in the dashboard
3. The dashboard will save it locally for tracking

## 🆘 Troubleshooting

### "FAL_API_KEY not configured" Error
- Make sure `.env.local` exists in your project root
- Verify the key is on a single line (no line breaks)
- Restart your Next.js server after adding the key

### API Key Not Working
- Verify you copied the entire key (both parts separated by `:`)
- Check that the key hasn't expired or been revoked
- Make sure you're using the correct scope (API vs Admin)

### Need Help?
- [fal.ai Documentation](https://docs.fal.ai)
- [fal.ai Discord Community](https://discord.gg)
- Check your dashboard: [fal.ai Dashboard](https://fal.ai/dashboard)

---

**Last Updated:** January 2025
