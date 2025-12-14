# 🧪 Image Moderation Testing Guide

## Quick Test Instructions

### Prerequisites
1. Ensure `FAL_API_KEY` is set in `.env.local`
2. Start your dev server: `npm run dev`
3. Navigate to `/create` page

---

## Test Cases

### ✅ Test 1: Safe Image (Should Pass)
1. **Upload a normal pet photo** (dog, cat, etc.)
2. **Expected Result:** Image uploads successfully
3. **Check Console:** Should see moderation check completed
4. **Status:** ✅ PASS

### ✅ Test 2: Safe Family Photo (Should Pass)
1. **Upload a normal family photo** (people, appropriate content)
2. **Expected Result:** Image uploads successfully
3. **Check Console:** Should see moderation check completed
4. **Status:** ✅ PASS

### ❌ Test 3: Explicit Content (Should Reject)
1. **Upload explicit/inappropriate image**
2. **Expected Result:** 
   - Error message: "Image rejected"
   - Message: "Image contains explicit or inappropriate content (NSFW)"
   - Status code: 400
3. **Check Console:** Should see NSFW detection
4. **Status:** ❌ REJECT (This is correct behavior!)

### ❌ Test 4: API Error Handling (Fail-Safe)
1. **Temporarily set wrong FAL_API_KEY** in `.env.local`
2. **Upload any image**
3. **Expected Result:** 
   - Image rejected (fail-safe behavior)
   - Error message about moderation failure
4. **Status:** ❌ REJECT (Fail-safe working correctly)

---

## Manual API Test

You can also test the API directly using curl or Postman:

```bash
# Test with a safe image (base64 encoded)
curl -X POST http://localhost:3000/api/upload \
  -F "file=@path/to/safe-image.jpg"

# Expected response for safe image:
{
  "success": true,
  "url": "data:image/jpeg;base64,...",
  "originalType": "image/jpeg",
  "originalFilename": "safe-image.jpg",
  "sanitizedFilename": "safe-image.jpg",
  "size": 123456,
  "message": "File uploaded successfully"
}

# Expected response for NSFW image:
{
  "error": "Image rejected",
  "message": "Image contains explicit or inappropriate content (NSFW)"
}
```

---

## Console Logs to Watch For

### Successful Moderation:
```
✅ Image moderation check passed
```

### NSFW Detected:
```
❌ Image contains explicit or inappropriate content (NSFW)
```

### API Error:
```
⚠️ fal.ai NSFW check error: [error details]
```

### Missing API Key:
```
⚠️ FAL_API_KEY not configured - skipping image moderation
```

---

## Verification Checklist

- [ ] Safe images upload successfully
- [ ] NSFW images are rejected
- [ ] Error messages are clear and user-friendly
- [ ] Fail-safe behavior works (rejects on API errors)
- [ ] Console logs show moderation status
- [ ] No TypeScript errors
- [ ] No runtime errors

---

## Expected Behavior Summary

| Scenario | Expected Result |
|----------|----------------|
| Safe pet photo | ✅ Uploads successfully |
| Safe family photo | ✅ Uploads successfully |
| Explicit content | ❌ Rejected with error message |
| API error | ❌ Rejected (fail-safe) |
| Missing API key | ⚠️ Skipped (dev mode only) |

---

## Notes

- **Fail-Safe:** If moderation API fails, images are rejected (safer than allowing)
- **Development Mode:** If `FAL_API_KEY` is not set, moderation is skipped
- **Production:** Always ensure `FAL_API_KEY` is set in production

---

**Ready to test!** 🚀

