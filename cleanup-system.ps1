# System Cleanup Script for Fur & Fame Project
# This helps free up disk space and improve performance

Write-Host "Cleaning up project files..." -ForegroundColor Cyan
Write-Host ""

$projectPath = "c:\Users\ccate\Fur_and_Fame"

# 1. Clean Next.js build cache
Write-Host "1. Cleaning Next.js build cache (.next folder)..." -ForegroundColor Yellow
if (Test-Path "$projectPath\.next") {
    $nextSize = (Get-ChildItem "$projectPath\.next" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Remove-Item "$projectPath\.next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   Freed up $([math]::Round($nextSize, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "   .next folder not found" -ForegroundColor Gray
}

# 2. Clean npm cache
Write-Host "2. Cleaning npm cache..." -ForegroundColor Yellow
try {
    npm cache clean --force 2>&1 | Out-Null
    Write-Host "   npm cache cleaned" -ForegroundColor Green
} catch {
    Write-Host "   Could not clean npm cache" -ForegroundColor Yellow
}

# 3. Clean temporary files
Write-Host "3. Cleaning temporary files..." -ForegroundColor Yellow
$tempPaths = @(
    "$env:TEMP\*",
    "$env:LOCALAPPDATA\Temp\*"
)
$totalFreed = 0
foreach ($path in $tempPaths) {
    try {
        $files = Get-ChildItem $path -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
        $size = ($files | Measure-Object -Property Length -Sum).Sum / 1MB
        $files | Remove-Item -Force -ErrorAction SilentlyContinue
        $totalFreed += $size
    } catch {
        # Ignore errors
    }
}
if ($totalFreed -gt 0) {
    Write-Host "   Freed up $([math]::Round($totalFreed, 2)) MB from temp files" -ForegroundColor Green
} else {
    Write-Host "   No old temp files to clean" -ForegroundColor Gray
}

# 4. Check node_modules size (informational only - don't delete)
Write-Host "4. Checking node_modules size..." -ForegroundColor Yellow
if (Test-Path "$projectPath\node_modules") {
    $nodeSize = (Get-ChildItem "$projectPath\node_modules" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   node_modules is $([math]::Round($nodeSize, 2)) MB (keeping for now)" -ForegroundColor Gray
    Write-Host "   Tip: If you need to free more space, you can delete node_modules and run npm install again" -ForegroundColor Cyan
} else {
    Write-Host "   node_modules not found" -ForegroundColor Gray
}

# 5. Clean PowerShell history (optional)
Write-Host "5. Cleaning PowerShell history..." -ForegroundColor Yellow
try {
    Clear-Host
    Write-Host "   PowerShell history cleared" -ForegroundColor Green
} catch {
    Write-Host "   Could not clear history" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Additional tips to improve speed:" -ForegroundColor Cyan
Write-Host "   - Close unused browser tabs" -ForegroundColor White
Write-Host "   - Restart your computer if it has been running for days" -ForegroundColor White
Write-Host "   - Stop the Next.js dev server when not in use (Ctrl+C)" -ForegroundColor White
Write-Host "   - Check Task Manager for programs using lots of memory" -ForegroundColor White
Write-Host ""
