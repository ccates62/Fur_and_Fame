# 🐙 GitHub Repository Setup Guide

## Quick Setup Options

### Option 1: Automated (Using GitHub CLI) ⚡

If you have GitHub CLI installed:

1. **Authenticate** (if not already):
   ```powershell
   gh auth login
   ```

2. **Run the script**:
   ```powershell
   .\create-github-repos.ps1
   ```

3. **Follow the prompts** - it will create all 8 repositories automatically!

### Option 2: Manual Creation 🌐

Create repositories one by one at: **https://github.com/new**

#### Repositories to Create:

1. **Fur_and_Fame**
   - Description: `AI Pet Portrait E-Commerce Platform - Main Project`
   - Visibility: Public or Private (your choice)

2. **fur-and-fame-api**
   - Description: `Backend API for Fur & Fame - Supabase integrations`
   - Visibility: Public or Private

3. **fur-and-fame-stripe**
   - Description: `Stripe payment integration and webhook handlers`
   - Visibility: Public or Private

4. **fur-and-fame-printful**
   - Description: `Printful API integration for order fulfillment`
   - Visibility: Public or Private

5. **fur-and-fame-ai**
   - Description: `fal.ai integration for AI portrait generation`
   - Visibility: Public or Private

6. **fur-and-fame-email**
   - Description: `Resend email templates and automation`
   - Visibility: Public or Private

7. **fur-and-fame-video**
   - Description: `Remotion video generation for TikTok ads`
   - Visibility: Public or Private

8. **fur-and-fame-docs**
   - Description: `Documentation and setup guides`
   - Visibility: Public (recommended for docs)

## After Creating Repositories

### Update Dashboard URLs

Once you have your GitHub username, update the URLs in:

1. **`open-accounts.html`** - Replace `yourusername` with your actual GitHub username
2. **`src/app/accounts/page.tsx`** - Replace `yourusername` with your actual GitHub username

### Quick Find & Replace

Search for: `https://github.com/yourusername/`  
Replace with: `https://github.com/YOUR-ACTUAL-USERNAME/`

## Installing GitHub CLI (Optional)

If you want to use the automated script:

1. **Download**: https://cli.github.com/
2. **Install** the Windows installer
3. **Authenticate**: Run `gh auth login` in PowerShell
4. **Run the script**: `.\create-github-repos.ps1`

## Benefits of GitHub CLI

- ✅ Create multiple repos quickly
- ✅ Set descriptions automatically
- ✅ Choose public/private easily
- ✅ All from command line

## Manual Steps (If Not Using CLI)

1. Go to https://github.com/new
2. For each repository:
   - Enter the repository name
   - Add the description
   - Choose visibility
   - Click "Create repository"
3. Repeat for all 8 repositories

---

**Tip**: You can create them all in one browser session - just open each link in a new tab!

