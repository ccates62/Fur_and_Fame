# Auto-Push to GitHub Script
# Run this script to automatically add, commit, and push changes

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Auto-Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$repoPath = "c:\Users\ccate\Fur_and_Fame"
Set-Location $repoPath

# Step 1: Add all changes
Write-Host "[1/3] Adding all changes..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to add files" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Commit changes
Write-Host "[2/3] Committing changes..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Auto-push: $timestamp"
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: No changes to commit (or commit failed)" -ForegroundColor Yellow
}

# Step 3: Push to GitHub
Write-Host "[3/3] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to push to GitHub" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "- Not authenticated with GitHub"
    Write-Host "- Network connection issue"
    Write-Host "- Repository doesn't exist"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SUCCESS! Code pushed to GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your code is now on GitHub and Vercel will auto-deploy!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
