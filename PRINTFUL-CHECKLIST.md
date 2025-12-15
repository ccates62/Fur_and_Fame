# ✅ Printful Setup Checklist

**Print this page or keep it open while you set up!**

---

## 📝 Step 1: API Key Setup

- [ ] I have my Printful API key ready
- [ ] Opened `.env.local` file (or created it)
- [ ] Added line: `PRINTFUL_API_KEY=my_actual_key_here`
- [ ] Saved `.env.local`
- [ ] Restarted dev server (`npm run dev`)

**✅ Step 1 Complete!**

---

## 📝 Step 2: Create Products in Printful

- [ ] Went to [Printful Dashboard](https://www.printful.com/dashboard)
- [ ] Clicked "Product Templates" or "Add Product"
- [ ] Created **Canvas 12x12** product
- [ ] Created **Canvas 16x20** product
- [ ] Created **Mug 11oz** product
- [ ] Created any other products I want to sell
- [ ] Uploaded placeholder images for each

**✅ Step 2 Complete!**

---

## 📝 Step 3: Get Product IDs

- [ ] Ran command: `npm run printful:list-products`
- [ ] Saw list of products with IDs
- [ ] Wrote down **Canvas 12x12** Product ID: `_____`
- [ ] Wrote down **Canvas 12x12** Variant ID: `_____`
- [ ] Wrote down **Canvas 16x20** Product ID: `_____`
- [ ] Wrote down **Canvas 16x20** Variant ID: `_____`
- [ ] Wrote down **Mug** Product ID: `_____`
- [ ] Wrote down **Mug** Variant ID: `_____`

**✅ Step 3 Complete!**

---

## 📝 Step 4: Update Code

- [ ] Opened `src/lib/printful-client.ts`
- [ ] Found `PRINTFUL_PRODUCT_MAP` (around line 12)
- [ ] Updated `canvas-12x12` with my Product ID and Variant ID
- [ ] Updated `canvas-16x20` with my Product ID and Variant ID
- [ ] Updated `mug` with my Product ID and Variant ID
- [ ] Updated any other products I'm using
- [ ] Saved the file

**✅ Step 4 Complete!**

---

## 📝 Step 5: Test Everything

- [ ] Started dev server: `npm run dev`
- [ ] Went to `/checkout` page
- [ ] Selected a product and variant
- [ ] Opened browser console (F12)
- [ ] Checked for errors (should be none)
- [ ] Saw mockup images loading ✅
- [ ] (Optional) Made a test purchase
- [ ] (Optional) Checked Printful Dashboard → Orders (should see order)

**✅ Step 5 Complete!**

---

## 🎉 All Done!

Your Printful integration is now working! 🚀

**What happens now:**
- ✅ Customer buys product → Order goes to Printful automatically
- ✅ Printful prints and ships the product
- ✅ You see orders in Printful Dashboard

---

## 🆘 Having Issues?

**Check these common problems:**

- [ ] API key is in `.env.local` (not `.env`)
- [ ] Restarted dev server after adding API key
- [ ] Product IDs match what's in Printful dashboard
- [ ] Products exist in Printful store
- [ ] No extra spaces in API key

**Need more help?**
- See `PRINTFUL-SIMPLE-SETUP.md` for detailed steps
- See `PRINTFUL-QUICK-START.md` for quick reference
- Check Printful API docs: https://developers.printful.com/

---

**Last Updated:** Ready to use! 🎨

