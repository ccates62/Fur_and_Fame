# 📝 How to Update GitHub Project Status

As you progress on different parts of the Fur & Fame project, update the status in the accounts dashboard.

## Quick Update Guide

### Files to Edit:
1. **`src/app/accounts/page.tsx`** - For Next.js dashboard (when dev server is running)
2. **`open-accounts.html`** - For standalone HTML dashboard

### Status Options:
- `"planning"` - Repository created but not started yet
- `"active"` - Currently working on this project
- `"archived"` - Project completed or no longer maintained

### What to Update:

1. **Status**: Change from `"planning"` to `"active"` when you start working on a project
2. **Last Updated**: Update the date (format: `"YYYY-MM-DD"`) when you:
   - Push code to the repository
   - Make significant commits
   - Complete a milestone

### Example Updates:

**When you start working on Stripe integration:**
```typescript
{
  name: "fur-and-fame-stripe",
  status: "active", // Changed from "planning"
  lastUpdated: "2025-01-15", // Updated to today's date
  // ... rest of config
}
```

**When you complete a project:**
```typescript
{
  name: "fur-and-fame-email",
  status: "archived", // Mark as archived when done
  lastUpdated: "2025-02-01", // Final update date
  // ... rest of config
}
```

## Quick Reference - Current Projects:

| Project | Current Status | When to Update |
|---------|---------------|----------------|
| Fur_and_Fame | ✅ Active | Update date on each commit |
| fur-and-fame-api | ⏳ Planning | → Active when starting Supabase work |
| fur-and-fame-stripe | ⏳ Planning | → Active when starting Stripe integration |
| fur-and-fame-printful | ⏳ Planning | → Active when starting Printful work |
| fur-and-fame-ai | ⏳ Planning | → Active when starting AI generation |
| fur-and-fame-email | ⏳ Planning | → Active when starting email templates |
| fur-and-fame-video | ⏳ Planning | → Active when starting video generation |
| fur-and-fame-docs | ⏳ Planning | → Active when writing documentation |

## Pro Tip 💡

Update the status as you work - it helps track:
- What you're currently focused on
- What's been completed
- What's next in the queue

Just say "update [project-name] to active" and I'll update it for you!

