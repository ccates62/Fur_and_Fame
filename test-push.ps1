# Test script to verify git push works
Write-Host "Testing Git Push..." -ForegroundColor Cyan

Set-Location c:\Users\ccate\Fur_and_Fame

Write-Host "`nCurrent branch:" -ForegroundColor Yellow
git branch --show-current

Write-Host "`nRemote URL:" -ForegroundColor Yellow
git remote -v

Write-Host "`nRecent commits:" -ForegroundColor Yellow
git log --oneline -3

Write-Host "`nAttempting push..." -ForegroundColor Yellow
$result = git push origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host $result
}
