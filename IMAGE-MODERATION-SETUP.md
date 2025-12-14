# Image Content Moderation Setup Guide

## Overview

To protect your business from legal issues, you need to implement image content moderation that detects:
- Explicit content (nudity, sexual content)
- Violence
- Hate speech symbols
- Inappropriate gestures (middle finger, etc.)
- Other offensive content

## Recommended Solution: Google Cloud Vision API

Google Cloud Vision API provides a `safeSearch` feature that detects:
- Adult content
- Violence
- Racy content
- Medical content
- Spoof content

### Step 1: Set Up Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or use existing)
3. **Enable Vision API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Cloud Vision API"
   - Click "Enable"

### Step 2: Create Service Account

1. **Go to "IAM & Admin" → "Service Accounts"**
2. **Click "Create Service Account"**
3. **Name it** (e.g., "fur-and-fame-vision")
4. **Grant role**: "Cloud Vision API User"
5. **Create and download JSON key**
6. **Save the JSON file securely** (add to `.gitignore`)

### Step 3: Install Dependencies

```bash
npm install @google-cloud/vision
```

### Step 4: Add Environment Variables

Add to your `.env.local`:

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_VISION_KEY_PATH=./path/to/service-account-key.json
# OR use base64 encoded key
GOOGLE_CLOUD_VISION_KEY_BASE64=your-base64-encoded-key
```

### Step 5: Create Image Moderation Utility

Create `src/lib/image-moderation.ts`:

```typescript
import { ImageAnnotatorClient } from "@google-cloud/vision";

let client: ImageAnnotatorClient | null = null;

function getClient(): ImageAnnotatorClient | null {
  if (client) return client;

  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const keyPath = process.env.GOOGLE_CLOUD_VISION_KEY_PATH;
    const keyBase64 = process.env.GOOGLE_CLOUD_VISION_KEY_BASE64;

    if (!projectId) {
      console.warn("Google Cloud Vision not configured: GOOGLE_CLOUD_PROJECT_ID missing");
      return null;
    }

    let credentials;
    if (keyBase64) {
      credentials = JSON.parse(Buffer.from(keyBase64, "base64").toString());
    } else if (keyPath) {
      credentials = require(keyPath);
    } else {
      console.warn("Google Cloud Vision not configured: No credentials provided");
      return null;
    }

    client = new ImageAnnotatorClient({
      projectId,
      credentials,
    });

    return client;
  } catch (error) {
    console.error("Error initializing Google Cloud Vision:", error);
    return null;
  }
}

export interface ModerationResult {
  isSafe: boolean;
  reasons: string[];
  adult: "UNKNOWN" | "VERY_UNLIKELY" | "UNLIKELY" | "POSSIBLE" | "LIKELY" | "VERY_LIKELY";
  violence: "UNKNOWN" | "VERY_UNLIKELY" | "UNLIKELY" | "POSSIBLE" | "LIKELY" | "VERY_LIKELY";
  racy: "UNKNOWN" | "VERY_UNLIKELY" | "UNLIKELY" | "POSSIBLE" | "LIKELY" | "VERY_LIKELY";
}

/**
 * Moderate image using Google Cloud Vision API
 * @param imageBuffer - Image file as Buffer
 * @returns Moderation result
 */
