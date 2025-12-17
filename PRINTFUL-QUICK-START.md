# 🚀 Printful Quick Start - 5 Steps

**You have your API key already!** Let's connect everything in 5 minutes.

---

## ✅ Step 1: Add API Key (1 minute)

1. Open `.env.local` (create it if needed)
2. Add: `PRINTFUL_API_KEY=your_key_here`
3. Save and restart server: `npm run dev`

---

## ✅ Step 2: Create Products in Printful (5-10 minutes)

1. Go to [Printful Dashboard](https://www.printful.com/dashboard) → **Product Templates**
2. Add products:
   - Canvas 12x12
   - Canvas 16x20
   - Mug 11oz
   - (Any others you want)
3. Upload placeholder images (any image works)

---

## ✅ Step 3: Get Product IDs (1 minute)

**Run this command:**
```bash
npm run printful:list-products
```

**Copy the Product IDs and Variant IDs it shows you!**

---

## ✅ Step 4: Update Code (2 minutes)

1. Open `src/lib/printful-client.ts`
2. Find `PRINTFUL_PRODUCT_MAP` (line ~12)
3. Replace placeholder numbers with your IDs from Step 3
4. Save

---

## ✅ Step 5: Test (1 minute)

1. Go to `/checkout` page
2. Select a product
3. Check browser console (F12) - should see mockups loading ✅

---

## 🎉 Done!

Orders will now automatically go to Printful when customers buy!

---

**Need more details?** See `PRINTFUL-SIMPLE-SETUP.md`


