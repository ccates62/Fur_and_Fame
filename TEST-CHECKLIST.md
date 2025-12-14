# 🧪 Testing Checklist - Fur & Fame

## Server Status
- [ ] Dev server starts without errors
- [ ] Server accessible at http://localhost:3000
- [ ] No console errors on startup

## Page Tests

### 1. Landing Page (/)
- [ ] Page loads successfully
- [ ] Hero section displays correctly
- [ ] "Turn Your Pet Into a Legend" headline visible
- [ ] CTA buttons are clickable
- [ ] Portrait gallery shows 8 example images
- [ ] Images load without errors
- [ ] Mobile responsive (test on different screen sizes)
- [ ] No console errors

### 2. Upload Form (/create)
- [ ] Page loads successfully
- [ ] Drag & drop area visible
- [ ] Can upload a photo (drag or click)
- [ ] Photo preview displays after upload
- [ ] Pet name field works
- [ ] Breed dropdown works (all options visible)
- [ ] "Other" breed option shows text input
- [ ] Style dropdown works (all 20 styles visible)
- [ ] Extra notes textarea works
- [ ] Form validation works (button disabled until required fields filled)
- [ ] "Generate Preview" button works (shows loading state)
- [ ] Error handling works (if API fails)
- [ ] No console errors

### 3. Variants Page (/variants)
- [ ] Page loads (with test data or redirects if no data)
- [ ] Shows loading state if needed
- [ ] Redirects to /create if no variants in sessionStorage
- [ ] Displays variants if data exists
- [ ] Can select a variant
- [ ] Selection highlights correctly
- [ ] "Continue to Checkout" button appears after selection
- [ ] Navigation works
- [ ] No console errors

### 4. Accounts Dashboard (/accounts)
- [ ] Page loads successfully
- [ ] Progress Tracker displays
- [ ] Progress bars show correct percentages
- [ ] Can click checkboxes to mark steps complete
- [ ] Progress saves to localStorage
- [ ] All service cards display
- [ ] No console errors

## API Route Tests

### 5. Upload API (/api/upload)
- [ ] Accepts POST requests
- [ ] Handles file uploads
- [ ] Returns image URL
- [ ] Error handling works

### 6. Generate API (/api/generate)
- [ ] Accepts POST requests
- [ ] Validates required fields
- [ ] Returns error if FAL_API_KEY not configured
- [ ] Error handling works

## Integration Tests

### 7. Full Flow (Manual)
- [ ] Upload photo → Form validates → Click "Generate Preview"
- [ ] Loading state shows
- [ ] API calls work (or show appropriate errors)
- [ ] Navigation flows correctly

## Browser Console
- [ ] No JavaScript errors
- [ ] No network errors (except expected API failures if keys not set)
- [ ] No React warnings

## Mobile Responsiveness
- [ ] Landing page looks good on mobile
- [ ] Upload form works on mobile
- [ ] All buttons are tappable
- [ ] Text is readable
- [ ] Images scale properly

---

## Project Completion Checklist (Local)

### Design & Branding
- [ ] Make Fur and Fame logo
- [ ] Add logo to landing page
- [ ] Add logo to navigation

---

## Known Issues / Notes

### Expected Behaviors (Not Bugs):
- Generate API will fail if FAL_API_KEY not in .env.local (this is expected)
- Upload API uses base64 (will upgrade to Supabase later)
- Variants page redirects if no data (this is correct behavior)

### To Test With Real API:
1. Add FAL_API_KEY to .env.local
2. Test actual portrait generation
3. Verify 3 variants are generated

---

## Quick Test Commands

```bash
# Start dev server
npm run dev

# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint

# Build for production
npm run build
```

---

## Test Results

**Date:** _______________
**Tester:** _______________

### Issues Found:
1. 
2. 
3. 

### Working Correctly:
- ✅
- ✅
- ✅

