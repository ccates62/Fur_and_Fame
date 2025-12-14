# ⚡ Quick Start Guide - Build Your First Page in 10 Minutes

**Goal:** Get the landing page live so you can see progress immediately.

---

## Step 1: Update Landing Page (5 minutes)

Replace the default Next.js page with your Fur & Fame hero section.

**File to edit:** `src/app/page.tsx`

**What to build:**
- Hero section with "Turn Your Pet Into a Legend" headline
- Tagline: "Royal portraits, superhero poses, Disney magic – instantly."
- 8 example portrait images (use placeholders for now)
- "Get Started" button that links to upload form
- Mobile-first, beautiful design

---

## Step 2: Create Upload Form Component (10 minutes)

**File to create:** `src/components/UploadForm.tsx`

**Fields needed:**
- Drag & drop photo upload
- Pet name (text)
- Breed selector (dropdown + "Other" option)
- Style dropdown (20 options - copy from roadmap)
- Extra notes (textarea)
- "Generate Preview" button

---

## Step 3: Test Locally (2 minutes)

```bash
npm run dev
```

Visit: `http://localhost:3000`

You should see:
- ✅ Beautiful landing page
- ✅ Upload form (even if it doesn't work yet)
- ✅ Mobile-responsive design

---

## Step 4: Deploy to Vercel (1 minute)

```bash
git add .
git commit -m "Add landing page and upload form"
git push
```

Vercel auto-deploys! Check: `https://furandfame.vercel.app`

---

## What's Next?

Once landing page is live:
1. Build fal.ai integration (generate portraits)
2. Add Stripe checkout
3. Connect Printful
4. Set up webhooks

**But start with the landing page - it's the foundation!**

---

## Need Help?

Just say:
- "Build the landing page" → I'll create the hero section
- "Create upload form" → I'll build the form component
- "Add the 8 example images" → I'll set up the gallery

Let's start! 🚀

