# 🎨 Printful Setup - Simple Step-by-Step Guide

**You already have your Printful API key!** ✅  
Let's get everything connected in 3 easy steps.

---

## 📋 Quick Overview

1. ✅ **Add API key to `.env.local`** (2 minutes)
2. ✅ **Set up products in Printful** (10-15 minutes)
3. ✅ **Update product IDs in code** (5 minutes)

---

## Step 1: Add Your API Key to `.env.local` ✅

**You said you already have your Printful API key!**

1. **Open `.env.local`** in your project root
   - If it doesn't exist, create it

2. **Add this line:**
   ```env
   PRINTFUL_API_KEY=your_actual_api_key_here
   ```
   Replace `your_actual_api_key_here` with your real key (it looks like: `BHDDF5JNfcukUvV5DzgpwH52eWDk5tvwCPPFLLbc`)

3. **Save the file**

4. **Restart your dev server:**
   ```bash
   # Stop current server (Ctrl+C), then:
   npm run dev
   ```

✅ **Done with Step 1!** Move to Step 2.

---

## Step 2: Set Up Products in Printful Dashboard

You need to create products in Printful for each item you want to sell.

### For Each Product (Canvas, Mug, etc.):

1. **Go to [Printful Dashboard](https://www.printful.com/dashboard)**

2. **Click "Product Templates"** (or "Add Product")

3. **Choose your product type:**
   - **Canvas Print** → Select size (12x12, 16x20, etc.)
   - **Mug** → Select size (11oz, 15oz)
   - **T-Shirt** → Select style and size
   - **Throw Blanket** → Select size
   - **Poster** → Select size

4. **Upload a placeholder image** (any image - we'll replace it with customer portraits via API)

5. **Click "Save" or "Add to Store"**

6. **IMPORTANT: Write down the Product ID and Variant ID!**
   - See **Step 3** below for how to find these

### Products You Need to Set Up:

- [ ] **Canvas 12x12** (Product ID: _____, Variant ID: _____)
- [ ] **Canvas 16x20** (Product ID: _____, Variant ID: _____)
- [ ] **Mug 11oz** (Product ID: _____, Variant ID: _____)
- [ ] **Other products** (if you want them)

✅ **Done with Step 2!** Move to Step 3.

---

## Step 3: Find Your Product IDs and Variant IDs

**You need these numbers to connect your products to the code.**

### Easy Method: Use the Helper Script

I've created a helper script that will fetch all your products from Printful!

1. **Make sure your API key is in `.env.local`** (from Step 1)

2. **Run the helper script:**
   ```bash
   npm run printful:list-products
   ```

3. **The script will show you all your products with their IDs!**

   You'll see output like:
   ```
   ✅ Found products:
   
   Canvas Print 12x12
   - Product ID: 123
   - Variant ID: 456
   
   Mug 11oz
   - Product ID: 125
   - Variant ID: 4011
   ```

4. **Copy the Product ID and Variant ID for each product**

### Manual Method (if script doesn't work):

1. **Go to Printful Dashboard → Products**

2. **Click on a product**

3. **Check the URL:**
   - URL looks like: `https://www.printful.com/dashboard/products/123`
   - The number `123` is your **Product ID**

4. **To find Variant ID:**
   - Click on a specific variant (size/color)
   - Open browser console (F12) → Network tab
   - Look for API calls - the response will have `variant_id`

✅ **Done with Step 3!** Move to Step 4.

---

## Step 4: Update Product IDs in Code

Now we'll connect your Printful products to the code.

1. **Open `src/lib/printful-client.ts`**

2. **Find the `PRINTFUL_PRODUCT_MAP` section** (around line 12)

3. **Replace the placeholder numbers with your actual IDs:**

   ```typescript
   export const PRINTFUL_PRODUCT_MAP: Record<string, { productId: number; variantId: number }> = {
     "canvas-12x12": {
       productId: 123,  // ← Replace with YOUR Canvas 12x12 Product ID
       variantId: 456,  // ← Replace with YOUR Canvas 12x12 Variant ID
     },
     "canvas-16x20": {
       productId: 124,  // ← Replace with YOUR Canvas 16x20 Product ID
       variantId: 457,  // ← Replace with YOUR Canvas 16x20 Variant ID
     },
     "mug": {
       productId: 125,  // ← Replace with YOUR Mug Product ID
       variantId: 4011, // ← Replace with YOUR Mug Variant ID
     },
     // ... etc
   };
   ```

4. **Save the file**

✅ **Done with Step 4!** Move to Step 5.

---

## Step 5: Test It! 🧪

Let's make sure everything works.

### Test 1: Check API Key

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Check the console** - you should NOT see:
   - ❌ `⚠️ PRINTFUL_API_KEY not configured`

### Test 2: Test Mockups

1. **Go to your checkout page** (e.g., `http://localhost:3000/checkout`)

2. **Select a product and variant**

3. **Check browser console (F12):**
   - ✅ Should see mockup images loading
   - ❌ If you see errors, check your product IDs in Step 4

### Test 3: Test Order Creation (Optional)

1. **Make a test purchase** (use Stripe test mode)

2. **Check server logs:**
   - ✅ Should see: `✅ Printful order created:`
   - ❌ If you see errors, check your product mapping

3. **Check Printful Dashboard → Orders:**
   - ✅ Should see a new order appear

---

## ✅ You're Done!

Your Printful integration is now set up! 🎉

**What happens now:**
- When customers buy products, orders automatically go to Printful
- Printful will print and ship the products
- You'll see orders in your Printful dashboard

---

## 🆘 Troubleshooting

### "PRINTFUL_API_KEY not configured"
- ✅ Check `.env.local` has the key
- ✅ Restart your dev server
- ✅ Make sure there are no extra spaces in the key

### "No Printful mapping found for product"
- ✅ Check `PRINTFUL_PRODUCT_MAP` in `src/lib/printful-client.ts`
- ✅ Make sure product IDs match what's in Printful dashboard

### "Printful order API error: 400"
- ✅ Check shipping address format (country_code should be "US", "CA", etc.)
- ✅ Verify variant_id exists in your Printful store
- ✅ Check image URL is publicly accessible

### "Printful order API error: 401"
- ✅ API key is invalid - check it's correct in `.env.local`
- ✅ Regenerate API key in Printful dashboard if needed

---

## 📚 Need More Help?

- **Full detailed guide:** See `PRINTFUL-SETUP-STEPS.md`
- **Quick checklist:** See `PRINTFUL-QUICK-CHECKLIST.md`
- **Printful API Docs:** https://developers.printful.com/
- **Printful Dashboard:** https://www.printful.com/dashboard

---

**Last Updated:** Ready to use! 🚀

