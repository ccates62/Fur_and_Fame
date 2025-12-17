# Printful Mockup Generator API Issue - Canvas Prints

## Problem
Unable to generate mockups for canvas prints using Printful's mockup generator API. All attempts result in validation errors.

## What We've Tried

### Attempt 1: `placement: "default"`
```json
{
  "variant_ids": [823],
  "format": "jpg",
  "width": 1000,
  "files": [
    {
      "placement": "default",
      "image_url": "https://..."
    }
  ]
}
```
**Error:** `"Position field is missing"`

### Attempt 2: `position: "default"`
```json
{
  "files": [
    {
      "position": "default",
      "image_url": "https://..."
    }
  ]
}
```
**Error:** `"Invalid file object specified"`

### Attempt 3: `position: "front"`
```json
{
  "files": [
    {
      "position": "front",
      "image_url": "https://..."
    }
  ]
}
```
**Error:** `"Invalid file object specified"`

### Attempt 4: `position: 0` (numeric)
```json
{
  "files": [
    {
      "position": 0,
      "image_url": "https://..."
    }
  ]
}
```
**Error:** `"Invalid file object specified"`

### Attempt 5: Both `placement` and `position`
```json
{
  "files": [
    {
      "placement": "default",
      "position": "default",
      "image_url": "https://..."
    }
  ]
}
```
**Error:** `"Position field is missing"` (even though we're sending it!)

## Product Details
- **Store Product ID:** 407686920
- **Catalog Product ID:** 3 (Canvas)
- **Variant IDs:**
  - 12x12: Catalog variant 823, Store variant external_id: `693f5603130014`
  - 16x20: Catalog variant 6, Store variant external_id: `693f56031300b7`

## API Endpoint
```
POST https://api.printful.com/mockup-generator/create-task/3
```

## Question for Printful Support
1. **Do canvas prints support the mockup generator API?** If not, what's the recommended approach?
2. **What is the correct file object structure for canvas prints?** The error messages are contradictory.
3. **Is there a different endpoint or method for generating canvas mockups?**

## Current Workaround
The application falls back to showing the original pet portrait image when mockup generation fails. This works but doesn't show the product mockup.

## Next Steps
1. Contact Printful support with this information
2. Consider using Printful's Custom Mockup Maker or Placeit integration as an alternative
3. Pre-generate mockup templates and overlay customer images client-side


