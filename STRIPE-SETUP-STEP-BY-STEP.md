# 💳 Stripe Business Account Setup - Step by Step

## What You'll Need Before Starting

✅ **Have Ready:**
- Mercury bank account routing number
- Mercury bank account number
- Articles of Organization PDF (from Important Files)
- EIN Confirmation Letter PDF (from Important Files)
- DBA Certificate PDF (from Important Files)
- Business address
- Your personal information (name, DOB, SSN last 4)

---

## Part 1: Log Into Stripe

### Step 1.1: Access Stripe Dashboard
1. Go to: **https://dashboard.stripe.com**
2. Log in with your Stripe account credentials
3. **IMPORTANT:** Make sure you're in **Live mode** (not Test mode)
   - Look at the top of the page
   - You should see "Live mode" or a toggle switch
   - If you see "Test mode", click the toggle to switch to Live mode

---

## Part 2: Connect Your Mercury Bank Account

### Step 2.1: Get Your Mercury Account Numbers
1. Open a new tab and go to: **https://mercury.com**
2. Log into your Mercury account
3. Find your account details:
   - Click on your business checking account
   - Look for:
     - **Routing number** (9 digits, usually starts with 0 or 1)
     - **Account number** (your account number)
4. **Write these down** or keep this tab open - you'll need them in a moment

### Step 2.2: Add Bank Account in Stripe
1. In Stripe dashboard, click **Settings** (gear icon in top right)
2. Click **Bank accounts and scheduling**
   - Or go directly to: https://dashboard.stripe.com/settings/bank_accounts
3. Click **"Add bank account"** button
4. Fill in the form:
   - **Account type:** Select "Business checking"
   - **Country:** United States
   - **Currency:** USD
   - **Routing number:** Enter your Mercury routing number (9 digits)
   - **Account number:** Enter your Mercury account number
5. Click **"Add bank account"**

### Step 2.3: Wait for Micro-Deposits
1. Stripe will send 2 small deposits to your Mercury account
2. **Timing:** This takes **1-2 business days**
3. **Amount:** Usually $0.01 to $0.99 each
4. **What to do:**
   - Check your Mercury account daily
   - Look for two deposits from "Stripe" or "STRIPE"
   - Note the exact amounts (e.g., $0.32 and $0.67)

### Step 2.4: Verify Micro-Deposits
1. Once you see the two deposits in Mercury:
2. Go back to Stripe: **Settings** → **Bank accounts and scheduling**
3. You should see a prompt to verify the deposits
4. Enter the two deposit amounts exactly as they appear
5. Click **"Verify"** or **"Confirm"**
6. ✅ Your bank account is now connected!

---

## Part 3: Complete Business Profile

### Step 3.1: Navigate to Business Profile
1. In Stripe dashboard, click **Settings**
2. Click **Business profile**
   - Or go directly to: https://dashboard.stripe.com/settings/business_profile

### Step 3.2: Fill Out Business Information

**Legal Business Name:**
- Enter: **Timberline Collective LLC**
- ⚠️ Must match exactly as registered

**Doing Business As (DBA):**
- Enter: **Fur and Fame**
- This is your trade name

**Business Type:**
- Select: **Limited Liability Company (LLC)**

**EIN (Employer Identification Number):**
- Enter: **41-2989148**
- Format: XX-XXXXXXX (with hyphen)

**Business Address:**
- Enter your registered business address
- Use the address from your LLC registration

**Phone Number:**
- Enter your business phone number
- Or your personal number if no business phone yet

**Website:**
- Enter your website URL (if you have one)
- Or leave blank if not ready yet

**Business Description:**
- Enter something like: "Digital services and e-commerce platform providing AI-generated pet portraits and related products"
- Or: "AI-generated custom pet portraits and related products"

### Step 3.3: Upload Required Documents

**Articles of Organization:**
1. Click **"Upload"** or **"Choose file"** for Articles of Organization
2. Navigate to where you saved your Articles of Organization PDF
   - Or use the file from your Important Files page
3. Select the file and upload
4. Wait for upload to complete

**EIN Confirmation Letter:**
1. Click **"Upload"** for EIN Confirmation Letter
2. Select your EIN confirmation PDF
   - Should show EIN: 41-2989148
3. Upload the file

**DBA Certificate:**
1. Click **"Upload"** for DBA Certificate
2. Select your Fur and Fame DBA certificate PDF
3. Upload the file

**Note:** Make sure all PDFs are:
- Clear and readable
- Not password protected
- Complete (all pages if multi-page)

