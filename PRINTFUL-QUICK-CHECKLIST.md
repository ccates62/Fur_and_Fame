# 🎨 Printful Integration - Quick Checklist

## ✅ Step-by-Step Checklist

### 1. API Key Setup (5 minutes)
- [ ] Go to [Printful Dashboard](https://www.printful.com/dashboard) → Stores → API
- [ ] Generate/Copy API key
- [ ] Add to `.env.local`: `PRINTFUL_API_KEY=your_key_here`
- [ ] Restart dev server: `npm run dev`

### 2. Set Up Products in Printful (15-30 minutes)
- [ ] Go to Dashboard → Product Templates
- [ ] Add Canvas 12x12 → Note Product ID and Variant ID
- [ ] Add Canvas 16x20 → Note Product ID and Variant ID
- [ ] Add Mug (11oz) → Note Product ID and Variant ID
- [ ] Add other products as needed (T-Shirt, Blanket, Poster)

**How to find IDs:**
- Check product URL: `https://www.printful.com/dashboard/products/PRODUCT_ID`
- Or use browser console/network tab when viewing variants

### 3. Update Code Mapping (5 minutes)
- [ ] Open `src/lib/printful-client.ts`
- [ ] Find `PRINTFUL_PRODUCT_MAP` (line ~12)
- [ ] Replace placeholder IDs with your actual IDs:

```typescript
"canvas-12x12": {
  productId: YOUR_ACTUAL_ID,  // ← Replace this
  variantId: YOUR_ACTUAL_ID,  // ← Replace this
},
```

### 4. Test Mockups (5 minutes)
- [ ] Go to `/checkout` page
- [ ] Select a product and variant
- [ ] Check browser console for errors
- [ ] Verify mockup images load

### 5. Test Order Creation (10 minutes)
- [ ] Make a test purchase (use Stripe test mode)
- [ ] Check server logs for Printful order creation
- [ ] Verify order appears in Printful Dashboard → Orders

---

## 🚀 What's Already Done

✅ Printful client functions added (`createPrintfulOrder`)  
✅ Webhook updated to create Printful orders automatically  
✅ Checkout session collects shipping addresses  
✅ Bundle products supported (canvas + mug)  

---

## 📋 Current Product Mapping

Update these IDs in `src/lib/printful-client.ts`:

| Product | Current productId | Current variantId | Status |
|---------|-------------------|-------------------|--------|
| canvas-12x12 | `1` (placeholder) | `1` (placeholder) | ⚠️ Needs update |
| canvas-16x20 | `2` (placeholder) | `2` (placeholder) | ⚠️ Needs update |
| mug | `5` (placeholder) | `4011` (placeholder) | ⚠️ Needs update |
| blanket | `99` (placeholder) | `1` (placeholder) | ⚠️ Needs update |
| t-shirt | `71` (placeholder) | `4011` (placeholder) | ⚠️ Needs update |
| poster | `6` (placeholder) | `1` (placeholder) | ⚠️ Needs update |

---

## 🔍 Troubleshooting

**Mockups not loading?**
- Check `.env.local` has `PRINTFUL_API_KEY`
- Restart dev server
- Verify product IDs are correct

**Orders not creating?**
- Check webhook is receiving events (check server logs)
- Verify shipping address is collected in checkout
- Check Printful API key is valid

**Need more help?**
- See full guide: `PRINTFUL-SETUP-STEPS.md`
- [Printful API Docs](https://developers.printful.com/)


