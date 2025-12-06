# 🐾 Accounts Dashboard - Quick Setup Guide

## What I've Created For You

1. **Next.js Dashboard** (`/accounts` route) - Accessible when running your Next.js app
2. **Standalone HTML File** (`open-accounts.html`) - Can be opened directly in any browser
3. **Desktop Shortcuts** - Quick access icons on your desktop
4. **Payment Monitoring** - Track recurring payments and subscriptions

---

## 🚀 How to Use

### Option 1: Standalone HTML Dashboard (Easiest)

1. **Double-click** `open-accounts.html` in your project folder
   - OR double-click `open-accounts.bat` 
   - This opens the dashboard in your default browser
   - No server needed - works offline!

2. **Create Desktop Shortcut:**
   - Right-click `open-accounts.html`
   - Select "Create shortcut"
   - Drag the shortcut to your Desktop
   - Rename it to "Fur & Fame Accounts"

### Option 2: Next.js Dashboard (When Dev Server is Running)

1. Start your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Open in browser:
   ```
   http://localhost:3000/accounts
   ```

### Option 3: Create Desktop Shortcuts Automatically

1. **Run the PowerShell script:**
   ```powershell
   .\create-desktop-shortcuts.ps1
   ```

2. This will create shortcuts on your Desktop for:
   - Fur & Fame Accounts (HTML dashboard)
   - Supabase Dashboard
   - Stripe Dashboard
   - Vercel Dashboard
   - fal.ai Dashboard
   - Printful Dashboard
   - Resend Dashboard

---

## 💰 Payment Monitoring Features

The dashboard includes:

- **Monthly Recurring Costs** - See total monthly expenses
- **Active Services Count** - Track how many services are set up
- **Payment Table** - View all services with:
  - Plan details
  - Amount and frequency
  - Next due date
  - Status (Active/Pending/Expired)

### To Update Payment Information:

1. **For HTML version:** Edit `open-accounts.html` and update the payment table
2. **For Next.js version:** Edit `src/app/accounts/page.tsx` and update the `payments` array

---

## 📝 Customizing Payment Plans

### In HTML File (`open-accounts.html`):
Find the payment table and update the rows:
```html
<tr>
    <td><strong>Service Name</strong></td>
    <td>Plan Name</td>
    <td>$Amount</td>
    <td>Monthly/Yearly/One-time</td>
    <td>2025-01-06</td>
    <td><span class="status-badge status-active">Active</span></td>
</tr>
```

### In Next.js (`src/app/accounts/page.tsx`):
Update the `payments` state array:
```typescript
{
  service: "Service Name",
  plan: "Plan Name",
  amount: 25,
  frequency: "monthly", // or "yearly" or "one-time"
  nextDue: "2025-01-06",
  status: "active", // or "expired" or "pending"
}
```

---

## 🎨 Features

✅ **One-Click Access** - Direct links to all service dashboards  
✅ **Payment Tracking** - Monitor recurring costs  
✅ **API Key Status** - See which keys are configured  
✅ **Status Indicators** - Visual completion status  
✅ **Copy to Clipboard** - Easy key copying (Next.js version)  
✅ **Responsive Design** - Works on desktop and mobile  

---

## 🔄 Updating API Keys

When you get new API keys:

1. **Update `.env.local`** with the new keys
2. **Update the dashboard** to reflect the new status:
   - HTML: Edit `open-accounts.html`
   - Next.js: Edit `src/app/accounts/page.tsx`

---

## 💡 Tips

- **Bookmark the HTML file** in your browser for quick access
- **Pin to taskbar** - Right-click the HTML file → Pin to taskbar
- **Set as homepage** - Use the HTML file as your browser homepage
- **Update monthly** - Review payment due dates monthly

---

## 🆘 Troubleshooting

**Shortcuts not working?**
- Make sure you run the PowerShell script as Administrator
- Or manually create shortcuts by right-clicking files

**HTML file won't open?**
- Right-click → Open with → Choose your browser
- Or use `open-accounts.bat` instead

**Next.js dashboard not loading?**
- Make sure dev server is running: `npm run dev`
- Check that you're accessing `/accounts` route

---

Enjoy your new accounts dashboard! 🎉

