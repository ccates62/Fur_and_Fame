# How to Store Your Business Information Securely

## ⚠️ IMPORTANT: Where to Store Sensitive Information

**ALL sensitive business information should ONLY be stored in `.env.local`**

The following files are **templates only** and should NOT contain real data:
- `BUSINESS-INFO.md` - Template/documentation only
- `business-info.env.example` - Template for .env.local structure

---

## Quick Setup Instructions

1. **Open your `.env.local` file** (create it if it doesn't exist)

2. **Copy the structure from `business-info.env.example`** and fill in your actual information

3. **Add your EIN and all LLC details** to `.env.local` only

4. **Save the file** - `.env.local` is already in `.gitignore`, so it won't be committed to git

---

## What Information to Store in .env.local

Use `business-info.env.example` as a template. Include:
- EIN (Employer Identification Number)
- LLC Name and Registry Number
- Business Address
- Registered Agent Information
- DBA/Trade Name
- Banking Information (after you open account)
- Payment Processing Details (after setup)

---

## Security Notes

✅ **Safe to commit to git:**
- `BUSINESS-INFO.md` (template only)
- `business-info.env.example` (template only)
- `BUSINESS-INFO-SETUP.md` (this file)

❌ **NEVER commit:**
- `.env.local` (already in .gitignore)
- Any file with real EIN, account numbers, or personal information

---

## Quick Access

- **Template structure**: See `business-info.env.example`
- **Documentation**: See `BUSINESS-INFO.md`
- **Your actual data**: Store ONLY in `.env.local`