### Step 3.4: Complete Identity Verification

Stripe will ask for your personal information (this is normal for business accounts):

**Your Information:**
- Full legal name
- Date of birth
- Last 4 digits of SSN
- Personal address

**Why they need this:**
- Required by law for business account verification
- You're the owner/authorized representative of the LLC

Fill in all required fields.

### Step 3.5: Review and Submit
1. **Review all information:**
   - Double-check business name spelling
   - Verify EIN is correct
   - Make sure all documents uploaded successfully
2. Click **"Submit"** or **"Save"**
3. You'll see a confirmation message
4. Stripe will begin reviewing your information

---

## Part 4: Wait for Verification

### Step 4.1: What Happens Next
- Stripe reviews your documents and information
- **Timing:** Usually takes **1-2 business days**
- You'll receive email updates from Stripe

### Step 4.2: Check Verification Status
1. Go to: **Settings** → **Business profile**
2. Look for verification status:
   - ✅ **Verified:** You're all set!
   - ⏳ **Pending:** Still under review (wait)
   - ❌ **Rejected:** Check what's missing

### Step 4.3: If Verification is Rejected
- Check email from Stripe for details
- Common issues:
  - Documents not clear (re-upload clearer versions)
  - Name mismatch (ensure exact spelling)
  - Missing information (fill in all fields)
- Fix the issue and resubmit

---

## Part 5: Test Your Setup (After Verification)

### Step 5.1: Test in Test Mode First
1. Switch to **Test mode** (toggle at top of Stripe dashboard)
2. Go to your website's checkout page
3. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
4. Complete a test purchase
5. Check Stripe dashboard to see the test transaction

### Step 5.2: Switch to Live Mode
1. Once test works, switch back to **Live mode**
2. Your real customers will use this
3. Real payments will process and deposit to Mercury

---

## 📋 Complete Checklist

Use this to track your progress:

### Bank Account Connection:
- [ ] Got Mercury routing number
- [ ] Got Mercury account number
- [ ] Added bank account in Stripe
- [ ] Waiting for micro-deposits (1-2 days)
- [ ] Received 2 deposits in Mercury account
- [ ] Verified deposit amounts in Stripe
- [ ] ✅ Bank account connected

### Business Verification:
- [ ] Filled out business profile
- [ ] Entered legal name: Timberline Collective LLC
- [ ] Entered DBA: Fur and Fame
- [ ] Entered EIN: 41-2989148
- [ ] Uploaded Articles of Organization
- [ ] Uploaded EIN Confirmation Letter
- [ ] Uploaded DBA Certificate
- [ ] Completed identity verification
- [ ] Submitted for review
- [ ] Waiting for approval (1-2 days)
- [ ] ✅ Verification complete

### Testing:
- [ ] Tested payment in Test mode
- [ ] Verified test transaction appears in Stripe
- [ ] Switched to Live mode
- [ ] Ready to accept real payments

---

## 🔗 Quick Links

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Bank Accounts:** https://dashboard.stripe.com/settings/bank_accounts
- **Business Profile:** https://dashboard.stripe.com/settings/business_profile
- **Mercury Login:** https://mercury.com

---

## ⚠️ Important Reminders

1. **Use Exact Business Name:**
   - ✅ "Timberline Collective LLC" (with LLC)
   - ❌ "Timberline Collective" (missing LLC)

2. **Use Business Bank Account:**
   - ✅ Mercury business checking
   - ❌ Personal checking account

3. **Live Mode for Real Payments:**
   - Make sure you're in Live mode when accepting real customer payments
   - Test mode is only for development/testing

4. **Document Quality:**
   - PDFs must be clear and readable
   - Use the documents from your Important Files page
   - If rejected, try scanning at higher quality

---

## 🆘 Need Help?

**If you get stuck:**
1. Check Stripe's help center: https://support.stripe.com
2. Look for notifications in Stripe dashboard
3. Check your email for updates from Stripe
4. Common issues are usually document quality or name mismatches

---

## ✅ Once Complete

After verification, you can:
- ✅ Accept real customer payments
- ✅ Process credit card transactions
- ✅ Receive payouts to Mercury (usually 2-7 days)
- ✅ Launch your business! 🚀

---

**Estimated Total Time:**
- Setup: 10-15 minutes
- Micro-deposit verification: 1-2 business days
- Business verification: 1-2 business days
- **Total: 2-4 business days**

Good luck! 🎉
