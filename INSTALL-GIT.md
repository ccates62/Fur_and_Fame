# 🔧 Installing Git on Windows

Git is not currently installed on your system. Here's how to install it:

---

## ✅ Quick Install (Recommended)

### Option 1: Download Git for Windows

1. **Go to:** https://git-scm.com/download/win
2. **Click** the download button (it will download `Git-2.x.x-64-bit.exe`)
3. **Run the installer:**
   - Click "Next" through the setup wizard
   - **Recommended settings:**
     - Use Visual Studio Code as default editor (or your preferred editor)
     - Use bundled OpenSSH
     - Use the OpenSSL library
     - Checkout Windows-style, commit Unix-style line endings
     - Use MinTTY (default terminal)
     - Enable file system caching
     - Enable Git Credential Manager
4. **Click "Install"**
5. **Wait for installation to complete**
6. **Restart PowerShell** (close and reopen)

---

### Option 2: Install via Winget (if available)

```powershell
winget install --id Git.Git -e --source winget
```

Then restart PowerShell.

---

## ✅ Verify Installation

After installing and restarting PowerShell, run:

```powershell
git --version
```

You should see something like: `git version 2.x.x`

---

## ✅ After Git is Installed

Once Git is installed, come back and we'll:
1. Initialize your repository
2. Create the GitHub repository
3. Push your code
4. Continue with Vercel setup

---

## 🐛 Troubleshooting

### "Git still not recognized after install"
- **Restart PowerShell completely** (close all windows)
- Or restart your computer
- Check if Git is in your PATH: `$env:PATH -split ';' | Select-String git`

### "Permission denied" during install
- Run PowerShell as Administrator
- Right-click PowerShell → "Run as Administrator"

---

## 📝 Next Steps

After Git is installed, we'll run:
```powershell
cd c:\Users\ccate\Fur_and_Fame
git init
git add .
git commit -m "Initial commit"
```

Then create the GitHub repository!
