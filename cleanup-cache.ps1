# Cleanup Script for Fur & Fame Project
# This script cleans up cache files and temporary data to improve performance

Write-Host "🧹 Cleaning up development cache files..." -ForegroundColor Cyan
Write-Host ""

$totalFreed = 0

# 1. Clean Next.js cache
if (Test-Path ".next") {
    $size = (Get-ChildItem -Path ".next" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "Removing Next.js cache (.next folder) - $([math]::Round($size, 2)) MB..." -ForegroundColor Yellow
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    $totalFreed += $size
    Write-Host "✅ Next.js cache cleaned" -ForegroundColor Green
} else {
    Write-Host "No .next folder found" -ForegroundColor Gray
}

# 2. Clean npm cache
Write-Host ""
Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>&1 | Out-Null
Write-Host "✅ npm cache cleaned" -ForegroundColor Green

# 3. Clean TypeScript build info (if exists)
if (Test-Path "*.tsbuildinfo") {
    $files = Get-ChildItem -Path "*.tsbuildinfo" -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        $size = $file.Length / 1MB
        Remove-Item -Path $file.FullName -Force -ErrorAction SilentlyContinue
        $totalFreed += $size
    }
    Write-Host "✅ TypeScript build info cleaned" -ForegroundColor Green
}

# 4. Clean temporary files
Write-Host ""
Write-Host "Cleaning temporary files..." -ForegroundColor Yellow
$tempFiles = @("*.log", "*.tmp", ".DS_Store", "Thumbs.db")
foreach ($pattern in $tempFiles) {
    Get-ChildItem -Path . -Filter $pattern -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
}
Write-Host "✅ Temporary files cleaned" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Cleanup complete! Freed approximately $([math]::Round($totalFreed, 2)) MB" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tips to keep your system fast:" -ForegroundColor Cyan
Write-Host "  - Run this script weekly: .\cleanup-cache.ps1" -ForegroundColor White
Write-Host "  - Restart your dev server regularly" -ForegroundColor White
Write-Host "  - Close unused browser tabs" -ForegroundColor White
Write-Host "  - Clear browser cache occasionally" -ForegroundColor White
