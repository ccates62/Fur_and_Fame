# Fix GitHub Secret Push Block
# This will remove the secret from git history and allow push

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing Secret in Git History" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$repoPath = "c:\Users\ccate\Fur_and_Fame"
Set-Location $repoPath

Write-Host "[1/4] Staging the fixed file..." -ForegroundColor Yellow
git add STRIPE-LIVE-KEYS-SETUP.md
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to stage file" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[2/4] Committing the fix..." -ForegroundColor Yellow
git commit -m "Security: Remove Stripe API keys from documentation"
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Commit failed or no changes" -ForegroundColor Yellow
}

Write-Host "[3/4] Attempting to push..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Push completed" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Note: The old commit with the secret is still in history." -ForegroundColor Yellow
    Write-Host "If GitHub still blocks, you may need to:" -ForegroundColor Yellow
    Write-Host "1. Use the GitHub URL to allow the secret once" -ForegroundColor White
    Write-Host "2. Or contact GitHub support to remove it from history" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 0
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  Push still blocked" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "The old commit (ff71d004) still contains the secret." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "1. Use GitHub's allow URL (one-time):" -ForegroundColor White
    Write-Host "   https://github.com/ccates62/Fur_and_Fame/security/secret-scanning/unblock-secret/36os3ZFXxijNIeyQMJpQ8QrHGIQ" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Or rewrite git history (advanced - will require force push)" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}