export async function moderateImage(imageBuffer: Buffer): Promise<ModerationResult> {
  const visionClient = getClient();

  if (!visionClient) {
    // If Vision API not configured, allow image (for development)
    console.warn("Google Cloud Vision not configured - allowing image");
    return {
      isSafe: true,
      reasons: [],
      adult: "VERY_UNLIKELY",
      violence: "VERY_UNLIKELY",
      racy: "VERY_UNLIKELY",
    };
  }

  try {
    const [result] = await visionClient.safeSearchDetection({
      image: { content: imageBuffer },
    });

    const safeSearch = result.safeSearchAnnotation;
    if (!safeSearch) {
      return {
        isSafe: true,
        reasons: [],
        adult: "VERY_UNLIKELY",
        violence: "VERY_UNLIKELY",
        racy: "VERY_UNLIKELY",
      };
    }

    const reasons: string[] = [];
    let isSafe = true;

    // Check for adult content
    if (
      safeSearch.adult === "LIKELY" ||
      safeSearch.adult === "VERY_LIKELY"
    ) {
      isSafe = false;
      reasons.push("Adult content detected");
    }

    // Check for violence
    if (
      safeSearch.violence === "LIKELY" ||
      safeSearch.violence === "VERY_LIKELY"
    ) {
      isSafe = false;
      reasons.push("Violence detected");
    }

    // Check for racy content
    if (
      safeSearch.racy === "LIKELY" ||
      safeSearch.racy === "VERY_LIKELY"
    ) {
      isSafe = false;
      reasons.push("Racy content detected");
    }

    return {
      isSafe,
      reasons,
      adult: safeSearch.adult || "UNKNOWN",
      violence: safeSearch.violence || "UNKNOWN",
      racy: safeSearch.racy || "UNKNOWN",
    };
  } catch (error: any) {
    console.error("Error moderating image:", error);
    // On error, reject image for safety
    return {
      isSafe: false,
      reasons: ["Error processing image"],
      adult: "UNKNOWN",
      violence: "UNKNOWN",
      racy: "UNKNOWN",
    };
  }
}

/**
 * Moderate image from URL
 */
export async function moderateImageFromUrl(imageUrl: string): Promise<ModerationResult> {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return await moderateImage(buffer);
  } catch (error: any) {
    console.error("Error fetching image for moderation:", error);
    return {
      isSafe: false,
      reasons: ["Error fetching image"],
      adult: "UNKNOWN",
      violence: "UNKNOWN",
      racy: "UNKNOWN",
    };
  }
}
```

### Step 6: Integrate into Upload Route

Update `src/app/api/upload/route.ts`:

```typescript
import { moderateImage } from "@/lib/image-moderation";

// After file validation, before processing:
const arrayBuffer = await file.arrayBuffer();
const imageBuffer = Buffer.from(arrayBuffer);

// Moderate image
const moderationResult = await moderateImage(imageBuffer);

if (!moderationResult.isSafe) {
  return NextResponse.json(
    {
      error: "Image rejected",
      message: `Image contains inappropriate content: ${moderationResult.reasons.join(", ")}`,
      reasons: moderationResult.reasons,
    },
    { status: 400 }
  );
}
```

## Alternative Solutions

### Option 2: AWS Rekognition

- Similar to Google Cloud Vision
- Uses `DetectModerationLabels` API
- Pricing: ~$1.00 per 1,000 images

### Option 3: Azure Content Moderator

- Microsoft's solution
- Good for explicit content detection
- Pricing: Pay-as-you-go

### Option 4: Cloudinary Moderation

- Built into Cloudinary image hosting
- Automatic moderation on upload
- Pricing: Included in paid plans

## Cost Estimates

**Google Cloud Vision API:**
- First 1,000 images/month: FREE
- After that: $1.50 per 1,000 images
- Safe Search Detection: Included in standard pricing

**Estimated monthly cost** (assuming 1,000 uploads/month):
- Free tier covers first 1,000
- Additional: ~$0-1.50/month

## Testing

1. Test with safe images (should pass)
2. Test with explicit content (should reject)
3. Test with edge cases (should handle gracefully)

## Production Checklist

- [ ] Google Cloud project created
- [ ] Vision API enabled
- [ ] Service account created and key downloaded
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Image moderation integrated
- [ ] Tested with various image types
- [ ] Error handling implemented
- [ ] Logging configured

## Notes

- Always reject images on error (fail-safe)
- Log moderation results for auditing
- Consider caching results for same images
- Monitor API usage and costs
- Set up billing alerts in Google Cloud
