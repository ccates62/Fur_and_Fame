# 🎨 Printful Integration - Start Here!

**You already have your Printful API key!** ✅

Choose the guide that works best for you:

---

## 📚 Which Guide Should I Use?

### 🚀 **Quick Start** (5 minutes)
**Use this if:** You want the fastest setup possible
- **File:** `PRINTFUL-QUICK-START.md`
- Just the essentials, no fluff

### ✅ **Visual Checklist** (Recommended!)
**Use this if:** You like checking things off as you go
- **File:** `PRINTFUL-CHECKLIST.md`
- Print it out or keep it open while you work
- Checkboxes for each step

### 📖 **Simple Step-by-Step** (Most Detailed)
**Use this if:** You want clear explanations for each step
- **File:** `PRINTFUL-SIMPLE-SETUP.md`
- Detailed instructions with troubleshooting

### 📋 **Quick Checklist** (Reference)
**Use this if:** You just need a reminder
- **File:** `PRINTFUL-QUICK-CHECKLIST.md`
- Minimal checklist format

### 📘 **Full Detailed Guide** (Complete Reference)
**Use this if:** You need comprehensive documentation
- **File:** `PRINTFUL-SETUP-STEPS.md`
- Everything you could possibly need

---

## 🛠️ Helper Tools

### List Your Products Automatically
**Run this command to see all your Printful products and their IDs:**
```bash
npm run printful:list-products
```

This will show you:
- All products in your Printful store
- Product IDs
- Variant IDs
- Everything you need to update the code!

---

## ⚡ Super Quick Setup (TL;DR)

1. **Add API key to `.env.local`:**
   ```env
   PRINTFUL_API_KEY=your_key_here
   ```

2. **Create products in Printful Dashboard**

3. **Get IDs:**
   ```bash
   npm run printful:list-products
   ```

4. **Update `src/lib/printful-client.ts` with your IDs**

5. **Test it!** Go to `/checkout` and select a product

---

## 📁 File Guide

| File | Purpose | When to Use |
|------|---------|-------------|
| `PRINTFUL-QUICK-START.md` | Fastest setup | You're in a hurry |
| `PRINTFUL-CHECKLIST.md` | Visual checklist | You like checkboxes |
| `PRINTFUL-SIMPLE-SETUP.md` | Detailed steps | You want explanations |
| `PRINTFUL-QUICK-CHECKLIST.md` | Minimal checklist | Quick reference |
| `PRINTFUL-SETUP-STEPS.md` | Complete guide | Full documentation |

---

## 🎯 What You Need

- ✅ Printful API key (you have this!)
- ✅ Products created in Printful Dashboard
- ✅ Product IDs and Variant IDs
- ✅ Updated code mapping

---

## 🆘 Need Help?

1. **Check the troubleshooting section** in `PRINTFUL-SIMPLE-SETUP.md`
2. **Run the helper script:** `npm run printful:list-products`
3. **Check Printful API docs:** https://developers.printful.com/
4. **Check server logs** for error messages

---

**Ready to start?** Pick a guide above and let's go! 🚀


