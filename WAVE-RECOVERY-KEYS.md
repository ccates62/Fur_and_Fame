# 🔐 Wave Accounting - Recovery Keys

## Your Wave Recovery Keys

Store these securely - you'll need them to recover your Wave account if you lose access.

### Recovery Keys:
1. `1u14j6efwxeqt`
2. `smbkhs3gw4jpe`
3. `9qf86ku757fg3`
4. `qbpcy1m1354ey`
5. `eiotzz4js7bif`
6. `5aio9i9eny7ct`
7. `9hq8sipo13sa6`
8. `a4qojy9qyfmxf`

---

## ✅ Where These Are Stored

### 1. Environment Variables Template
- ✅ Added to `business-info.env.example`
- Copy these to your `.env.local` file

### 2. Your `.env.local` File
Add these lines:

```env
WAVE_RECOVERY_KEY_1=1u14j6efwxeqt
WAVE_RECOVERY_KEY_2=smbkhs3gw4jpe
WAVE_RECOVERY_KEY_3=9qf86ku757fg3
WAVE_RECOVERY_KEY_4=qbpcy1m1354ey
WAVE_RECOVERY_KEY_5=eiotzz4js7bif
WAVE_RECOVERY_KEY_6=5aio9i9eny7ct
WAVE_RECOVERY_KEY_7=9hq8sipo13sa6
WAVE_RECOVERY_KEY_8=a4qojy9qyfmxf
```

### 3. Vercel Environment Variables (Production)
- Add all 8 keys to Vercel dashboard
- Settings → Environment Variables
- Add each key separately

---

## 🔒 Security Notes

- **Never commit** `.env.local` to git (already in `.gitignore`)
- **Store securely** - these are needed for account recovery
- **Keep backup** - save these keys in a secure password manager
- **Don't share** - these are unique to your account

---

## 📝 How to Use Recovery Keys

If you ever lose access to your Wave account:

1. Go to Wave login page
2. Click "Forgot Password" or "Account Recovery"
3. Enter your recovery keys when prompted
4. Follow the recovery process

---

## ✅ Status

**Recovery keys have been added to:**
- ✅ `business-info.env.example` (template)
- ⚠️ **Action Required:** Copy to your `.env.local` file
- ⚠️ **Action Required:** Add to Vercel environment variables

---

**Keep these keys safe! 🔐**
