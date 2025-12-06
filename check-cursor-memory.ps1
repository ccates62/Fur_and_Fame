# Quick Cursor Memory Check
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cursor Memory Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$cursorProcesses = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue

if ($cursorProcesses) {
    $totalMemory = ($cursorProcesses | Measure-Object -Property WorkingSet64 -Sum).Sum / 1MB
    $rounded = [math]::Round($totalMemory, 2)
    
    Write-Host "Cursor is RUNNING" -ForegroundColor Yellow
    Write-Host "Total Memory: $rounded MB" -ForegroundColor $(if ($rounded -gt 500) { "Red" } elseif ($rounded -gt 300) { "Yellow" } else { "Green" })
    Write-Host "Number of processes: $($cursorProcesses.Count)" -ForegroundColor White
    Write-Host ""
    
    if ($rounded -gt 500) {
        Write-Host "⚠️  MEMORY IS HIGH! ($rounded MB)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Quick fixes:" -ForegroundColor Yellow
        Write-Host "1. Close unused tabs (Ctrl+K W)" -ForegroundColor White
        Write-Host "2. Close AI chat panels" -ForegroundColor White
        Write-Host "3. Restart Cursor (File → Exit)" -ForegroundColor White
        Write-Host ""
        Write-Host "To clear cache, run: .\reduce-cursor-memory.ps1" -ForegroundColor Cyan
    } elseif ($rounded -gt 300) {
        Write-Host "⚠️  Memory is getting high ($rounded MB)" -ForegroundColor Yellow
        Write-Host "Consider closing unused tabs or restarting Cursor soon." -ForegroundColor White
    } else {
        Write-Host "✅ Memory usage is good!" -ForegroundColor Green
    }
} else {
    Write-Host "Cursor is NOT running" -ForegroundColor Gray
    Write-Host "Memory usage: 0 MB" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

