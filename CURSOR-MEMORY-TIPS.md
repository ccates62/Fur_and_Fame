# 🧠 Cursor Memory Optimization Guide

## Current Issue
Cursor is using **614.8 MB+** of memory, which is causing slowdowns. Here's how to reduce it.

---

## 🚀 Quick Fixes (Do These First)

### 1. Close Unused Files
- **Each open tab uses memory**
- Press `Ctrl+K W` to close all tabs
- Or manually close tabs you're not using
- **Target:** Keep < 5 files open at once

### 2. Close AI Chat Panels
- AI chat uses significant memory
- Close chat panels when not actively using them
- Press `Escape` or click the X on chat panels

### 3. Disable Unused Extensions
1. Press `Ctrl+Shift+X` to open Extensions
2. Find extensions you don't use
3. Click the gear icon → **Disable**
4. **Heavy extensions to check:**
   - Multiple language servers
   - Unused linters/formatters
   - Unused AI extensions

### 4. Restart Cursor
- **Memory leaks build up over time**
- Close Cursor completely (File → Exit)
- Reopen it
- **Do this daily** if you use Cursor for hours

---

## ⚙️ Settings to Optimize

### Reduce AI Features (if not needed)
1. Press `Ctrl+,` to open Settings
2. Search for "AI" or "Features"
3. Disable:
   - Inline suggestions (if not using)
   - Auto-complete (if too aggressive)
   - Background indexing

### Reduce File Watching
1. Settings → Search "files.watcherExclude"
2. Add patterns for large folders:
   ```
   **/node_modules/**
   **/.next/**
   **/dist/**
   **/build/**
   ```

### Limit Search Indexing
1. Settings → Search "search.exclude"
2. Add:
   ```
   **/node_modules
   **/.next
   **/dist
   ```

---

## 🧹 Deep Clean (When Memory is Critical)

### Option 1: Clear Cache (Safe)
Run the script:
```powershell
cd "c:\Users\ccate\Fur_and_Fame"
.\reduce-cursor-memory.ps1
```
Choose "y" to clear cache (will close Cursor first).

### Option 2: Manual Cache Clear
1. **Close Cursor completely**
2. Open File Explorer
3. Go to: `%APPDATA%\Cursor`
4. Delete these folders:
   - `Cache`
   - `Code Cache`
   - `GPUCache`
   - `ShaderCache`
5. Restart Cursor

### Option 3: Reset Workspace Settings
1. Close Cursor
2. Delete: `%APPDATA%\Cursor\User\workspaceStorage`
3. Restart Cursor (will reset workspace state)

---

## 📊 Monitor Memory Usage

### Check Current Usage
1. Open Task Manager (`Ctrl+Shift+Esc`)
2. Go to "Details" tab
3. Find "Cursor" processes
4. Check "Memory" column

### Target Memory Usage
- **Good:** < 300 MB
- **Warning:** 300-500 MB
- **Critical:** > 500 MB (you're here!)

---

## 🔄 Daily Routine

**Every day:**
1. Close unused tabs before ending work
2. Restart Cursor if using it for > 4 hours
3. Check memory in Task Manager if things slow down

**Weekly:**
1. Run `.\reduce-cursor-memory.ps1`
2. Review and disable unused extensions
3. Clear cache if memory > 500 MB

---

## 🎯 Project-Specific Tips

### For This Project (Fur & Fame)
1. **Close large files** when not editing:
   - `src/app/accounts/page.tsx` (2473 lines - keep closed when not editing)
   - `open-accounts.html` (2275 lines)

2. **Use file search instead of opening all files:**
   - Press `Ctrl+P` to quickly open files
   - Don't keep them all open

3. **Close terminal panels** when not using:
   - Right-click terminal → Close Panel

---

## 🆘 Emergency: Memory Still Too High?

If Cursor is using > 800 MB:

1. **Save all work** (`Ctrl+K S`)
2. **Close Cursor completely**
3. **Restart your computer** (best option)
4. **Reopen Cursor** and your project

---

## 💡 Prevention Tips

1. **Don't open entire folders** - use search instead
2. **Close files immediately** after editing
3. **Limit AI chat sessions** - close old chats
4. **One project at a time** - don't open multiple workspaces
5. **Restart daily** - prevents memory leaks

---

## 📝 Quick Reference

| Action | Memory Saved | Time |
|--------|-------------|------|
| Close 10 tabs | ~50-100 MB | 10 sec |
| Close AI chat | ~50-150 MB | 5 sec |
| Disable 5 extensions | ~30-80 MB | 2 min |
| Clear cache | ~100-200 MB | 1 min |
| Restart Cursor | ~200-400 MB | 30 sec |

---

**Remember:** Your code files are saved on disk. It's safe to close Cursor and restart to free memory!

