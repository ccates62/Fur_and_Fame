# Remove Secret from Git History
# This will rewrite git history to remove the secret from commit ff71d004

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Removing Secret from Git History" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "WARNING: This will rewrite git history!" -ForegroundColor Red
Write-Host "This requires a force push and will change commit hashes." -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Do you want to continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

$repoPath = "c:\Users\ccate\Fur_and_Fame"
Set-Location $repoPath

Write-Host ""
Write-Host "[1/3] Removing secret from git history..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

# Use git filter-repo or BFG Repo-Cleaner if available, otherwise use filter-branch
# First, try git filter-branch (built-in)
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch STRIPE-LIVE-KEYS-SETUP.md" --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to rewrite history" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Use GitHub's allow URL (one-time):" -ForegroundColor Yellow
    Write-Host "https://github.com/ccates62/Fur_and_Fame/security/secret-scanning/unblock-secret/36os3ZFXxijNIeyQMJpQ8QrHGIQ" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/3] Cleaning up backup refs..." -ForegroundColor Yellow
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host ""
Write-Host "[3/3] Force pushing to GitHub..." -ForegroundColor Yellow
Write-Host "WARNING: This will overwrite remote history!" -ForegroundColor Red
$confirm2 = Read-Host "Continue with force push? (yes/no)"
if ($confirm2 -ne "yes") {
    Write-Host "Cancelled. History rewritten locally but not pushed." -ForegroundColor Yellow
    exit 0
}

git push origin --force --all

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Secret removed from history" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "The secret has been removed from git history." -ForegroundColor Green
    Write-Host "Future pushes should work normally." -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR: Force push failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "You may need to:" -ForegroundColor Yellow
    Write-Host "1. Check your GitHub permissions" -ForegroundColor White
    Write-Host "2. Or use the GitHub allow URL instead:" -ForegroundColor White
    Write-Host "   https://github.com/ccates62/Fur_and_Fame/security/secret-scanning/unblock-secret/36os3ZFXxijNIeyQMJpQ8QrHGIQ" -ForegroundColor Cyan
    Write-Host ""
}

Read-Host "Press Enter to exit"
