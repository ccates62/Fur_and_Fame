# Adding New Products Guide

## Required Steps for All New Products

When adding a new product to the Fur & Fame store, you **MUST** follow these steps to ensure correct aspect ratios and prevent image distortion.

### Step 1: Add Product Aspect Ratio Mapping

**File:** `src/lib/fal-client.ts`

Add your product to the `PRODUCT_ASPECT_RATIOS` mapping:

```typescript
export const PRODUCT_ASPECT_RATIOS: Record<string, string> = {
  // ... existing products ...
  
  // NEW PRODUCT - Add here
  "your-product-id": "aspect-ratio", // e.g., "1:1", "3:4", "4:5", "5:6"
};
```

**Common Aspect Ratios:**
- `1:1` - Square products (e.g., 12x12 canvas)
- `3:4` - Portrait orientation (most common)
- `4:5` - Slightly portrait (e.g., 16x20 canvas)
- `5:6` - Slightly portrait (e.g., 50x60 blanket)
- `16:9` - Landscape (rare for portraits)

**How to determine aspect ratio:**
1. Get product dimensions from Printful (e.g., 37" × 57")
2. Calculate ratio: 37/57 ≈ 0.65
3. Find closest match: 0.65 is closest to 3:4 (0.75)

### Step 2: Add Product to Printful Product Map

**File:** `src/lib/printful-client.ts`

Add your product to `PRINTFUL_PRODUCT_MAP`:

```typescript
export const PRINTFUL_PRODUCT_MAP: Record<string, { productId: number; variantId: number | string }> = {
  // ... existing products ...
  
  "your-product-id": {
    productId: YOUR_PRINTFUL_PRODUCT_ID,
    variantId: YOUR_PRINTFUL_VARIANT_ID,
  },
};
```

### Step 3: Add Product to Checkout Page

**File:** `src/app/checkout/page.tsx`

Add your product to the `products` array:

```typescript
const products: Product[] = [
  // ... existing products ...
  
  {
    id: "your-product-id",
    name: "Your Product Name",
    description: "Product description",
    price: 49,
    icon: "🛏️",
  },
];
```

### Step 4: Update Product IDs in UploadForm

**File:** `src/components/UploadForm.tsx`

If you want images generated for this product upfront, add it to the `productIds` array:

```typescript
// Generate images for all available products to ensure correct aspect ratios
const productIds = ["canvas-12x12", "canvas-16x20", "your-product-id"];
```

**Note:** Only add products that are commonly purchased. Too many products = more API costs.

### Step 5: Test Product-Specific Generation

1. Upload a test photo
2. Generate variants
3. Select your new product on checkout
4. Verify the image uses the correct aspect ratio (no distortion)
5. Check browser console for: `🔄 Switching to product-specific variant for your-product-id (aspect ratio: X:Y)`

## Product Size Variants

If your product has multiple sizes (like canvas), you need to:

1. **Add each size variant** to `PRODUCT_ASPECT_RATIOS`:
   ```typescript
   "product-small": "3:4",
   "product-medium": "4:5",
   "product-large": "3:4",
   ```

2. **Add size options** to the product in checkout:
   ```typescript
   {
     id: "product",
     name: "Product Name",
     sizes: [
       { size: "Small", price: 29, variantKey: "product-small" },
       { size: "Medium", price: 49, variantKey: "product-medium" },
       { size: "Large", price: 69, variantKey: "product-large" },
     ],
   }
   ```

3. **Add all variants** to `PRINTFUL_PRODUCT_MAP`

## Checklist

- [ ] Added to `PRODUCT_ASPECT_RATIOS` in `fal-client.ts`
- [ ] Added to `PRINTFUL_PRODUCT_MAP` in `printful-client.ts`
- [ ] Added to `products` array in `checkout/page.tsx`
- [ ] Added to `productIds` in `UploadForm.tsx` (if generating upfront)
- [ ] Tested aspect ratio (no distortion)
- [ ] Verified Printful product ID and variant ID are correct
- [ ] Tested checkout flow end-to-end

## Example: Adding a Blanket Product

```typescript
// 1. fal-client.ts
"blanket-37x57": "3:4",
"blanket-50x60": "5:6",
"blanket-60x80": "3:4",

// 2. printful-client.ts
"blanket-37x57": {
  productId: 123456,
  variantId: "abc123",
},

// 3. checkout/page.tsx
{
  id: "blanket",
  name: "Throw Blanket",
  description: "Cozy blanket with your pet's portrait",
  price: 49,
  icon: "🛏️",
  sizes: [
    { size: "37×57", price: 39, variantKey: "blanket-37x57" },
    { size: "50×60", price: 49, variantKey: "blanket-50x60" },
    { size: "60×80", price: 59, variantKey: "blanket-60x80" },
  ],
}
```

## Important Notes

- **Aspect ratios are critical** - wrong ratio = distorted prints = refunds
- **Always test** with a real order before going live
- **Printful doesn't fix aspect ratios** - you must provide correct images
- **Multiple sizes** = multiple product IDs in the mapping
- **Cost consideration** - generating for all products upfront costs more API calls

