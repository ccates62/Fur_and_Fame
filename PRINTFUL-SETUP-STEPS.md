# 🎨 Printful Integration Setup - Step by Step Guide

Complete guide to get Printful working for automatic order fulfillment.

---

## ✅ Prerequisites Checklist

- [ ] Printful account created
- [ ] Printful API key generated
- [ ] `PRINTFUL_API_KEY` added to `.env.local`
- [ ] Products set up in Printful dashboard
- [ ] Product IDs and Variant IDs collected
- [ ] Product mapping updated in code
- [ ] Webhook configured to create orders

---

## Step 1: Get Your Printful API Key

1. Go to [Printful Dashboard](https://www.printful.com/dashboard)
2. Navigate to **Stores** → Select your store
3. Go to **API** section (or **Settings** → **API**)
4. Click **Generate API key** or **Create API key**
5. Copy the key (it looks like: `BHDDF5JNfcukUvV5DzgpwH52eWDk5tvwCPPFLLbc`)

### Add to Environment Variables

1. Open `.env.local` in your project root
2. Add or update:
   ```
   PRINTFUL_API_KEY=your_api_key_here
   ```
3. Save the file
4. **Restart your dev server** (`npm run dev`)

---

## Step 2: Set Up Products in Printful Dashboard

For each product you want to sell (Canvas, Mug, T-Shirt, etc.):

### Option A: Use Product Templates (Recommended)

1. Go to **Dashboard** → **Product Templates**
2. Click **Add product**
3. Select product category:
   - **Canvas prints** → Choose size (12x12, 16x20, etc.)
   - **Mugs** → Choose size (11oz, 15oz)
   - **T-Shirts** → Choose style and size
   - **Throw Blankets** → Choose size
   - **Posters** → Choose size
4. Upload a placeholder design (you'll replace with customer portraits via API)
5. Click **Save** or **Add to store**

### Option B: Use Catalog Products

1. Go to **Dashboard** → **Products**
2. Browse catalog and add products to your store
3. Configure variants (sizes, colors, etc.)

---

## Step 3: Find Your Product IDs and Variant IDs

You need these IDs to map your products in the code.

### Method 1: From Product URL (Easiest)

1. Go to **Dashboard** → **Products**
2. Click on a product to open it
3. Check the URL: `https://www.printful.com/dashboard/products/PRODUCT_ID`
   - The number in the URL is your `productId`
4. Click on a variant (size/color)
5. Check the browser console (F12) or network tab when loading variants
6. Look for API responses containing `variant_id` or check the variant URL

### Method 2: Use Printful API

1. Open browser console (F12)
2. Go to **Network** tab
3. Navigate to a product in Printful dashboard
4. Look for API calls to `/products` or `/variants`
5. Check the response JSON for `id` fields

### Method 3: Use API Explorer

1. Go to [Printful API Docs](https://developers.printful.com/)
2. Use the API explorer to call:
   - `GET /store/products` - Lists all products
   - `GET /products/{productId}` - Get product details with variants

**Example API call:**
```bash
curl -X GET "https://api.printful.com/store/products" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## Step 4: Update Product Mapping in Code

1. Open `src/lib/printful-client.ts`
2. Find the `PRINTFUL_PRODUCT_MAP` object (around line 12)
3. Replace the placeholder IDs with your actual IDs:

```typescript
export const PRINTFUL_PRODUCT_MAP: Record<string, { productId: number; variantId: number }> = {
  "canvas-12x12": {
    productId: 123, // ← Replace with your actual Canvas 12x12 product ID
    variantId: 456, // ← Replace with your actual Canvas 12x12 variant ID
  },
  "canvas-16x20": {
    productId: 124, // ← Replace with your actual Canvas 16x20 product ID
    variantId: 457, // ← Replace with your actual Canvas 16x20 variant ID
  },
  "mug": {
    productId: 125, // ← Replace with your actual Mug product ID
    variantId: 4011, // ← Replace with your actual Mug variant ID (e.g., 11oz mug)
  },
  "blanket": {
    productId: 126, // ← Replace with your actual Throw Blanket product ID
    variantId: 458, // ← Replace with your actual Throw Blanket variant ID
  },
  "t-shirt": {
    productId: 127, // ← Replace with your actual T-Shirt product ID
    variantId: 4011, // ← Replace with your actual T-Shirt variant ID
  },
  "poster": {
    productId: 128, // ← Replace with your actual Poster product ID
    variantId: 459, // ← Replace with your actual Poster variant ID
  },
};
```

4. Save the file

---

## Step 5: Test Mockup Generation

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to your checkout page with a selected variant (e.g., `/checkout`)

3. Check the browser console (F12) for:
   - ✅ Success: Mockup URLs loading
   - ❌ Errors: Check API key and product IDs

4. Check network requests:
   - Open **Network** tab in browser dev tools
   - Look for requests to `/api/printful-mockup`
   - Verify responses are successful

### Troubleshooting Mockups

**If mockups don't generate:**
- ✅ Verify `PRINTFUL_API_KEY` is in `.env.local` and server restarted
- ✅ Check product IDs and variant IDs are correct
- ✅ Verify the image URL is accessible (not behind authentication)
- ✅ Check browser console for specific error messages

**If you get "Product not found":**
- ✅ Double-check productId and variantId in `PRINTFUL_PRODUCT_MAP`
- ✅ Verify products exist in your Printful store
- ✅ Make sure you're using the correct store's API key

**If mockups are slow:**
- ✅ The API method can take 5-10 seconds
- ✅ The direct URL method is faster but may not work for all products
- ✅ Consider caching mockup URLs

---

## Step 6: Configure Webhook for Order Creation

The webhook automatically creates Printful orders when customers complete checkout.

### Update Stripe Webhook

The webhook at `src/app/api/stripe/webhook/route.ts` needs to:
1. Extract order data from Stripe checkout session
2. Get customer shipping address
3. Map product to Printful variant
4. Create Printful order with customer's portrait image

**The webhook is already set up to track sales. You need to add Printful order creation.**

### Test Webhook Locally (Optional)

1. Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

2. Trigger a test payment
3. Check server logs for Printful order creation

---

## Step 7: Verify Order Creation Flow

When a customer completes checkout:

1. ✅ Stripe webhook receives `checkout.session.completed` event
2. ✅ Webhook extracts:
   - Customer shipping address
   - Product ID and variant image URL
   - Order metadata
3. ✅ Webhook calls `createPrintfulOrder()` with:
   - Recipient (shipping address)
   - Items (variant_id + portrait image URL)
   - External ID (Stripe order ID)
4. ✅ Printful creates order and starts fulfillment
5. ✅ Printful sends shipping notification (if webhook configured)

---

## Quick Reference: Common Printful Product Types

| Product | Category | Common Variants |
|---------|----------|-----------------|
| Canvas Print | Canvas | 12x12, 16x20, 20x30 |
| Mug | Mugs | 11oz, 15oz |
| T-Shirt | Apparel → T-Shirts | S, M, L, XL, XXL |
| Throw Blanket | Home & Living → Blankets | 50x60, 60x80 |
| Poster | Posters | 12x18, 18x24, 24x36 |

---

## Common Issues & Solutions

### Issue: "PRINTFUL_API_KEY not configured"
**Solution:** 
- Add key to `.env.local`
- Restart dev server
- Verify key is correct (no extra spaces)

### Issue: "No Printful mapping found for product"
**Solution:**
- Check `PRINTFUL_PRODUCT_MAP` includes your product ID
- Verify product ID matches what's in Printful dashboard

### Issue: "Printful order API error: 400"
**Solution:**
- Check shipping address format (country_code should be 2 letters: "US", "CA", etc.)
- Verify variant_id exists in your Printful store
- Check image URL is publicly accessible

### Issue: "Printful order API error: 401"
**Solution:**
- API key is invalid or expired
- Regenerate API key in Printful dashboard
- Update `.env.local` and restart server

---

## Next Steps

Once everything is working:

1. ✅ Test a real order (use Stripe test mode first)
2. ✅ Verify Printful receives the order
3. ✅ Check Printful dashboard for order status
4. ✅ Set up Printful webhooks for shipping notifications (optional)
5. ✅ Configure email notifications via Resend (optional)

---

## Need Help?

- [Printful API Docs](https://developers.printful.com/)
- [Printful Dashboard](https://www.printful.com/dashboard)
- Check server logs for detailed error messages
- Check browser console for frontend errors


